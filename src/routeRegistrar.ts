import { Route } from "./route";
import { IRouteRegistrar, IRoute } from "@laress/contracts/routes";

export class RouteRegistrar extends Route implements IRouteRegistrar {

    /**
     * List of middlewares to be used by this route
     * 
     * @var array
     */
    protected _middlewares: string[] = []

    /**
     * Route prefix to be used. For eg, change this to "api" to
     * register API routes, so that the routes defined in the routeList
     * doesn't have to prefix "api" before each route.
     * 
     * @var string
     */
    protected _path = "";

    /**
     * An exposed function that allows users to register their
     * routes
     * 
     * @return array
     */
    public routesList(): IRoute[] {
        return [];
    }
}