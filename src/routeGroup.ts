import { RouteBase } from './routeBase';
import { Str } from '@rheas/support/str';
import { IRoute, IRouteGroup } from '@rheas/contracts/routes';

export class RouteGroup extends RouteBase implements IRouteGroup {
    /**
     * Uri prefix of this route group
     *
     * @var string
     */
    protected _prefix: string = '';

    /**
     * Cache of group routes.
     *
     * @var Array
     */
    protected _routes: Array<IRoute | RouteGroup> = [];

    /**
     * Creates a new route for the given path.
     *
     * @return Route
     */
    constructor(prefix: string = '') {
        super();

        this._prefix = Str.path(prefix);
    }

    /**
     * Sets the route group prefix
     *
     * @param prefix
     */
    public prefix(prefix: string): IRouteGroup {
        this._prefix = Str.path(prefix);

        return this;
    }

    /**
     * Returns the group prefix.
     *
     * @returns
     */
    public getPrefix(): string {
        return this._prefix;
    }

    /**
     * Registers the routes on this route group.
     *
     * This function sets a new list of routes and does not keep any previously
     * registered routes, if called multiple times. In short, acts like a route
     * list reset.
     *
     * @param routes
     */
    public routes(...routes: (IRoute | RouteGroup)[]): IRouteGroup {
        this._routes = routes;

        return this;
    }

    /**
     * Returns all the routes with group properties prepended to it.
     *
     * @returns
     */
    public getRoutes(parent?: IRouteGroup): IRoute[] {
        const routes: IRoute[] = [];

        this._routes.forEach((route) => {
            if (route instanceof RouteGroup) {
                return routes.push(...route.getRoutes(this));
            }
            route = route.setGroupProperties(this);

            if (parent) {
                route = route.setGroupProperties(parent);
            }
            return routes.push(route);
        });

        return routes;
    }
}
