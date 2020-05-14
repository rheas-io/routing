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
var uriValidator_1 = require("./validators/uriValidator");
var hostValidator_1 = require("./validators/hostValidator");
var notFound_1 = require("@rheas/errors/notFound");
var methodValidator_1 = require("./validators/methodValidator");
var schemeValidator_1 = require("./validators/schemeValidator");
var methoNotAllowed_1 = require("@rheas/errors/methoNotAllowed");
var Router = /** @class */ (function (_super) {
    __extends(Router, _super);
    /**
     * This is the parent route of the application or in general, the core
     * router of Rheas application. All the other routes are registered
     * under this route. This abstract router has to be extended in the
     * application routes folder or wherever the user finds it convenient.
     *
     * The derived route class has to register the apiRouteRegistrar and
     * webRouteRegistrar and set the router config to the derived class.
     *
     * Rheas will read the config and use the router as the application
     * router.
     */
    function Router(app) {
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
         * Cache of route by names.
         *
         * @var object
         */
        _this._namedEndpoints = {};
        /**
         * Cache of routes grouped by methods.
         *
         * @var object
         */
        _this._methodEndpoints = {};
        /**
         * All the route validators.
         *
         * @var array
         */
        _this._routeValidators = [];
        _this.app = app;
        _this.addRegistrar("api", _this.getApiRoutesRegistrar());
        _this.addRegistrar("web", _this.getWebRoutesRegistrar());
        return _this;
    }
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
     * Application requests are send here for processing. A route match is
     * checked for the request. If a match is found, dispatches the same to
     * controller via middlewares.
     *
     * @param request
     * @param response
     */
    Router.prototype.processRequest = function (request, response) {
        try {
            var route = this.matchingRoute(request);
        }
        catch (err) {
            response = this.handleError(err, request, response);
        }
        return response;
    };
    /**
     * Handles the exceptions. Binds the exception to the response and logs the exception
     * if it has to be logged.
     *
     * @param err
     * @param req
     * @param res
     */
    Router.prototype.handleError = function (err, req, res) {
        var exceptionHandler = this.app.get('error');
        if (exceptionHandler) {
            err = exceptionHandler.prepareException(err);
            exceptionHandler.report(err);
            res = exceptionHandler.responseFromError(err, req, res);
        }
        return res;
    };
    /**
     * Checks the request for a matching route.
     *
     * @param request
     * @param response
     */
    Router.prototype.matchingRoute = function (request) {
        var req_method = request.getMethod();
        req_method = (req_method === 'HEAD' ? 'GET' : req_method);
        var route = this.matchAgainstRoutes(this._methodEndpoints[req_method], request);
        if (route !== null) {
            return route;
        }
        var _methods = this.otherMethods(request, req_method);
        if (_methods.length > 0) {
            throw new methoNotAllowed_1.MethodNotAllowedException(_methods, "Url path does not support " + req_method + " method. Supported methods are: " + _methods.join(','));
        }
        throw new notFound_1.NotFoundException();
    };
    /**
     * Checks if a request for any other verb is defined.
     *
     * @param request
     * @param original_method
     */
    Router.prototype.otherMethods = function (request, original_method) {
        var _methods = [];
        var _endpoints = Object.assign({}, this._methodEndpoints);
        delete _endpoints[original_method];
        for (var method in _endpoints) {
            if (this.matchAgainstRoutes(_endpoints[method], request) !== null) {
                _methods.push(method);
            }
        }
        return _methods;
    };
    /**
     *
     * @param routes
     * @param request
     */
    Router.prototype.matchAgainstRoutes = function (routes, request) {
        this._routeValidators = this.routeValidators();
        for (var _i = 0, routes_1 = routes; _i < routes_1.length; _i++) {
            var route = routes_1[_i];
            if (this.routeMatches(route, request, this._routeValidators)) {
                return route;
            }
        }
        return null;
    };
    /**
     * Checks if a route matches for the request. Match is done against the validators
     * submitted.
     *
     * @param route
     * @param request
     * @param validators
     */
    Router.prototype.routeMatches = function (route, request, validators) {
        for (var _i = 0, validators_1 = validators; _i < validators_1.length; _i++) {
            var validator = validators_1[_i];
            if (!validator.matches(route, request)) {
                return false;
            }
        }
        return true;
    };
    /**
     * Returns the validators that each request has to run to find a
     * route match.
     *
     * @return array of route validators.
     */
    Router.prototype.routeValidators = function () {
        if (this._routeValidators.length === 0) {
            this._routeValidators = [
                this.getMethodValidator(), this.getUriValidator(),
                this.getHostValidator(), this.getSchemeValidator(),
            ];
        }
        return this._routeValidators;
    };
    /**
     * New host validator. Domain/subdomain checks.
     *
     * @return
     */
    Router.prototype.getHostValidator = function () {
        return new hostValidator_1.HostValidator();
    };
    /**
     * New scheme validator. http or https check
     *
     * @return
     */
    Router.prototype.getSchemeValidator = function () {
        return new schemeValidator_1.SchemeValidator();
    };
    /**
     * New route method validator.
     *
     * @return
     */
    Router.prototype.getMethodValidator = function () {
        return new methodValidator_1.MethodValidator();
    };
    /**
     * New uri validator. Checks if the request url and route path matches.
     *
     * @return
     */
    Router.prototype.getUriValidator = function () {
        return new uriValidator_1.UriValidator();
    };
    /**
     * Caches the routes by name and request methods. All these cache contains
     * only the final endpoint routes. Each endpoint route will traverse in
     * reverse to match the request uri and to obtain the middlewares.
     *
     * Router will cache the endpoint routes by name and methods for faster
     * route  matching.
     */
    Router.prototype.cacheRoutes = function () {
        var _this = this;
        this.routes.apply(this, this.routesList());
        this.routeEndpoints().forEach(function (route) {
            _this.cacheNamedRoute(route);
            _this.cacheMethodRoute(route);
        });
    };
    /**
     * Caches the route by name if it has a non-empty name.
     *
     * @param route
     */
    Router.prototype.cacheNamedRoute = function (route) {
        var name = route.getName().trim();
        if (name.length > 0) {
            this._namedEndpoints[name] = route;
        }
    };
    /**
     * Sorts the route method and cache them into the appropriate array. This allows
     * quick retreival of request route by querying through the method array.
     *
     * @param route
     */
    Router.prototype.cacheMethodRoute = function (route) {
        var _this = this;
        route.getMethods().filter(function (method) { return method !== 'HEAD'; }).forEach(function (method) {
            _this._methodEndpoints[method] = _this._methodEndpoints[method] || [];
            _this._methodEndpoints[method].push(route);
        });
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
