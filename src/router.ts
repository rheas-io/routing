import { Route } from "./route";
import { KeyValue } from "@laress/contracts";
import { IMiddleware } from "@laress/contracts/middleware";
import { IRoute, IRouteRegistrar, IRouter } from "@laress/contracts/routes";

export abstract class Router extends Route implements IRouter {

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
    constructor() {
        super();

        this.addRegistrar("api", this.getApiRoutesRegistrar());
        this.addRegistrar("web", this.getWebRoutesRegistrar());
    }

    /**
     * Retreives the api route registrar
     * 
     * @return IRouteRegistrar
     */
    protected abstract getApiRoutesRegistrar(): IRouteRegistrar;

    /**
     * Registers all the web routes
     * 
     * @return IRouteRegistrar
     */
    protected abstract getWebRoutesRegistrar(): IRouteRegistrar;

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
     * Caches the routes by name and request methods. All these cache
     * contains only the final endpoint routes. Routes will traverse in
     * reverse to match the request uri and to obtain the middlewares. Router
     * will also cache
     */
    public cacheRoutes(): void {

        this.cacheAllRoutes();

        this.cacheByNames();

        this.cacheByMethods();
    }

    /**
     * Caches all the routes by storing the whole uri to a 
     * route. This allows easy route match operations by the router.
     */
    private cacheAllRoutes(): void {

    }

    /**
     * Caches all the routes by names. This enables easy URl
     * generation.
     */
    private cacheByNames(): void {

    }

    /**
     * Caches all the routes by methods. This allows further sorting down
     * the 
     */
    private cacheByMethods(): void {

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
            throw Error("You can't delete the default route registrars.");
        }
        delete this.registrars[name];
    }
}