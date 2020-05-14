import { Route } from "./route";
import { KeyValue, IRequest } from "@laress/contracts";
import { IMiddleware } from "@laress/contracts/middleware";
import { IResponse } from "@laress/contracts/core/response";
import { IContainer } from "@laress/contracts/container/container";
import { IException } from "@laress/contracts/errors";
import { IRoute, IRouteRegistrar, IRouter, IRouteValidator } from "@laress/contracts/routes";
export declare class Router extends Route implements IRouter {
    /**
     * The container instance
     *
     * @var IContainer
     */
    protected app: IContainer;
    /**
     * List of all the middlewares used in the application
     *
     * @var array
     */
    protected middlewares_list: KeyValue<IMiddleware>;
    /**
     * Route registrars of this route.
     *
     * @var array
     */
    protected registrars: KeyValue<IRouteRegistrar>;
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
     * router of laress application. All the other routes are registered
     * under this route. This abstract router has to be extended in the
     * application routes folder or wherever the user finds it convenient.
     *
     * The derived route class has to register the apiRouteRegistrar and
     * webRouteRegistrar and set the router config to the derived class.
     *
     * Laress will read the config and use the router as the application
     * router.
     */
    constructor(app: IContainer);
    /**
     * Retreives the api route registrar
     *
     * @return IRouteRegistrar
     */
    protected getApiRoutesRegistrar(): IRouteRegistrar;
    /**
     * Registers all the web routes
     *
     * @return IRouteRegistrar
     */
    protected getWebRoutesRegistrar(): IRouteRegistrar;
    /**
     * Application requests are send here for processing. A route match is
     * checked for the request. If a match is found, dispatches the same to
     * controller via middlewares.
     *
     * @param request
     * @param response
     */
    processRequest(request: IRequest, response: IResponse): IResponse;
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
     * An exposed function that allows users to register their
     * routes
     *
     * @return array
     */
    routesList(): IRoute[];
    /**
     * Adds a custom route registrar to the router. This allows adding more
     * route registration on the router other than the default api and web
     * routes.
     *
     * @param name string
     * @param registrar new route registrar
     */
    addRegistrar(name: string, registrar: IRouteRegistrar): void;
    /**
     * Deletes a registrar from the router
     *
     * @param name name of the registrar to delete
     */
    deleteRegistrar(name: string): void;
}
