import path from 'path';
import { Str } from '@rheas/support/str';
import { RouteGroup } from './routeGroup';
import { IApp } from '@rheas/contracts/core/app';
import { RequestPipeline } from './requestPipeline';
import { UriValidator } from './validators/uriValidator';
import { HostValidator } from './validators/hostValidator';
import { NotFoundException } from '@rheas/errors/notFound';
import { SchemeValidator } from './validators/schemeValidator';
import { MethodValidator } from './validators/methodValidator';
import { IRequest, IResponse, KeyValue } from '@rheas/contracts';
import { IRequestHandler, IRouteGroup } from '@rheas/contracts/routes';
import { MethodNotAllowedException } from '@rheas/errors/methoNotAllowed';
import { IRoute, IRouter, IRouteValidator } from '@rheas/contracts/routes';
import { INameParams, IMiddleware, IMiddlewareManager } from '@rheas/contracts/middlewares';

export class Router implements IRouter {
    /**
     * The application instance.
     *
     * @var IApp
     */
    protected _app: IApp;

    /**
     * Applications middleware manager.
     *
     * @var IMiddlewareManager
     */
    protected _middlewares: IMiddlewareManager;

    /**
     * The folder where controller files are located. The location
     * is respective to the root path.
     *
     * @var string
     */
    protected controllerPath: string = 'app/controllers';

    /**
     * Route cached status.
     *
     * @var boolean
     */
    protected _cached: boolean = false;

    /**
     * Cache of all the registered routes.
     *
     * @var IRoute
     */
    protected _routes: IRoute[] = [];

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
     * @var object
     */
    protected _routeValidators: KeyValue<IRouteValidator> = {};

    /**
     * Cache of all the resolved controller functions for string route actions.
     * We don't cache the function route action which are already cached in the
     * route.
     *
     * @var object
     */
    protected _cachedControllers: KeyValue<IRequestHandler> = {};

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
     *
     * @param app
     * @param middlewares
     */
    constructor(app: IApp, middlewares: IMiddlewareManager) {
        this._app = app;
        this._middlewares = middlewares;
    }

    /**
     * Requests are send here after flowing through a series of global middlewares
     * in the request kernal.
     *
     * This handler finds a matching route for the request and continue the request
     * flow through the route middleware pipeline.
     *
     * Exceptions are thrown if a matchiing route is not found and/or when there are
     * some error processing the request. All the exceptions have to be caught in the
     * request kernal.
     *
     * @param request
     * @param response
     * @throws
     */
    public async handle(request: IRequest, response: IResponse): Promise<IResponse> {
        const route = this.matchingRoute(request);

        request.setRoute(route);

        return await this.dispatchToRoute(route, request, response);
    }

    /**
     * Dispatches the request to the route through middleware pipeline.
     *
     * This function creates a new pipeline with route action as the destination.
     * This pipeline consists of the route middlewares. The request reaches the route
     * action aka pipeline destination after flowing through all the route middlewares.
     *
     * @param route
     * @param req
     * @param res
     */
    public async dispatchToRoute(route: IRoute, req: IRequest, res: IResponse) {
        const destination = this.resolveDestination(route, req);

        return await new RequestPipeline()
            .through(this.middlewarePipesOfRoute(route))
            .sendTo(destination, req, res);
    }

    /**
     * Resolves middleware handlers for the route. Returns an array of middleware
     * handlers which executes the corresponding middleware with the params.
     *
     * @param route
     */
    public middlewarePipesOfRoute(route: IRoute): IMiddleware[] {
        return route.getMiddlewares().reduce((prev: IMiddleware[], current: string) => {
            const nameParam = this.routeRequiresMiddleware(route, current);

            if (nameParam !== false) {
                prev.push(...this._middlewares.resolveMiddlewares(nameParam));
            }
            return prev;
        }, []);
    }

    /**
     * Checks if the given middleware (by name) has to be executed or not. Returns
     * [name, params[]] if the middleware is not present in the exclusion list of route.
     *
     * @param route
     * @param middleware
     */
    public routeRequiresMiddleware(route: IRoute, middleware: string): INameParams | false {
        const [name, params] = this._middlewares.middlewareNameParams(middleware);

        // The route middleware exclusion list.
        const excluded = route.excludedMiddlewares();

        if (!excluded.has(name) && !excluded.has(middleware)) {
            return [name, params];
        }
        return false;
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
            const params = request.params().getStringObject();

            return await (<IRequestHandler>controllerAction)(req, res, params);
        };
    }

    /**
     * Resolves controller function from route action string.
     *
     * @param controller The controller action in `filePath@method` format
     */
    protected resolveController(controller: string): IRequestHandler {
        if (!this._cachedControllers[controller]) {
            const [className, method] = controller.trim().split('@');
            const controllerPath = this.controllerAbsolutePath(className);

            this._cachedControllers[controller] = require(controllerPath)[method];
        }

        return this._cachedControllers[controller];
    }

    /**
     * Returns path to the script. The path is respective to the root
     * path.
     *
     * @param filename
     */
    public controllerAbsolutePath(filename: string) {
        const rootPath: string = this._app.path('root') || '';

        return path.resolve(rootPath, Str.path(this.controllerPath), Str.path(filename));
    }

    /**
     * Checks the request for a matching route.
     *
     * @param request
     * @param response
     */
    public matchingRoute(request: IRequest): IRoute {
        let req_method = request.getMethod();
        req_method = req_method === 'HEAD' ? 'GET' : req_method;

        const route = this.matchAgainstRoutes(this._methodEndpoints[req_method] || [], request);

        if (route !== null) {
            return route;
        }

        const _methods = this.otherMethods(request, req_method);

        if (_methods.length > 0) {
            //TODO options method.
            throw new MethodNotAllowedException(
                _methods,
                `Url path does not support ${req_method} method. ` +
                    `Supported methods are: ${_methods.join(',')}`,
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
            if (this.matchAgainstRoutes(_endpoints[method] || [], request, false) !== null) {
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
     * @param method
     */
    protected matchAgainstRoutes(routes: IRoute[], req: IRequest, method = true): IRoute | null {
        const validators = Object.assign({}, this.routeValidators());

        !method && delete validators['method'];

        for (let route of routes) {
            if (this.routeMatches(route, req, Object.values(validators))) {
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
    protected routeMatches(route: IRoute, request: IRequest, validators: IRouteValidator[]) {
        for (let validator of validators) {
            if (!validator.matches(route, request)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Registers a list of routes on this router. The routes are registered
     * in the same order as the order in which it is defined.
     *
     * @param routes
     */
    public registerRoutes(...routes: (IRoute | IRouteGroup)[]): IRouter {
        routes.forEach((routeOrGroup) => {
            if (routeOrGroup instanceof RouteGroup) {
                return this.registerRoutes(...routeOrGroup.getRoutes());
            }
            return this.registerRoute(routeOrGroup as IRoute);
        });

        return this;
    }

    /**
     * Adds a route to the end of the routes list.
     *
     * @param route
     */
    public registerRoute(route: IRoute): IRouter {
        this._routes.push(route);

        if (this.cached()) {
            this.cacheNamedRoute(route);
            this.cacheMethodRoute(route);
        }
        return this;
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
        this._routes.forEach((route) => {
            this.cacheNamedRoute(route);
            this.cacheMethodRoute(route);
        });

        this._cached = true;
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
        route
            .getMethods()
            .filter((method) => method !== 'HEAD')
            .forEach((method) => {
                this._methodEndpoints[method] = this._methodEndpoints[method] || [];

                this._methodEndpoints[method].push(route);
            });
    }

    /**
     * Returns the validators that each request has to run to find a
     * route match.
     *
     * @return array of route validators.
     */
    protected routeValidators(): KeyValue<IRouteValidator> {
        if (Object.keys(this._routeValidators).length === 0) {
            this._routeValidators = {
                method: this.getMethodValidator(),
                uri: this.getUriValidator(),
                host: this.getHostValidator(),
                schema: this.getSchemeValidator(),
            };
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
        return new SchemeValidator(this._app.configs().get('app.production', true));
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
     * Returns route if a route with the name exists or null.
     *
     * @param name
     */
    public getNamedRoute(name: string): IRoute | null {
        return this._namedEndpoints[name] || null;
    }

    /**
     * Returns true if the router is cached.
     *
     * Application router is cached after all the services have booted.
     *
     * @returns
     */
    public cached(): boolean {
        return this._cached;
    }
}
