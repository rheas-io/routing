"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Route = void 0;
const support_1 = require("@rheas/support");
const uriComponentFactory_1 = require("./uri/uriComponentFactory");
class Route {
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
    constructor(path = "") {
        /**
         * Http methods this route handles.
         *
         * @var array
         */
        this._methods = [];
        /**
        * Route controller action
        *
        * @var string
        */
        this._action = "";
        /**
         * Name of this route
         *
         * @var string
         */
        this._name = "";
        /**
         * Uri path of this group of routes
         *
         * @var string
         */
        this._path = "";
        /**
         * Sub domain/domain of this route
         *
         * @var string
         */
        this._domain = "";
        /**
         * Flag to set if this route or route group is for http
         * connections.
         *
         * @var boolean
         */
        this._httpRoute = false;
        /**
         * Route specific middlewares
         *
         * @var array
         */
        this._middlewares = [];
        /**
         * Middlewares that doesn't have to be run on this route.
         *
         * @var array
         */
        this._excludedMiddlewares = [];
        /**
         * Returns the uri components of this route path
         *
         * @var array
         */
        this._uriComponents = null;
        /**
         * Reference to parent route, if any
         *
         * @var Route
         */
        this._parentRoute = null;
        /**
         * A collection of child routes
         *
         * @var array
         */
        this._routes = [];
        this.prefix(path);
    }
    /**
     * Creates a new route group.
     *
     * @param prefix
     */
    static group(prefix = "") {
        return new Route(prefix);
    }
    /**
     * Creates a new route for all methods
     *
     * @param uri
     * @param controller
     */
    static all(uri, controller) {
        return new Route(uri).methods([...Route.verbs]).action(controller);
    }
    /**
     * Creates a new route for GET and HEAD requests
     *
     * @param uri
     * @param controller
     */
    static get(uri, controller) {
        return new Route(uri).methods(["GET"]).action(controller);
    }
    /**
     * Creates a new route for PUT requests
     *
     * @param uri
     * @param controller
     */
    static put(uri, controller) {
        return new Route(uri).methods(["PUT"]).action(controller);
    }
    /**
     * Creates a new route for post requests
     *
     * @param uri
     * @param controller
     */
    static post(uri, controller) {
        return new Route(uri).methods(["POST"]).action(controller);
    }
    /**
     * Creates a new route for PATCH requests
     *
     * @param uri
     * @param controller
     */
    static patch(uri, controller) {
        return new Route(uri).methods(["PATCH"]).action(controller);
    }
    /**
     * Creates a new route for DELETE requests
     *
     * @param uri
     * @param controller
     */
    static delete(uri, controller) {
        return new Route(uri).methods(["DELETE"]).action(controller);
    }
    /**
     * Creates a new route for OPTIONS requests
     *
     * @param uri
     * @param controller
     */
    static options(uri, controller) {
        return new Route(uri).methods(["OPTIONS"]).action(controller);
    }
    /**
     * Removes the domain scheme, leading and trailing slashes
     *
     * @param domain
     */
    static clearDomain(domain) {
        domain = support_1.Str.trimStart(domain.trim(), ["http://", "https://"]);
        return support_1.Str.trim(domain, "/");
    }
    /**
     * Adds the child routes of this route. Also sets the child
     * routes parent to this route.
     *
     * @param routes
     */
    routes(...routes) {
        routes.forEach(route => {
            route.setParent(this);
        });
        this._routes = routes;
        return this;
    }
    /**
     * Middlewares to be used along with this route.
     *
     * @return array
     */
    routeMiddlewares() {
        let fullMiddlewares = [];
        if (this.hasParent()) {
            //@ts-ignore
            fullMiddlewares = [...this.getParent().routeMiddlewares()];
        }
        fullMiddlewares = [...fullMiddlewares, ...this._middlewares];
        //Removes any excluded middlewares from the list
        if (this._excludedMiddlewares.length > 0) {
            fullMiddlewares = fullMiddlewares.filter(middleware => {
                return !this._excludedMiddlewares.includes(middleware);
            });
        }
        return fullMiddlewares;
    }
    /**
     * Only these middlewares will be resolved when processing
     * requests.
     *
     * @returns array
     */
    middlewaresToResolve() {
        return this.routeMiddlewares();
    }
    /**
     * Returns the domain of this route. If no domain is defined for the route,
     * parent routes are checked for a domain and if it exists on parent, that
     * value is returned.
     *
     * @return string
     */
    routeDomain() {
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
    routePath() {
        let fullPath = [];
        if (this.hasParent()) {
            //@ts-ignore
            const parentPath = this.getParent().routePath();
            if (parentPath.length > 0) {
                fullPath.push(parentPath);
            }
        }
        if (this._path.length > 0) {
            fullPath.push(this._path);
        }
        return fullPath.join('/');
    }
    /**
     * Returns all the child endpoints of this route. Endpoint is a route
     * with a valid method property.
     *
     * @return array
     */
    routeEndpoints() {
        let endpoints = [];
        this._routes.forEach(route => {
            endpoints.push(...route.routeEndpoints());
        });
        if (this.isEndpoint()) {
            endpoints.unshift(this);
        }
        return endpoints;
    }
    /**
     * Checks if this route accepts http connection requests. Https requests are
     * the default and this function returns true only if the httpRoute flag is set
     * for this route or any parent routes.
     *
     * @return string
     */
    isHttpRoute() {
        let httpRoute = this._httpRoute;
        if (!httpRoute && this.hasParent()) {
            //@ts-ignore
            httpRoute = this.getParent().isHttpRoute();
        }
        return httpRoute;
    }
    /**
     * Sets the methods of this route
     *
     * @param methods
     */
    methods(methods) {
        if (!Array.isArray(methods)) {
            methods = Array.from(arguments);
        }
        if (!methods.every(method => Route.verbs.includes(method))) {
            throw new Error(`Method not supported on route ${this._path}. Supported methods are: ` + Route.verbs);
        }
        // Add HEAD if methods contains GET and does not contain a HEAD
        if (methods.includes("GET") && !methods.includes("HEAD")) {
            methods.push("HEAD");
        }
        this._methods = methods;
        return this;
    }
    /**
     * Sets the controller action of this route
     *
     * @param action
     */
    action(action) {
        this._action = action;
        return this;
    }
    /**
     * Sets the name of this route
     *
     * @param name
     */
    name(name) {
        this._name = name;
        return this;
    }
    /**
     * Sets the route group prefix
     *
     * @param path
     */
    prefix(path) {
        this._path = support_1.Str.path(path);
        return this;
    }
    /**
     * Sets the domian of this route
     *
     * @param domain
     */
    domain(domain) {
        this._domain = Route.clearDomain(domain);
        return this;
    }
    /**
     * Sets the route to allow http requests.
     *
     * @return this
     */
    http(httpRoute = true) {
        this._httpRoute = httpRoute;
        return this;
    }
    /**
     * Sets the middlewares to be used by this route or route group.
     *
     * @param middlewares
     */
    middleware(...middlewares) {
        this._middlewares = middlewares;
        return this;
    }
    /**
     * Sets the excluded middlewares of this route.
     *
     * @param middlewares
     */
    withoutMiddleware(...middlewares) {
        this._excludedMiddlewares = middlewares;
        return this;
    }
    /**
     * Sets the parent route of this route
     *
     * @param route
     */
    setParent(route) {
        this._parentRoute = route;
    }
    /**
     * Returns the methods of this route
     *
     * @return string
     */
    getMethods() {
        return this._methods;
    }
    /**
     * Returns the name of this route
     *
     * @return string
     */
    getName() {
        return this._name;
    }
    /**
     * Returns the route path
     *
     * @return string
     */
    getPath() {
        return this._path;
    }
    /**
     * Returns the route request handler.
     *
     * @return IRequestHandler
     */
    getAction() {
        return this._action;
    }
    /**
     * Returns the parent route.
     *
     * @return Route|null
     */
    getParent() {
        return this._parentRoute;
    }
    /**
     * Returns the child routes.
     *
     * @return Route|null
     */
    getChildRoutes() {
        return this._routes;
    }
    /**
     * Returns the uri components of this route.
     *
     * @return array
     */
    getUriComponents() {
        if (this._uriComponents === null) {
            this._uriComponents = uriComponentFactory_1.ComponentFactory.createFromRoute(this);
        }
        return this._uriComponents;
    }
    /**
     * Returns the excluded route middlewares.
     *
     * @returns array
     */
    getExcludedMiddlewares() {
        return this._excludedMiddlewares;
    }
    /**
     * Checks if this is an endpoint
     *
     * @return boolean
     */
    isEndpoint() {
        return this._methods.length > 0;
    }
    /**
     * Checks if the route has any parent route.
     *
     * @return boolean
     */
    hasParent() {
        return this.getParent() instanceof Route;
    }
}
exports.Route = Route;
/**
 * All of the verbs supported by the route.
 *
 * @var array
 */
Route.verbs = ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'];
