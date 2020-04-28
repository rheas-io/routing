import { IRoute } from "@laress/contracts/routes";
export declare class Route implements IRoute {
    /**
     * Name of this route
     *
     * @var string
     */
    protected _name: string;
    /**
     * Uri path of this group of routes
     *
     * @var string
     */
    protected _path: string;
    /**
     * Flag to check whether route middlewares have to be skipped
     * or not.
     *
     * @var boolean
     */
    protected _shouldSkipMiddleware: boolean;
    /**
     * Route specific middlewares
     *
     * @var array
     */
    protected _middlewares: string[];
    /**
     * Reference to parent route, if any
     *
     * @var Route
     */
    protected _parentRoute: IRoute | null;
    /**
     * A collection of child routes
     *
     * @var array
     */
    protected _childRoutes: IRoute[];
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
    constructor(path?: string);
    /**
     * Creates a new route group.
     *
     * @param prefix
     */
    static group(prefix?: string): Route;
    /**
     * Adds the child routes of this route. Also sets the child
     * routes parent to this route.
     *
     * @param routes
     */
    routes(...routes: IRoute[]): this;
    /**
     * Middlewares to be used along with this route.
     *
     * @return array
     */
    routeMiddlewares(): string[];
    /**
     * Returns the complete route path including prefixes and
     * parent paths.
     *
     * @return string
     */
    routePath(): string;
    /**
     * Sets the name of this route
     *
     * @param name
     */
    name(name: string): IRoute;
    /**
     * Sets the route group prefix
     *
     * @param path
     */
    prefix(path: string): IRoute;
    /**
     * Clears the path, replacing multiple slashes with single slash and
     * removing any trailing or leading slashes.
     *
     * @param path
     */
    private clearPath;
    /**
     * Sets the middlewares to be used by this route or route group.
     *
     * @param middlewares
     */
    middleware(middlewares: string | string[]): IRoute;
    /**
     * Sets the parent route of this route
     *
     * @param route
     */
    setParent(route: IRoute): void;
    /**
     * Returns the name of this route
     *
     * @return string
     */
    getName(): string;
    /**
     * Returns the route path
     *
     * @return string
     */
    getPath(): string;
    /**
     * Returns the parent route.
     *
     * @return Route|null
     */
    getParent(): IRoute | null;
    /**
     * Checks if the route has any parent route.
     *
     * @return boolean
     */
    hasParent(): boolean;
}
