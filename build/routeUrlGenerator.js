"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteUrlGenerator = void 0;
var route_1 = require("./route");
var support_1 = require("@rheas/support");
var helpers_1 = require("@rheas/support/helpers");
var routeParamComponent_1 = require("./uri/routeParamComponent");
var uriComponentFactory_1 = require("./uri/uriComponentFactory");
var invalidArgument_1 = require("@rheas/errors/invalidArgument");
var RouteUrlGenerator = /** @class */ (function () {
    /**
     * Creates a new route url generator for the given route
     *
     * @param route
     */
    function RouteUrlGenerator(route) {
        /**
         * Cached route domain string
         *
         * @var string
         */
        this._domain = "";
        /**
         * Caches the domain component.
         *
         * @var array
         */
        this._domainComponents = null;
        /**
         * Param components of this routes domain.
         *
         * @var object
         */
        this._domainParams = null;
        /**
         * Param components of this routes paths.
         *
         * @var object
         */
        this._pathParams = null;
        this._route = route;
    }
    /**
     * Creates a url for the route.
     *
     * @param params
     */
    RouteUrlGenerator.prototype.generateUrl = function (params, secure) {
        if (params === void 0) { params = {}; }
        var protocol = this.getProtocolString(secure);
        var domain = this.getDomainString(params);
        var path = this.getPathString(params);
        path = path.length > 0 ? '/' + path : '';
        var queryString = this.getQueryString(params);
        return protocol + domain + path + queryString;
    };
    /**
     * Returns the protocol string of the route
     *
     * @param secure
     */
    RouteUrlGenerator.prototype.getProtocolString = function (secure) {
        if (secure == null) {
            return this._route.isHttpRoute() ? 'http://' : 'https://';
        }
        return !secure ? 'http://' : 'https://';
    };
    /**
     * Returns the domain part of this route (without the protocol part).
     *
     * @param params
     */
    RouteUrlGenerator.prototype.getDomainString = function (params) {
        var _this = this;
        if (params === void 0) { params = {}; }
        return this.getDomainComponents().map(function (component) { return _this.getComponentValue(component, params); }).join('.');
    };
    /**
     * Returns the route path after replacing any parameters.
     *
     * @param params
     */
    RouteUrlGenerator.prototype.getPathString = function (params) {
        var _this = this;
        if (params === void 0) { params = {}; }
        return this._route.getUriComponents().map(function (component) { return _this.getComponentValue(component, params); }).join('/');
    };
    /**
     * Returns the uri/domain component value. If the component is a param
     * component, then the submitted param valu is used or throws an error
     * if no param is provided.
     *
     * @param component
     * @param params
     */
    RouteUrlGenerator.prototype.getComponentValue = function (component, params) {
        var value = component.getSegment();
        if (component instanceof routeParamComponent_1.ParamComponent) {
            // If the component is a parameterComponent, we have to
            // use the submitted parameter value. If the required param
            // is not submitted and is not optional, throw an error stopping
            // the route url generation.
            var paramName = component.getName();
            if (!params.hasOwnProperty(paramName)) {
                throw new invalidArgument_1.InvalidArgumentException("Parameter " + paramName + " is not provided.");
            }
            value = params[paramName];
        }
        return value;
    };
    /**
     * Returns a query string excluding the domain param and path param
     * names/keys.
     *
     * @param params
     */
    RouteUrlGenerator.prototype.getQueryString = function (params) {
        if (params === void 0) { params = {}; }
        var domainParams = this.getDomainParamComponents();
        var pathParams = this.getPathParamComponents();
        var excludeKeys = __spreadArrays(Object.keys(domainParams), Object.keys(pathParams));
        return support_1.Str.queryString(params, excludeKeys);
    };
    /**
     * Returns parameter components in the route domain as key-value object
     * where key is the parameter name and value is the param component
     *
     * @returns array
     */
    RouteUrlGenerator.prototype.getDomainParamComponents = function () {
        if (this._domainParams === null) {
            this._domainParams = this.getParamComponents(this.getDomainComponents());
        }
        return this._domainParams;
    };
    /**
     * Returns the domain components of this route.
     *
     * @returns array
     */
    RouteUrlGenerator.prototype.getDomainComponents = function () {
        if (this._domainComponents === null) {
            this._domainComponents = uriComponentFactory_1.ComponentFactory.createFromDomain(this.domain());
        }
        return this._domainComponents;
    };
    /**
     * Gets the route domain if it exists or reads the domain from the config
     * file. The domain will have no trailing slashes and no protocol section.
     *
     * @returns string
     */
    RouteUrlGenerator.prototype.domain = function () {
        if (!this._domain) {
            this._domain = this._route.routeDomain() ||
                // If route domain is empty, read the domain from app 
                // config file.
                route_1.Route.clearDomain(helpers_1.config('app.domain', ''));
        }
        return this._domain;
    };
    /**
     * Returns parameter components in the route path as key-value object
     * where key is the parameter name and value is the param component
     *
     * @returns array
     */
    RouteUrlGenerator.prototype.getPathParamComponents = function () {
        if (this._pathParams === null) {
            this._pathParams = this.getParamComponents(this._route.getUriComponents());
        }
        return this._pathParams;
    };
    /**
     * Returns a key-value collection of param components in
     * the submitted components list
     *
     * @param components
     */
    RouteUrlGenerator.prototype.getParamComponents = function (components) {
        var paramComponents = {};
        components.forEach(function (uriComponent) {
            if (uriComponent instanceof routeParamComponent_1.ParamComponent) {
                paramComponents[uriComponent.getName()] = uriComponent;
            }
        });
        return paramComponents;
    };
    return RouteUrlGenerator;
}());
exports.RouteUrlGenerator = RouteUrlGenerator;
