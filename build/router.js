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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var route_1 = require("./route");
var support_1 = require("@rheas/support");
var pipeline_1 = require("./pipeline");
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
         * The folder where controller files are located. The location
         * is respective to the root path.
         *
         * @var string
         */
        _this.controllerPath = "app/controllers";
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
        return __awaiter(this, void 0, void 0, function () {
            var route, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        route = this.matchingRoute(request);
                        return [4 /*yield*/, this.dispatchToRoute(route, request, response)];
                    case 1:
                        response = _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _a.sent();
                        response = this.handleError(err_1, request, response);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/, response];
                }
            });
        });
    };
    /**
     * Dispatches thee request to the route through middleware pipeline.
     *
     * @param route
     * @param req
     * @param res
     */
    Router.prototype.dispatchToRoute = function (route, req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var middleware_names, excluded_middlewares, destination;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        middleware_names = route.routeMiddlewares();
                        excluded_middlewares = route.getExcludedMiddlewares();
                        // Remove excluded middlewares from the route middleware list.
                        // A middleware is removed only if it is a route middleware. The router
                        // middleware/global middlewares can't be excluded.
                        middleware_names = middleware_names.filter(function (name) { return _this._middlewares.includes(name) || !excluded_middlewares.includes(name); });
                        destination = this.resolveDestination(route, req);
                        return [4 /*yield*/, new pipeline_1.Pipeline()
                                .through(middleware_names.map(function (name) { return _this.middlewares_list[name]; }))
                                .sendTo(destination, req, res)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Returns the final request handler of the route which is a request handler
     * executing the route action/controller method.
     *
     * @param route
     * @param req
     */
    Router.prototype.resolveDestination = function (route, request) {
        var _this = this;
        var controllerAction = route.getAction();
        if (typeof controllerAction !== 'function') {
            controllerAction = this.resolveController(controllerAction);
        }
        var params = request.params();
        return function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, controllerAction.apply(void 0, __spreadArrays([req, res], params))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); };
    };
    /**
     * Resolves controller from route action string.
     *
     * @param controller
     */
    Router.prototype.resolveController = function (controller) {
        var _a = controller.trim().split('@'), className = _a[0], method = _a[1];
        var controllerClass = require(this.controllerScript(className)).default;
        return (new controllerClass)[method];
    };
    /**
     * Returns path to the script. The path is respective to the root
     * path.
     *
     * @param filename
     */
    Router.prototype.controllerScript = function (filename) {
        var rootPath = this.app.get('rootPath') || '';
        var controllerFolders = support_1.Str.path(this.controllerPath).split('/');
        var fileFolders = support_1.Str.path(filename).split('/');
        return path_1.default.resolve.apply(path_1.default, __spreadArrays([rootPath], controllerFolders, fileFolders));
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
     * Checks if a request matches against a set of routes. First match is
     * returned if one exists and null otherwise.
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
