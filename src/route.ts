import { Str } from "@rheas/support";
import { IUriComponent } from "@rheas/contracts/routes/uri";
import { ComponentFactory } from "./uri/uriComponentFactory";
import { IRoute, IRequestHandler } from "@rheas/contracts/routes";

export class Route implements IRoute {

    /**
     * All of the verbs supported by the route.
     *
     * @var array
     */
    public static verbs = ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'];

    /**
     * Http methods this route handles.
     * 
     * @var array
     */
    protected _methods: string[] = [];

    /**
    * Route controller action
    * 
    * @var string
    */
    protected _action: string | IRequestHandler = "";

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
     * Flag to set if this route or route group allows secure
     * only connections.
     * 
     * @var boolean
     */
    protected _secureOnly: boolean = false;

    /**
     * Route specific middlewares
     * 
     * @var array
     */
    protected _middlewares: string[] = [];

    /**
     * Middlewares that doesn't have to be run on this route.
     * 
     * @var array
     */
    protected _excludedMiddlewares: string[] = [];

    /**
     * Flag to check whether route middlewares have to be skipped 
     * or not.
     * 
     * @var boolean
     */
    protected _shouldSkipMiddleware: boolean = false;

    /**
     * Returns the uri components of this route path
     * 
     * @var array
     */
    private _uriComponents: IUriComponent[] | null = null;

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
     * Creates a new route for all methods
     * 
     * @param uri 
     * @param controller 
     */
    public static all(uri: string, controller: string | IRequestHandler) {
        return new Route(uri).methods(Route.verbs).action(controller);
    }

    /**
     * Creates a new route for GET and HEAD requests
     * 
     * @param uri 
     * @param controller 
     */
    public static get(uri: string, controller: string | IRequestHandler) {
        return new Route(uri).methods(["GET", "HEAD"]).action(controller);
    }

    /**
     * Creates a new route for PUT requests
     * 
     * @param uri 
     * @param controller 
     */
    public static put(uri: string, controller: string | IRequestHandler) {
        return new Route(uri).methods(["PUT"]).action(controller);
    }

    /**
     * Creates a new route for post requests
     * 
     * @param uri 
     * @param controller 
     */
    public static post(uri: string, controller: string | IRequestHandler) {
        return new Route(uri).methods(["POST"]).action(controller);
    }

    /**
     * Creates a new route for PATCH requests
     * 
     * @param uri 
     * @param controller 
     */
    public static patch(uri: string, controller: string | IRequestHandler) {
        return new Route(uri).methods(["PATCH"]).action(controller);
    }

    /**
     * Creates a new route for DELETE requests
     * 
     * @param uri 
     * @param controller 
     */
    public static delete(uri: string, controller: string | IRequestHandler) {
        return new Route(uri).methods(["DELETE"]).action(controller);
    }

    /**
     * Creates a new route for OPTIONS requests
     * 
     * @param uri 
     * @param controller 
     */
    public static options(uri: string, controller: string | IRequestHandler) {
        return new Route(uri).methods(["OPTIONS"]).action(controller);
    }

    /**
     * Removes the domain scheme, leading and trailing slashes
     * 
     * @param domain 
     */
    public static clearDomain(domain: string): string {
        domain = Str.trimStart(domain.trim(), ["http://", "https://"]);

        return Str.trim(domain, "/");
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
     * Only these middlewares will be resolved when processing
     * requests.
     * 
     * @returns array
     */
    public middlewaresToResolve(): string[] {
        return this.routeMiddlewares();
    }

    /**
     * Returns the domain of this route. If no domain is defined for the route, 
     * parent routes are checked for a domain and if it exists on parent, that 
     * value is returned.
     * 
     * @return string
     */
    public routeDomain(): string {
        let domain = this._domain;

        if (domain.length <= 0 && this.hasParent()) {
            //@ts-ignore
            domain = this.getParent().routeDomain();
        }
        return domain;
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
            fullPath = this.getParent().routePath();
        }
        fullPath += this.getPath();

        return fullPath;
    }

    /**
     * Checks if this route accepts only secure connection requests. In todays
     * standard https is the standard, so we won't be adding httpOnly checks.
     * 
     * @return string
     */
    public routeSecure(): boolean {
        let secureOnly = this._secureOnly;

        if (!secureOnly && this.hasParent()) {
            //@ts-ignore
            secureOnly = this.getParent().routeSecure();
        }
        return secureOnly;
    }

    /**
     * Returns all the child endpoints of this route. Endpoint is a route
     * with a valid method property.
     * 
     * @return array
     */
    public routeEndpoints(): IRoute[] {
        let endpoints: IRoute[] = [];

        this._childRoutes.forEach(route => {
            endpoints.push(...route.routeEndpoints());
        });

        if (this.isEndpoint()) {
            endpoints.unshift(this);
        }
        return endpoints;
    }

    /**
     * Sets the methods of this route
     * 
     * @param methods 
     */
    public methods(methods: string | string[]): IRoute {
        if (!Array.isArray(methods)) {
            methods = Array.from(arguments);
        }

        if (!methods.every(method => Route.verbs.includes(method))) {
            throw new Error(`Method not supported on route ${this._path}. Supported methods are: ` + Route.verbs);
        }

        this._methods = methods;

        return this;
    }

    /**
     * Sets the controller action of this route
     * 
     * @param action
     */
    public action(action: string | IRequestHandler): IRoute {
        this._action = action;

        return this;
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
        this._path = Str.path(path);

        return this;
    }

    /**
     * Sets the domian of this route
     * 
     * @param domain
     */
    public domain(domain: string): IRoute {
        this._domain = Route.clearDomain(domain);

        return this;
    }

    /**
     * Sets the route allows only secure connections flag.
     * 
     * @return this
     */
    public secure(): IRoute {
        this._secureOnly = true;

        return this;
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
     * Sets the excluded middlewares of this route.
     * 
     * @param middlewares 
     */
    public withoutMiddleware(middlewares: string | string[]): IRoute {

        if (!Array.isArray(middlewares)) {
            middlewares = Array.from(arguments);
        }
        this._excludedMiddlewares = middlewares;

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
     * Returns the methods of this route
     * 
     * @return string
     */
    public getMethods(): string[] {
        return this._methods;
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
     * Returns the route request handler.
     * 
     * @return IRequestHandler
     */
    public getAction(): string | IRequestHandler {
        return this._action;
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
     * Returns the uri components of this route.
     * 
     * @return array
     */
    public getUriComponents(): IUriComponent[] {
        if (this._uriComponents === null) {
            this._uriComponents = ComponentFactory.createFromRoute(this);
        }
        return this._uriComponents;
    }

    /**
     * Returns the excluded route middlewares.
     * 
     * @returns array
     */
    public getExcludedMiddlewares(): string[] {
        return this._excludedMiddlewares;
    }

    /**
     * Checks if this is an endpoint
     * 
     * @return boolean
     */
    public isEndpoint(): boolean {
        return this._methods.length > 0;
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