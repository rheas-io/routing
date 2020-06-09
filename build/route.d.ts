import { IUriComponent } from "@rheas/contracts/routes/uri";
import { IRoute, IRequestHandler } from "@rheas/contracts/routes";
export declare class Route implements IRoute {
    /**
     * All of the verbs supported by the route.
     *
     * @var array
     */
    static verbs: string[];
    /**
     * Http methods this route handles.
     *
     * @var array
     */
    protected _methods: string[];
    /**
    * Route controller action
    *
    * @var string
    */
    protected _action: string | IRequestHandler;
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
     * Sub domain/domain of this route
     *
     * @var string
     */
    protected _domain: string;
    /**
     * Flag to set if this route or route group is for http
     * connections.
     *
     * @var boolean
     */
    protected _httpRoute: boolean;
    /**
     * Route specific middlewares
     *
     * @var array
     */
    protected _middlewares: string[];
    /**
     * Middlewares that doesn't have to be run on this route.
     *
     * @var array
     */
    protected _excludedMiddlewares: string[];
    /**
     * Flag to check whether route middlewares have to be skipped
     * or not.
     *
     * @var boolean
     */
    protected _shouldSkipMiddleware: boolean;
    /**
     * Returns the uri components of this route path
     *
     * @var array
     */
    private _uriComponents;
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
     * Creates a new route for all methods
     *
     * @param uri
     * @param controller
     */
    static all(uri: string, controller: string | IRequestHandler): IRoute;
    /**
     * Creates a new route for GET and HEAD requests
     *
     * @param uri
     * @param controller
     */
    static get(uri: string, controller: string | IRequestHandler): IRoute;
    /**
     * Creates a new route for PUT requests
     *
     * @param uri
     * @param controller
     */
    static put(uri: string, controller: string | IRequestHandler): IRoute;
    /**
     * Creates a new route for post requests
     *
     * @param uri
     * @param controller
     */
    static post(uri: string, controller: string | IRequestHandler): IRoute;
    /**
     * Creates a new route for PATCH requests
     *
     * @param uri
     * @param controller
     */
    static patch(uri: string, controller: string | IRequestHandler): IRoute;
    /**
     * Creates a new route for DELETE requests
     *
     * @param uri
     * @param controller
     */
    static delete(uri: string, controller: string | IRequestHandler): IRoute;
    /**
     * Creates a new route for OPTIONS requests
     *
     * @param uri
     * @param controller
     */
    static options(uri: string, controller: string | IRequestHandler): IRoute;
    /**
     * Removes the domain scheme, leading and trailing slashes
     *
     * @param domain
     */
    static clearDomain(domain: string): string;
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
     * Only these middlewares will be resolved when processing
     * requests.
     *
     * @returns array
     */
    middlewaresToResolve(): string[];
    /**
     * Returns the domain of this route. If no domain is defined for the route,
     * parent routes are checked for a domain and if it exists on parent, that
     * value is returned.
     *
     * @return string
     */
    routeDomain(): string;
    /**
     * Returns the complete route path including prefixes and
     * parent paths.
     *
     * @return string
     */
    routePath(): string;
    /**
     * Returns all the child endpoints of this route. Endpoint is a route
     * with a valid method property.
     *
     * @return array
     */
    routeEndpoints(): IRoute[];
    /**
     * Checks if this route accepts http connection requests. Https requests are
     * the default and this function returns true only if the httpRoute flag is set
     * for this route or any parent routes.
     *
     * @return string
     */
    isHttpRoute(): boolean;
    /**
     * Sets the methods of this route
     *
     * @param methods
     */
    methods(methods: string | string[]): IRoute;
    /**
     * Sets the controller action of this route
     *
     * @param action
     */
    action(action: string | IRequestHandler): IRoute;
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
     * Sets the domian of this route
     *
     * @param domain
     */
    domain(domain: string): IRoute;
    /**
     * Sets the route to allow http requests.
     *
     * @return this
     */
    http(httpRoute?: boolean): IRoute;
    /**
     * Sets the middlewares to be used by this route or route group.
     *
     * @param middlewares
     */
    middleware(middlewares: string | string[]): IRoute;
    /**
     * Sets the excluded middlewares of this route.
     *
     * @param middlewares
     */
    withoutMiddleware(middlewares: string | string[]): IRoute;
    /**
     * Sets the parent route of this route
     *
     * @param route
     */
    setParent(route: IRoute): void;
    /**
     * Returns the methods of this route
     *
     * @return string
     */
    getMethods(): string[];
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
     * Returns the route request handler.
     *
     * @return IRequestHandler
     */
    getAction(): string | IRequestHandler;
    /**
     * Returns the parent route.
     *
     * @return Route|null
     */
    getParent(): IRoute | null;
    /**
     * Returns the uri components of this route.
     *
     * @return array
     */
    getUriComponents(): IUriComponent[];
    /**
     * Returns the excluded route middlewares.
     *
     * @returns array
     */
    getExcludedMiddlewares(): string[];
    /**
     * Checks if this is an endpoint
     *
     * @return boolean
     */
    isEndpoint(): boolean;
    /**
     * Checks if the route has any parent route.
     *
     * @return boolean
     */
    hasParent(): boolean;
}
