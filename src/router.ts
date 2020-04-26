import { Route } from "./route";
import { KeyValue } from "@laress/contracts";
import { IMiddleware } from "@laress/contracts/middleware";
import { IRoute, IRouteRegistrar } from "@laress/contracts/routes";

export abstract class Router extends Route implements IRouteRegistrar {

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
     */
    protected abstract getApiRoutesRegistrar(): IRouteRegistrar;

    /**
     * Registers all the web routes
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
     * Adds a custom route registrar to the router. This allows adding more
     * route registration on the router other than the default api and web
     * routes.
     * 
     * @param name string
     * @param registrar new route registrar
     */
    public addRegistrar(name: string, registrar: IRouteRegistrar) {
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
    public deleteRegistrar(name: string) {
        if (["api", "web"].includes(name)) {
            throw Error("You can't delete the default route registrars.");
        }
        delete this.registrars[name];
    }
}