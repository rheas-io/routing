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
exports.Router = void 0;
var path_1 = __importDefault(require("path"));
var route_1 = require("./route");
var support_1 = require("@rheas/support");
var exception_1 = require("@rheas/errors/exception");
var requestPipeline_1 = require("./requestPipeline");
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
        return _this;
    }
    /**
     * Application requests are send here for processing. The request is initially
     * sent to a pipeline of global middlewares (middlewares of this class). Once that's
     * done, they are forwarded to routeHandler, which checks for a matching route. If found
     * one, then the request is send through a pipeline of route middlewares.
     *
     * @param request
     * @param response
     */
    Router.prototype.handle = function (request, response) {
        return __awaiter(this, void 0, void 0, function () {
            var err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.dispatchToRoute(this, request, response)];
                    case 1:
                        // Sends request through the middlewares of this class, which are
                        // global middlewares. Final destination will be the routeHandler
                        // function of this object which will continue the request flow through
                        // the route middleware pipeline, if required.
                        response = _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _a.sent();
                        // Catch any exception occured when processing the request and
                        // create a response from the exception. This error response should
                        // be returned.
                        console.log(err_1);
                        response = this.handleError(err_1, request, response);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/, response];
                }
            });
        });
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
     * Dispatches the request to the route through middleware pipeline.
     *
     * @param route
     * @param req
     * @param res
     */
    Router.prototype.dispatchToRoute = function (route, req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var destination;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        destination = this === route ? this.routeHandler.bind(this) : this.resolveDestination(route, req);
                        return [4 /*yield*/, new requestPipeline_1.RequestPipeline()
                                .through(this.middlewarePipesOfRoute(route))
                                .sendTo(destination, req, res)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Requests are send here after flowing through a series of global middlewares, if no response
     * has been found.
     *
     * This handler finds a matching route for the request and continue the request flow through
     * the route middleware pipeline.
     *
     * @param request
     * @param response
     */
    Router.prototype.routeHandler = function (request, response) {
        return __awaiter(this, void 0, void 0, function () {
            var route;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        route = this.matchingRoute(request);
                        return [4 /*yield*/, this.dispatchToRoute(route, request, response)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Resolves middleware handlers for the route. Returns an array
     * of middleware handlers which executes the corresponding middleware
     * with the params.
     *
     * @param route
     */
    Router.prototype.middlewarePipesOfRoute = function (route) {
        var _this = this;
        return route.middlewaresToResolve().reduce(function (prev, current) {
            var nameParam = _this.routeRequiresMiddleware(route, current);
            if (nameParam !== false) {
                prev.push(_this.resolveMiddleware(nameParam));
            }
            return prev;
        }, []);
    };
    /**
     * Returns middleware handler function.
     *
     * @param nameParam
     */
    Router.prototype.resolveMiddleware = function (_a) {
        var _this = this;
        var name = _a[0], params = _a[1];
        return function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var typeMiddleware;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        typeMiddleware = typeof this.middlewares_list[name];
                        if (typeMiddleware !== 'function') {
                            throw new exception_1.Exception("Middleware " + name + " has to be a function. Found: " + typeMiddleware);
                        }
                        return [4 /*yield*/, (_a = this.middlewares_list)[name].apply(_a, __spreadArrays([req, res, next], params))];
                    case 1: return [2 /*return*/, _b.sent()];
                }
            });
        }); };
    };
    /**
     * Checks if the given middleware (by name) has to be executed or not. Returns
     * [name, params[]] if the middleware is not present in the exclusion list of route.
     *
     * @param route
     * @param middleware
     */
    Router.prototype.routeRequiresMiddleware = function (route, middleware) {
        var _a = this.middlewareNameParams(middleware), name = _a[0], params = _a[1];
        // The route middleware exclusion list.
        var excluded = route.getExcludedMiddlewares();
        if (!excluded.includes(name) && !excluded.includes(middleware)) {
            return [name, params];
        }
        return false;
    };
    /**
     * Returns middleware string as name and params array.
     *
     * @param middleware
     */
    Router.prototype.middlewareNameParams = function (middleware) {
        var _a = middleware.trim().split(':'), name = _a[0], others = _a.slice(1);
        var params = others.join(':');
        return [name, params.length > 0 ? params.split(',') : []];
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
        return function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var controllerAction, params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        controllerAction = route.getAction();
                        if (typeof controllerAction !== 'function') {
                            controllerAction = this.resolveController(controllerAction);
                        }
                        params = request.params();
                        return [4 /*yield*/, controllerAction.apply(void 0, __spreadArrays([req, res], params))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); };
    };
    /**
     * Resolves controller function from route action string.
     *
     * @param controller
     */
    Router.prototype.resolveController = function (controller) {
        var _a = controller.trim().split('@'), className = _a[0], method = _a[1];
        return require(this.controllerScript(className))[method];
    };
    /**
     * Returns path to the script. The path is respective to the root
     * path.
     *
     * @param filename
     */
    Router.prototype.controllerScript = function (filename) {
        var rootPath = this.app.get('path.root') || '';
        var controllerDir = support_1.Str.path(this.controllerPath);
        var controllerFile = support_1.Str.path(filename);
        return path_1.default.resolve(rootPath, controllerDir, controllerFile);
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
            //TODO options method.
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
     * Router middlewares shouldn't be send to the routes.
     *
     * Middlewares of this router are global middlewares, that has to
     * be executed no matter what and before finding the matching route.
     *
     * To eliminate having this added to the endpoint middleware list,
     * we simpley overrides it with an empty array.
     *
     * @override
     *
     * @return array
     */
    Router.prototype.routeMiddlewares = function () {
        return [];
    };
    /**
     * Only these middlewares will be resolved when processing requests.
     *
     * @returns array
     */
    Router.prototype.middlewaresToResolve = function () {
        return this._middlewares;
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
     * Returns route if a route with the name exists or null.
     *
     * @param name
     */
    Router.prototype.getNamedRoute = function (name) {
        return this._namedEndpoints[name] || null;
    };
    return Router;
}(route_1.Route));
exports.Router = Router;
