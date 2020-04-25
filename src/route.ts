import { Str } from "@laress/support";

export class Route {

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
     * Flag to check whether route middlewares have to be skipped 
     * or not.
     * 
     * @var boolean
     */
    protected shouldSkipMiddleware: boolean = false;

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
    protected _parentRoute: Route | null = null;

    /**
     * A collection of child routes
     * 
     * @var array
     */
    protected _childRoutes: Route[] = [];

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
    public routes(...routes: Route[]) {
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

        if (!this.shouldSkipMiddleware) {
            fullMiddlewares = [...fullMiddlewares, ...this._middlewares];
        }
        return fullMiddlewares;
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
        fullPath += + this.getPath();

        return Str.trim(fullPath, "/");
    }

    /**
     * Sets the name of this route
     * 
     * @param name 
     */
    public name(name: string): Route {
        this._name = name;

        return this;
    }

    /**
     * Sets the route group prefix
     * 
     * @param path
     */
    public prefix(path: string) {
        this._path = this.clearPath(path);
    }

    /**
     * Clears the path, replacing multiple slashes with single slash and 
     * removing any trailing or leading slashes.
     * 
     * @param path 
     */
    protected clearPath(path: string): string {
        return Str.trim(Str.replaceWithOne(path.trim(), '/'), '/');
    }

    /**
     * Sets the middlewares to be used by this route or route group.
     * 
     * @param middlewares 
     */
    public middleware(middlewares: string | string[]) {

        if (!Array.isArray(middlewares)) {
            middlewares = Array.from(arguments);
        }
        this._middlewares = middlewares;
    }

    /**
     * Sets the parent route of this route
     * 
     * @param route 
     */
    public setParent(route: Route) {
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
    public getParent(): Route | null {
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