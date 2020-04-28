"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var support_1 = require("@laress/support");
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
         * Flag to check whether route middlewares have to be skipped
         * or not.
         *
         * @var boolean
         */
        this._shouldSkipMiddleware = false;
        /**
         * Route specific middlewares
         *
         * @var array
         */
        this._middlewares = [];
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
        fullPath += +this.getPath();
        return support_1.Str.trim(fullPath, "/");
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
     * Clears the path, replacing multiple slashes with single slash and
     * removing any trailing or leading slashes.
     *
     * @param path
     */
    Route.prototype.clearPath = function (path) {
        return support_1.Str.trim(support_1.Str.replaceWithOne(path.trim(), '/'), '/');
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
     * Sets the parent route of this route
     *
     * @param route
     */
    Route.prototype.setParent = function (route) {
        this._parentRoute = route;
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
     * Returns the parent route.
     *
     * @return Route|null
     */
    Route.prototype.getParent = function () {
        return this._parentRoute;
    };
    /**
     * Checks if the route has any parent route.
     *
     * @return boolean
     */
    Route.prototype.hasParent = function () {
        return this.getParent() instanceof Route;
    };
    return Route;
}());
exports.Route = Route;
