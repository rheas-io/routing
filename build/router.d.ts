import { Route } from "./route";
import { IApp } from "@rheas/contracts/core/app";
import { KeyValue, IRequest, IResponse } from "@rheas/contracts";
import { IException } from "@rheas/contracts/errors";
import { IRoute, IRouter, IRouteValidator, IRequestHandler, IMiddleware } from "@rheas/contracts/routes";
export declare class Router extends Route implements IRouter {
    /**
     * The application instance
     *
     * @var IApp
     */
    protected app: IApp;
    /**
     * The folder where controller files are located. The location
     * is respective to the root path.
     *
     * @var string
     */
    protected controllerPath: string;
    /**
     * List of all the middlewares used in the application
     *
     * @var array
     */
    protected middlewares_list: KeyValue<IMiddleware>;
    /**
     * Cache of route by names.
     *
     * @var object
     */
    protected _namedEndpoints: KeyValue<IRoute>;
    /**
     * Cache of routes grouped by methods.
     *
     * @var object
     */
    protected _methodEndpoints: KeyValue<IRoute[]>;
    /**
     * All the route validators.
     *
     * @var array
     */
    private _routeValidators;
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
    constructor(app: IApp);
    /**
     * Application requests are send here for processing. The request is initially
     * sent to a pipeline of global middlewares (middlewares of this class). Once that's
     * done, they are forwarded to routeHandler, which checks for a matching route. If found
     * one, then the request is send through a pipeline of route middlewares.
     *
     * @param request
     * @param response
     */
    handle(request: IRequest, response: IResponse): Promise<IResponse>;
    /**
     * Handles the exceptions. Binds the exception to the response and logs the exception
     * if it has to be logged.
     *
     * @param err
     * @param req
     * @param res
     */
    protected handleError(err: Error | IException, req: IRequest, res: IResponse): IResponse;
    /**
     * Dispatches the request to the route through middleware pipeline.
     *
     * @param route
     * @param req
     * @param res
     */
    protected dispatchToRoute(route: IRoute, req: IRequest, res: IResponse): Promise<IResponse>;
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
    private routeHandler;
    /**
     * Resolves middleware handlers for the route. Returns an array
     * of middleware handlers which executes the corresponding middleware
     * with the params.
     *
     * @param route
     */
    private middlewarePipesOfRoute;
    /**
     * Returns middleware handler function.
     *
     * @param nameParam
     */
    private resolveMiddleware;
    /**
     * Checks if the given middleware (by name) has to be executed or not. Returns
     * [name, params[]] if the middleware is not present in the exclusion list of route.
     *
     * @param route
     * @param middleware
     */
    private routeRequiresMiddleware;
    /**
     * Returns middleware string as name and params array.
     *
     * @param middleware
     */
    private middlewareNameParams;
    /**
     * Returns the final request handler of the route which is a request handler
     * executing the route action/controller method.
     *
     * @param route
     * @param req
     */
    protected resolveDestination(route: IRoute, request: IRequest): IRequestHandler;
    /**
     * Resolves controller function from route action string.
     *
     * @param controller
     */
    protected resolveController(controller: string): IRequestHandler;
    /**
     * Returns path to the script. The path is respective to the root
     * path.
     *
     * @param filename
     */
    private controllerScript;
    /**
     * Checks the request for a matching route.
     *
     * @param request
     * @param response
     */
    matchingRoute(request: IRequest): IRoute;
    /**
     * Checks if a request for any other verb is defined.
     *
     * @param request
     * @param original_method
     */
    private otherMethods;
    /**
     * Checks if a request matches against a set of routes. First match is
     * returned if one exists and null otherwise.
     *
     * @param routes
     * @param request
     */
    protected matchAgainstRoutes(routes: IRoute[], request: IRequest): IRoute | null;
    /**
     * Checks if a route matches for the request. Match is done against the validators
     * submitted.
     *
     * @param route
     * @param request
     * @param validators
     */
    protected routeMatches(route: IRoute, request: IRequest, validators: IRouteValidator[]): boolean;
    /**
     * Returns the validators that each request has to run to find a
     * route match.
     *
     * @return array of route validators.
     */
    protected routeValidators(): IRouteValidator[];
    /**
     * Router middlewares shouldn't be send to the routes.
     *
     * Middlewares of this router are global middlewares, that has to
     * be executed no matter what and before finding the matching route.
     *
     * To eliminate having this added to the endpoint middleware list,
     * we simpley overrides it with an empty array.
     *
     * @override
     *
     * @return array
     */
    routeMiddlewares(): string[];
    /**
     * Only these middlewares will be resolved when processing requests.
     *
     * @returns array
     */
    middlewaresToResolve(): string[];
    /**
     * Caches the routes by name and request methods. All these cache contains
     * only the final endpoint routes. Each endpoint route will traverse in
     * reverse to match the request uri and to obtain the middlewares.
     *
     * Router will cache the endpoint routes by name and methods for faster
     * route  matching.
     */
    cacheRoutes(): void;
    /**
     * Caches the route by name if it has a non-empty name.
     *
     * @param route
     */
    protected cacheNamedRoute(route: IRoute): void;
    /**
     * Sorts the route method and cache them into the appropriate array. This allows
     * quick retreival of request route by querying through the method array.
     *
     * @param route
     */
    protected cacheMethodRoute(route: IRoute): void;
    /**
     * New host validator. Domain/subdomain checks.
     *
     * @return
     */
    protected getHostValidator(): IRouteValidator;
    /**
     * New scheme validator. http or https check
     *
     * @return
     */
    protected getSchemeValidator(): IRouteValidator;
    /**
     * New route method validator.
     *
     * @return
     */
    protected getMethodValidator(): IRouteValidator;
    /**
     * New uri validator. Checks if the request url and route path matches.
     *
     * @return
     */
    protected getUriValidator(): IRouteValidator;
    /**
     * Returns route if a route with the name exists or null.
     *
     * @param name
     */
    getNamedRoute(name: string): IRoute | null;
}
