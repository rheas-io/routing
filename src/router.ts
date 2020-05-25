import path from "path";
import { Route } from "./route";
import { Str } from "@rheas/support";
import { RouteRegistrar } from "./routeRegistrar";
import { Exception } from "@rheas/errors/exception";
import { RequestPipeline } from "./requestPipeline";
import { UriValidator } from "./validators/uriValidator";
import { HostValidator } from "./validators/hostValidator";
import { NotFoundException } from "@rheas/errors/notFound";
import { MethodValidator } from "./validators/methodValidator";
import { SchemeValidator } from "./validators/schemeValidator";
import { KeyValue, IRequest, IResponse } from "@rheas/contracts";
import { IContainer } from "@rheas/contracts/container/container";
import { IExceptionHandler, IException } from "@rheas/contracts/errors";
import { MethodNotAllowedException } from "@rheas/errors/methoNotAllowed";
import { IRoute, IRouteRegistrar, IRouter, INameParams, IRouteValidator, IRequestHandler, IMiddleware } from "@rheas/contracts/routes";

export class Router extends Route implements IRouter {

    /**
     * The container instance
     * 
     * @var IContainer
     */
    protected app: IContainer;

    /**
     * The folder where controller files are located. The location
     * is respective to the root path.
     * 
     * @var string
     */
    protected controllerPath: string = "app/controllers";

    /**
     * List of all the middlewares used in the application
     * 
     * @var array
     */
    protected middlewares_list: KeyValue<IMiddleware> = {};

    /**
     * Route registrars of this route.
     * 
     * @var array
     */
    protected registrars: KeyValue<IRouteRegistrar> = {};

    /**
     * Cache of route by names.
     * 
     * @var object
     */
    protected _namedEndpoints: KeyValue<IRoute> = {};

    /**
     * Cache of routes grouped by methods.
     * 
     * @var object
     */
    protected _methodEndpoints: KeyValue<IRoute[]> = {};

    /**
     * All the route validators.
     * 
     * @var array
     */
    private _routeValidators: IRouteValidator[] = [];

    /**
     * This is the parent route of the application or in general, the core
     * router of Rheas application. All the other routes are registered 
     * under this route. This abstract router has to be extended in the
     * application routes folder or wherever the user finds it convenient.
     * 
     * The derived route class has to register the apiRouteRegistrar and
     * webRouteRegistrar and set the router config to the derived class.
     * 
     * Rheas will read the config and use the router as the application
     * router.
     */
    constructor(app: IContainer) {
        super();

        this.app = app;

        this.addRegistrar("api", this.getApiRoutesRegistrar());
        this.addRegistrar("web", this.getWebRoutesRegistrar());
    }

    /**
     * Retreives the api route registrar
     * 
     * @return IRouteRegistrar
     */
    protected getApiRoutesRegistrar(): IRouteRegistrar {
        return new RouteRegistrar('api');
    }

    /**
     * Registers all the web routes
     * 
     * @return IRouteRegistrar
     */
    protected getWebRoutesRegistrar(): IRouteRegistrar {
        return new RouteRegistrar();
    }

    /**
     * Application requests are send here for processing. The request is initially
     * sent to a pipeline of global middlewares (middlewares of this class). Once that's
     * done, they are forwarded to routeHandler, which checks for a matching route. If found
     * one, then the request is send through a pipeline of route middlewares.
     * 
     * @param request 
     * @param response 
     */
    public async handle(request: IRequest, response: IResponse): Promise<IResponse> {

        try {
            // Sends request through the middlewares of this class, which are
            // global middlewares. Final destination will be the routeHandler
            // function of this object which will continue the request flow through
            // the route middleware pipeline, if required.
            response = await this.dispatchToRoute(this, request, response);
        }
        catch (err) {
            // Catch any exception occured when processing the request and
            // create a response from the exception. This error response should
            // be returned.
            console.log(err);
            response = this.handleError(err, request, response);
        }
        return response;
    }

    /**
     * Handles the exceptions. Binds the exception to the response and logs the exception
     * if it has to be logged.
     * 
     * @param err 
     * @param req 
     * @param res 
     */
    protected handleError(err: Error | IException, req: IRequest, res: IResponse): IResponse {
        const exceptionHandler: IExceptionHandler = this.app.get('error');

        if (exceptionHandler) {
            err = exceptionHandler.prepareException(err);

            exceptionHandler.report(err);

            res = exceptionHandler.responseFromError(err, req, res);
        }
        return res;
    }

    /**
     * Dispatches the request to the route through middleware pipeline.
     * 
     * @param route 
     * @param req 
     * @param res 
     */
    protected async dispatchToRoute(route: IRoute, req: IRequest, res: IResponse): Promise<IResponse> {

        const destination =
            this === route ? this.routeHandler.bind(this) : this.resolveDestination(route, req);

        return await new RequestPipeline()
            .through(this.middlewarePipesOfRoute(route))
            .sendTo(destination, req, res);
    }

    /**
     * Requests are send here after flowing through a series of global middlewares, if no response
     * has been found.
     * 
     * This handler finds a matching route for the request and continue the request flow through
     * the route middleware pipeline.
     * 
     * @param request 
     * @param response 
     */
    private async routeHandler(request: IRequest, response: IResponse): Promise<IResponse> {

        const route = this.matchingRoute(request);

        return await this.dispatchToRoute(route, request, response);
    }

    /**
     * Resolves middleware handlers for the route. Returns an array
     * of middleware handlers which executes the corresponding middleware
     * with the params.
     * 
     * @param route 
     */
    private middlewarePipesOfRoute(route: IRoute): IMiddleware[] {

        return route.middlewaresToResolve().reduce(
            (prev: IMiddleware[], current: string) => {
                const nameParam = this.routeRequiresMiddleware(route, current);

                if (nameParam !== false) {
                    prev.push(this.resolveMiddleware(nameParam));
                }
                return prev;
            }, []);
    }

    /**
     * Returns middleware handler function.
     * 
     * @param nameParam
     */
    private resolveMiddleware([name, params]: INameParams): IMiddleware {

        return async (req, res, next) => {
            const typeMiddleware = typeof this.middlewares_list[name];

            if (typeMiddleware !== 'function') {
                throw new Exception(`Middleware ${name} has to be a function. Found: ${typeMiddleware}`);
            }
            return await this.middlewares_list[name](req, res, next, ...params)
        };
    }

    /**
     * Checks if the given middleware (by name) has to be executed or not. Returns 
     * [name, params[]] if the middleware is not present in the exclusion list of route.
     * 
     * @param route 
     * @param middleware 
     */
    private routeRequiresMiddleware(route: IRoute, middleware: string): INameParams | false {
        const [name, params] = this.middlewareNameParams(middleware);

        // The route middleware exclusion list.
        const excluded = route.getExcludedMiddlewares();

        if (!excluded.includes(name) && !excluded.includes(middleware)) {
            return [name, params];
        }
        return false;
    }

    /**
     * Returns middleware string as name and params array.
     * 
     * @param middleware 
     */
    private middlewareNameParams(middleware: string): INameParams {
        let [name, ...others] = middleware.trim().split(':');

        let params: string = others.join(':');

        return [name, params.length > 0 ? params.split(',') : []];
    }

    /**
     * Returns the final request handler of the route which is a request handler
     * executing the route action/controller method.
     * 
     * @param route 
     * @param req 
     */
    protected resolveDestination(route: IRoute, request: IRequest): IRequestHandler {

        return async (req, res) => {
            let controllerAction: string | IRequestHandler = route.getAction();

            if (typeof controllerAction !== 'function') {
                controllerAction = this.resolveController(controllerAction);
            }
            const params = request.params();

            return await (<IRequestHandler>controllerAction)(req, res, ...params);
        }
    }

    /**
     * Resolves controller from route action string.
     * 
     * @param controller 
     */
    protected resolveController(controller: string): IRequestHandler {

        let [className, method] = controller.trim().split('@');

        const controllerClass = require(this.controllerScript(className)).default;

        return (new controllerClass)[method];
    }

    /**
     * Returns path to the script. The path is respective to the root
     * path.
     * 
     * @param filename 
     */
    private controllerScript(filename: string) {
        const rootPath: string = this.app.get('path.root') || '';

        const controllerDir = Str.path(this.controllerPath);
        const controllerFile = Str.path(filename);

        return path.resolve(rootPath, controllerDir, controllerFile);
    }

    /**
     * Checks the request for a matching route.
     * 
     * @param request 
     * @param response 
     */
    public matchingRoute(request: IRequest): IRoute {

        let req_method = request.getMethod();
        req_method = (req_method === 'HEAD' ? 'GET' : req_method);

        const route = this.matchAgainstRoutes(this._methodEndpoints[req_method], request);

        if (route !== null) {
            return route;
        }

        const _methods = this.otherMethods(request, req_method);

        if (_methods.length > 0) {
            //TODO options method.
            throw new MethodNotAllowedException(
                _methods,
                `Url path does not support ${req_method} method. Supported methods are: ${_methods.join(',')}`
            );
        }

        throw new NotFoundException();
    }

    /**
     * Checks if a request for any other verb is defined.
     * 
     * @param request 
     * @param original_method 
     */
    private otherMethods(request: IRequest, original_method: string): string[] {

        const _methods = [];
        const _endpoints = Object.assign({}, this._methodEndpoints);

        delete _endpoints[original_method];

        for (let method in _endpoints) {
            if (this.matchAgainstRoutes(_endpoints[method], request) !== null) {
                _methods.push(method);
            }
        }
        return _methods;
    }

    /**
     * Checks if a request matches against a set of routes. First match is 
     * returned if one exists and null otherwise.
     * 
     * @param routes 
     * @param request 
     */
    protected matchAgainstRoutes(routes: IRoute[], request: IRequest): IRoute | null {

        this._routeValidators = this.routeValidators();

        for (let route of routes) {
            if (this.routeMatches(route, request, this._routeValidators)) {
                return route;
            }
        }
        return null;
    }

    /**
     * Checks if a route matches for the request. Match is done against the validators
     * submitted.
     * 
     * @param route 
     * @param request 
     * @param validators 
     */
    protected routeMatches(route: IRoute, request: IRequest, validators: IRouteValidator[]): boolean {

        for (let validator of validators) {
            if (!validator.matches(route, request)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Returns the validators that each request has to run to find a
     * route match.
     * 
     * @return array of route validators. 
     */
    protected routeValidators(): IRouteValidator[] {

        if (this._routeValidators.length === 0) {
            this._routeValidators = [
                this.getMethodValidator(), this.getUriValidator(),
                this.getHostValidator(), this.getSchemeValidator(),
            ];
        }
        return this._routeValidators;
    }

    /**
     * New host validator. Domain/subdomain checks.
     * 
     * @return
     */
    protected getHostValidator(): IRouteValidator {
        return new HostValidator();
    }

    /**
     * New scheme validator. http or https check
     * 
     * @return 
     */
    protected getSchemeValidator(): IRouteValidator {
        return new SchemeValidator();
    }

    /**
     * New route method validator.
     * 
     * @return
     */
    protected getMethodValidator(): IRouteValidator {
        return new MethodValidator();
    }

    /**
     * New uri validator. Checks if the request url and route path matches.
     * 
     * @return
     */
    protected getUriValidator(): IRouteValidator {
        return new UriValidator();
    }

    /**
     * Caches the routes by name and request methods. All these cache contains 
     * only the final endpoint routes. Each endpoint route will traverse in
     * reverse to match the request uri and to obtain the middlewares. 
     * 
     * Router will cache the endpoint routes by name and methods for faster 
     * route  matching.
     */
    public cacheRoutes(): void {

        this.routes(...this.routesList());

        this.routeEndpoints().forEach(route => {
            this.cacheNamedRoute(route);
            this.cacheMethodRoute(route);
        });
    }

    /**
     * Caches the route by name if it has a non-empty name.
     * 
     * @param route 
     */
    protected cacheNamedRoute(route: IRoute): void {
        const name = route.getName().trim();

        if (name.length > 0) {
            this._namedEndpoints[name] = route;
        }
    }

    /**
     * Sorts the route method and cache them into the appropriate array. This allows 
     * quick retreival of request route by querying through the method array.
     * 
     * @param route 
     */
    protected cacheMethodRoute(route: IRoute): void {
        route.getMethods().filter(method => method !== 'HEAD').forEach(method => {
            this._methodEndpoints[method] = this._methodEndpoints[method] || [];

            this._methodEndpoints[method].push(route);
        });
    }

    /**
     * Router middlewares shouldn't be send to the routes. 
     * 
     * Middlewares of this router are global middlewares, that has to 
     * be executed no matter what and before finding the matching route.
     * 
     * @override
     * 
     * @return array
     */
    public routeMiddlewares(): string[] {
        return [];
    }

    /**
     * Only these middlewares will be resolved when processing requests.
     * 
     * @returns array
     */
    public middlewaresToResolve(): string[] {
        return this._middlewares;
    }

    /**
     * An exposed function that allows users to register their
     * routes
     * 
     * @return array
     */
    public routesList(): IRoute[] {
        const routes = [];

        for (let name in this.registrars) {
            const registrar = this.registrars[name];
            routes.push(registrar.routes(...registrar.routesList()));
        }

        return routes;
    }

    /**
     * Adds a custom route registrar to the router. This allows adding more
     * route registration on the router other than the default api and web
     * routes.
     * 
     * @param name string
     * @param registrar new route registrar
     */
    public addRegistrar(name: string, registrar: IRouteRegistrar): void {
        if (!name) {
            throw Error("Please provide a valid route name");
        }
        if (this.registrars[name] instanceof Route) {
            throw Error("A route registrar of that name already exists.");
        }
        this.registrars[name] = registrar;
    }

    /**
     * Deletes a registrar from the router
     * 
     * @param name name of the registrar to delete
     */
    public deleteRegistrar(name: string): void {
        if (["api", "web"].includes(name)) {
            throw Error("Unable to delete default route registrars [api, web].");
        }
        delete this.registrars[name];
    }
}