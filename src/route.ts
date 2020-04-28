import { Str } from "@laress/support";
import { IRoute } from "@laress/contracts/routes";
import { IRequest } from "@laress/contracts";

export class Route implements IRoute {

    /**
     * Name of this route
     * 
     * @var string
     */
    protected _name: string = "";

    /**
     * Uri path of this group of routes
     * 
     * @var string
     */
    protected _path: string = "";

    /**
     * Sub domain/domain of this route
     * 
     * @var string
     */
    protected _domain: string = "";

    /**
     * Flag to check whether route middlewares have to be skipped 
     * or not.
     * 
     * @var boolean
     */
    protected _shouldSkipMiddleware: boolean = false;

    /**
     * Route specific middlewares
     * 
     * @var array
     */
    protected _middlewares: string[] = [];

    /**
     * Reference to parent route, if any
     * 
     * @var Route
     */
    protected _parentRoute: IRoute | null = null;

    /**
     * A collection of child routes
     * 
     * @var array
     */
    protected _childRoutes: IRoute[] = [];

    /**
     * Creates a new route. The parent of this route
     * will be set wherever this route gets registered.
     * 
     * For eg, say a new route group is created in api routes like 
     * 
     * Route::group('api').routes(
     *      Route::post('user','userController@create'),
     *      Route::group('user').routes(
     *          Route::get(':id','userController@index')
     *      ),
     * );
     * 
     * In the above example, the inner route group will have the api route
     * as its parent and the route with :id param will have the user group as
     * parent.
     * 
     * @return Route
     */
    constructor(path: string = "") {
        this.prefix(path);
    }

    /**
     * Creates a new route group.
     * 
     * @param prefix 
     */
    public static group(prefix: string = ""): Route {
        return new Route(prefix);
    }

    /**
     * Adds the child routes of this route. Also sets the child
     * routes parent to this route.
     * 
     * @param routes 
     */
    public routes(...routes: IRoute[]) {
        routes.forEach(route => {
            route.setParent(this);
        });

        this._childRoutes = routes;

        return this;
    }

    /**
     * Middlewares to be used along with this route.
     * 
     * @return array
     */
    public routeMiddlewares(): string[] {
        let fullMiddlewares: string[] = [];

        if (this.hasParent()) {
            //@ts-ignore
            fullMiddlewares = [...this.getParent().routeMiddlewares()];
        }

        if (!this._shouldSkipMiddleware) {
            fullMiddlewares = [...fullMiddlewares, ...this._middlewares];
        }
        return fullMiddlewares;
    }

    /**
     * Returns the domain of this route. If no domain is defined for the route, 
     * parent routes are checked for a domain and if it exists on parent, that 
     * value is returned.
     * 
     * @return string
     */
    public routeDomain(): string {
        if (this._domain) {
            return this._domain;
        }

        if (this.hasParent()) {
            //@ts-ignore
            return this.getParent().getDomain();
        }
        return this._domain;
    }

    /**
     * Returns the complete route path including prefixes and
     * parent paths.
     * 
     * @return string
     */
    public routePath(): string {
        let fullPath: string = "";

        if (this.hasParent()) {
            //@ts-ignore
            fullPath = this.getParent().routePath() + "/";
        }
        fullPath += this.getPath();

        return Str.trim(fullPath, "/");
    }

    /**
     * Checks the status
     * 
     * @param request 
     */
    public matches(request: IRequest): boolean {
        return false;
    }

    /**
     * Sets the name of this route
     * 
     * @param name 
     */
    public name(name: string): IRoute {
        this._name = name;

        return this;
    }

    /**
     * Sets the route group prefix
     * 
     * @param path
     */
    public prefix(path: string): IRoute {
        this._path = this.clearPath(path);

        return this;
    }

    /**
     * Sets the domian of this route
     * 
     * @param domain
     */
    public domain(domain: string): IRoute {
        this._domain = this.clearDomain(domain);

        return this;
    }

    /**
     * Removes the domain scheme, leading and trailing slashes
     * 
     * @param domain 
     */
    private clearDomain(domain: string): string {
        domain = domain.trim();

        domain = domain.replace("http://", "");
        domain = domain.replace("https://", "");

        return Str.trim(domain, "/");
    }

    /**
     * Clears the path, replacing multiple slashes with single slash and 
     * removing any trailing or leading slashes.
     * 
     * @param path 
     */
    private clearPath(path: string): string {
        return Str.trim(Str.replaceWithOne(path.trim(), '/'), '/');
    }

    /**
     * Sets the middlewares to be used by this route or route group.
     * 
     * @param middlewares 
     */
    public middleware(middlewares: string | string[]): IRoute {

        if (!Array.isArray(middlewares)) {
            middlewares = Array.from(arguments);
        }
        this._middlewares = middlewares;

        return this;
    }

    /**
     * Sets the parent route of this route
     * 
     * @param route 
     */
    public setParent(route: IRoute) {
        this._parentRoute = route;
    }

    /**
     * Returns the name of this route
     * 
     * @return string
     */
    public getName(): string {
        return this._name;
    }

    /**
     * Returns the route path
     * 
     * @return string
     */
    public getPath(): string {
        return this._path;
    }

    /**
     * Returns the parent route.
     * 
     * @return Route|null
     */
    public getParent(): IRoute | null {
        return this._parentRoute;
    }

    /**
     * Checks if the route has any parent route.
     * 
     * @return boolean
     */
    public hasParent(): boolean {
        return this.getParent() instanceof Route;
    }
}