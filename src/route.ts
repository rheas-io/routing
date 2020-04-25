export class Route {

    /**
     * Name of this route
     * 
     * @var string
     */
    protected _name: string = "";

    /**
     * Uri prefix of the child routes
     * 
     * @var string
     */
    protected _prefix: string = "";

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

    constructor(path: string = "") {
        this._prefix = path;
    }

    /**
     * Creates a new route group. The parent of this route
     * will be set wherever is being registered.
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
    public static group(prefix: string = ""): Route {
        return new Route(prefix);
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
     * Sets the route prefix
     * 
     * @param prefix 
     */
    public prefix(prefix: string) {
        this._prefix = prefix;
    }

    /**
     * Sets the middlewares to be used by this route or route group.
     * 
     * @param middlewares 
     */
    public middlewares(middlewares: string | string[]) {

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
     * Returns the route prefix
     * 
     * @return string
     */
    public getPrefix(): string {
        return this._prefix;
    }

    /**
     * Middlewares to be used along with this route.
     * 
     * @return array
     */
    public routeMiddlewares(): string[] {
        let middlewares: string[] = [];
        const parent = this.getParent();

        if (parent instanceof Route) {
            middlewares = [...parent.routeMiddlewares()];
        }

        if (!this.shouldSkipMiddleware) {
            middlewares = [...middlewares, ...this._middlewares];
        }
        return middlewares;
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
}