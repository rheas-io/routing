"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var route_1 = require("./route");
var routeRegistrar_1 = require("./routeRegistrar");
var Router = /** @class */ (function (_super) {
    __extends(Router, _super);
    /**
     * This is the parent route of the application or in general, the core
     * router of laress application. All the other routes are registered
     * under this route. This abstract router has to be extended in the
     * application routes folder or wherever the user finds it convenient.
     *
     * The derived route class has to register the apiRouteRegistrar and
     * webRouteRegistrar and set the router config to the derived class.
     *
     * Laress will read the config and use the router as the application
     * router.
     */
    function Router() {
        var _this = _super.call(this) || this;
        /**
         * List of all the middlewares used in the application
         *
         * @var array
         */
        _this.middlewares_list = {};
        /**
         * Route registrars of this route.
         *
         * @var array
         */
        _this.registrars = {};
        /**
         * Caches all the endpoint routes
         *
         * @var array
         */
        _this._allEndpoints = [];
        _this.addRegistrar("api", _this.getApiRoutesRegistrar());
        _this.addRegistrar("web", _this.getWebRoutesRegistrar());
        return _this;
    }
    Router.prototype.processRequest = function (request, response) {
        throw new Error("Method not implemented.");
    };
    Router.prototype.matchingRoute = function (request, response) {
        throw new Error("Method not implemented.");
    };
    Router.prototype.dispatchToRoute = function (route, request, response) {
        throw new Error("Method not implemented.");
    };
    /**
     * Retreives the api route registrar
     *
     * @return IRouteRegistrar
     */
    Router.prototype.getApiRoutesRegistrar = function () {
        return new routeRegistrar_1.RouteRegistrar('api');
    };
    /**
     * Registers all the web routes
     *
     * @return IRouteRegistrar
     */
    Router.prototype.getWebRoutesRegistrar = function () {
        return new routeRegistrar_1.RouteRegistrar();
    };
    /**
     * An exposed function that allows users to register their
     * routes
     *
     * @return array
     */
    Router.prototype.routesList = function () {
        var routes = [];
        for (var name_1 in this.registrars) {
            var registrar = this.registrars[name_1];
            routes.push(registrar.routes.apply(registrar, registrar.routesList()));
        }
        return routes;
    };
    /**
     * Caches the routes by name and request methods. All these cache contains
     * only the final endpoint routes. Each endpoint route will traverse in
     * reverse to match the request uri and to obtain the middlewares.
     *
     * Router will also cache the endpoint routes by name and methods for faster
     * route  matching.
     */
    Router.prototype.cacheRoutes = function () {
        this.cacheAllRoutes();
        this.cacheByNames();
        this.cacheByMethods();
    };
    /**
     * Caches all the routes by storing the whole uri to a
     * route. This allows easy route match operations by the router.
     */
    Router.prototype.cacheAllRoutes = function () {
        this._allEndpoints = this.routeEndpoints();
    };
    /**
     * Caches all the routes by names. This enables easy URl generation.
     */
    Router.prototype.cacheByNames = function () {
    };
    /**
     * Caches all the routes by methods. This allows further sorting down
     * the routes enabling quick retreival of request route by querying through
     * the method.
     */
    Router.prototype.cacheByMethods = function () {
    };
    /**
     * Adds a custom route registrar to the router. This allows adding more
     * route registration on the router other than the default api and web
     * routes.
     *
     * @param name string
     * @param registrar new route registrar
     */
    Router.prototype.addRegistrar = function (name, registrar) {
        if (!name) {
            throw Error("Please provide a valid route name");
        }
        if (this.registrars[name] instanceof route_1.Route) {
            throw Error("A route registrar of that name already exists.");
        }
        this.registrars[name] = registrar;
    };
    /**
     * Deletes a registrar from the router
     *
     * @param name name of the registrar to delete
     */
    Router.prototype.deleteRegistrar = function (name) {
        if (["api", "web"].includes(name)) {
            throw Error("Unable to delete default route registrars [api, web].");
        }
        delete this.registrars[name];
    };
    return Router;
}(route_1.Route));
exports.Router = Router;
