import { Route } from "./route";
import { KeyValue } from "@laress/contracts";
import { IMiddleware } from "@laress/contracts/middleware";
import { IRoute, IRouteRegistrar, IRouter } from "@laress/contracts/routes";
export declare class Router extends Route implements IRouter {
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
     * Caches all the endpoint routes
     *
     * @var array
     */
    protected _allEndpoints: IRoute[];
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
    constructor();
    processRequest(request: import("@laress/contracts").IRequest, response: import("@laress/contracts/core/response").IResponse): void;
    matchingRoute(request: import("@laress/contracts").IRequest, response: import("@laress/contracts/core/response").IResponse): IRoute;
    dispatchToRoute(route: IRoute, request: import("@laress/contracts").IRequest, response: import("@laress/contracts/core/response").IResponse): import("@laress/contracts/core/response").IResponse;
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
     * An exposed function that allows users to register their
     * routes
     *
     * @return array
     */
    routesList(): IRoute[];
    /**
     * Caches the routes by name and request methods. All these cache contains
     * only the final endpoint routes. Each endpoint route will traverse in
     * reverse to match the request uri and to obtain the middlewares.
     *
     * Router will also cache the endpoint routes by name and methods for faster
     * route  matching.
     */
    cacheRoutes(): void;
    /**
     * Caches all the routes by storing the whole uri to a
     * route. This allows easy route match operations by the router.
     */
    private cacheAllRoutes;
    /**
     * Caches all the routes by names. This enables easy URl generation.
     */
    private cacheByNames;
    /**
     * Caches all the routes by methods. This allows further sorting down
     * the routes enabling quick retreival of request route by querying through
     * the method.
     */
    private cacheByMethods;
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
