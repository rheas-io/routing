"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var support_1 = require("@rheas/support");
var uriComponentFactory_1 = require("./uri/uriComponentFactory");
var Route = /** @class */ (function () {
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
    function Route(path) {
        if (path === void 0) { path = ""; }
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
         * Flag to set if this route or route group allows secure
         * only connections.
         *
         * @var boolean
         */
        this._secureOnly = false;
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
         * Flag to check whether route middlewares have to be skipped
         * or not.
         *
         * @var boolean
         */
        this._shouldSkipMiddleware = false;
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
        this._childRoutes = [];
        this.prefix(path);
    }
    /**
     * Creates a new route group.
     *
     * @param prefix
     */
    Route.group = function (prefix) {
        if (prefix === void 0) { prefix = ""; }
        return new Route(prefix);
    };
    /**
     * Creates a new route for all methods
     *
     * @param uri
     * @param controller
     */
    Route.all = function (uri, controller) {
        return new Route(uri).methods(Route.verbs).action(controller);
    };
    /**
     * Creates a new route for GET and HEAD requests
     *
     * @param uri
     * @param controller
     */
    Route.get = function (uri, controller) {
        return new Route(uri).methods(["GET", "HEAD"]).action(controller);
    };
    /**
     * Creates a new route for PUT requests
     *
     * @param uri
     * @param controller
     */
    Route.put = function (uri, controller) {
        return new Route(uri).methods(["PUT"]).action(controller);
    };
    /**
     * Creates a new route for post requests
     *
     * @param uri
     * @param controller
     */
    Route.post = function (uri, controller) {
        return new Route(uri).methods(["POST"]).action(controller);
    };
    /**
     * Creates a new route for PATCH requests
     *
     * @param uri
     * @param controller
     */
    Route.patch = function (uri, controller) {
        return new Route(uri).methods(["PATCH"]).action(controller);
    };
    /**
     * Creates a new route for DELETE requests
     *
     * @param uri
     * @param controller
     */
    Route.delete = function (uri, controller) {
        return new Route(uri).methods(["DELETE"]).action(controller);
    };
    /**
     * Creates a new route for OPTIONS requests
     *
     * @param uri
     * @param controller
     */
    Route.options = function (uri, controller) {
        return new Route(uri).methods(["OPTIONS"]).action(controller);
    };
    /**
     * Adds the child routes of this route. Also sets the child
     * routes parent to this route.
     *
     * @param routes
     */
    Route.prototype.routes = function () {
        var _this = this;
        var routes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            routes[_i] = arguments[_i];
        }
        routes.forEach(function (route) {
            route.setParent(_this);
        });
        this._childRoutes = routes;
        return this;
    };
    /**
     * Middlewares to be used along with this route.
     *
     * @return array
     */
    Route.prototype.routeMiddlewares = function () {
        var fullMiddlewares = [];
        if (this.hasParent()) {
            //@ts-ignore
            fullMiddlewares = __spreadArrays(this.getParent().routeMiddlewares());
        }
        if (!this._shouldSkipMiddleware) {
            fullMiddlewares = __spreadArrays(fullMiddlewares, this._middlewares);
        }
        return fullMiddlewares;
    };
    /**
     * Returns the domain of this route. If no domain is defined for the route,
     * parent routes are checked for a domain and if it exists on parent, that
     * value is returned.
     *
     * @return string
     */
    Route.prototype.routeDomain = function () {
        var domain = this._domain;
        if (domain.length <= 0 && this.hasParent()) {
            //@ts-ignore
            domain = this.getParent().routeDomain();
        }
        return domain;
    };
    /**
     * Returns the complete route path including prefixes and
     * parent paths.
     *
     * @return string
     */
    Route.prototype.routePath = function () {
        var fullPath = "";
        if (this.hasParent()) {
            //@ts-ignore
            fullPath = this.getParent().routePath() + "/";
        }
        fullPath += this.getPath();
        return support_1.Str.trim(fullPath, "/");
    };
    /**
     * Checks if this route accepts only secure connection requests. In todays
     * standard https is the standard, so we won't be adding httpOnly checks.
     *
     * @return string
     */
    Route.prototype.routeSecure = function () {
        var secureOnly = this._secureOnly;
        if (!secureOnly && this.hasParent()) {
            //@ts-ignore
            secureOnly = this.getParent().routeSecure();
        }
        return secureOnly;
    };
    /**
     * Returns all the child endpoints of this route. Endpoint is a route
     * with a valid method property.
     *
     * @return array
     */
    Route.prototype.routeEndpoints = function () {
        var endpoints = [];
        this._childRoutes.forEach(function (route) {
            endpoints.push.apply(endpoints, route.routeEndpoints());
        });
        if (this.isEndpoint()) {
            endpoints.unshift(this);
        }
        return endpoints;
    };
    /**
     * Sets the methods of this route
     *
     * @param methods
     */
    Route.prototype.methods = function (methods) {
        if (!Array.isArray(methods)) {
            methods = Array.from(arguments);
        }
        if (!methods.every(function (method) { return Route.verbs.includes(method); })) {
            throw new Error("Method not supported on route " + this._path + ". Supported methods are: " + Route.verbs);
        }
        this._methods = methods;
        return this;
    };
    /**
     * Sets the controller action of this route
     *
     * @param action
     */
    Route.prototype.action = function (action) {
        this._action = action;
        return this;
    };
    /**
     * Sets the name of this route
     *
     * @param name
     */
    Route.prototype.name = function (name) {
        this._name = name;
        return this;
    };
    /**
     * Sets the route group prefix
     *
     * @param path
     */
    Route.prototype.prefix = function (path) {
        this._path = this.clearPath(path);
        return this;
    };
    /**
     * Sets the domian of this route
     *
     * @param domain
     */
    Route.prototype.domain = function (domain) {
        this._domain = this.clearDomain(domain);
        return this;
    };
    /**
     * Sets the route allows only secure connections flag.
     *
     * @return this
     */
    Route.prototype.secure = function () {
        this._secureOnly = true;
        return this;
    };
    /**
     * Sets the middlewares to be used by this route or route group.
     *
     * @param middlewares
     */
    Route.prototype.middleware = function (middlewares) {
        if (!Array.isArray(middlewares)) {
            middlewares = Array.from(arguments);
        }
        this._middlewares = middlewares;
        return this;
    };
    /**
     * Sets the excluded middlewares of this route.
     *
     * @param middlewares
     */
    Route.prototype.withoutMiddleware = function (middlewares) {
        if (!Array.isArray(middlewares)) {
            middlewares = Array.from(arguments);
        }
        this._excludedMiddlewares = middlewares;
        return this;
    };
    /**
     * Removes the domain scheme, leading and trailing slashes
     *
     * @param domain
     */
    Route.prototype.clearDomain = function (domain) {
        domain = domain.trim();
        domain = domain.replace("http://", "");
        domain = domain.replace("https://", "");
        return support_1.Str.trim(domain, "/");
    };
    /**
     * Clears the path, replacing multiple slashes with single slash and
     * removing any trailing or leading slashes.
     *
     * @param path
     */
    Route.prototype.clearPath = function (path) {
        return support_1.Str.trim(support_1.Str.replaceWithOne(path.trim(), '/'), '/');
    };
    /**
     * Sets the parent route of this route
     *
     * @param route
     */
    Route.prototype.setParent = function (route) {
        this._parentRoute = route;
    };
    /**
     * Returns the methods of this route
     *
     * @return string
     */
    Route.prototype.getMethods = function () {
        return this._methods;
    };
    /**
     * Returns the name of this route
     *
     * @return string
     */
    Route.prototype.getName = function () {
        return this._name;
    };
    /**
     * Returns the route path
     *
     * @return string
     */
    Route.prototype.getPath = function () {
        return this._path;
    };
    /**
     * Returns the route request handler.
     *
     * @return IRequestHandler
     */
    Route.prototype.getAction = function () {
        return this._action;
    };
    /**
     * Returns the parent route.
     *
     * @return Route|null
     */
    Route.prototype.getParent = function () {
        return this._parentRoute;
    };
    /**
     * Returns the uri components of this route.
     *
     * @return array
     */
    Route.prototype.getUriComponents = function () {
        if (this._uriComponents === null) {
            this._uriComponents = uriComponentFactory_1.ComponentFactory.createFromRoute(this);
        }
        return this._uriComponents;
    };
    /**
     * Returns the excluded route middlewares.
     *
     * @returns array
     */
    Route.prototype.getExcludedMiddlewares = function () {
        return this._excludedMiddlewares;
    };
    /**
     * Checks if this is an endpoint
     *
     * @return boolean
     */
    Route.prototype.isEndpoint = function () {
        return this._methods.length > 0;
    };
    /**
     * Checks if the route has any parent route.
     *
     * @return boolean
     */
    Route.prototype.hasParent = function () {
        return this.getParent() instanceof Route;
    };
    /**
     * All of the verbs supported by the route.
     *
     * @var array
     */
    Route.verbs = ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'];
    return Route;
}());
exports.Route = Route;
