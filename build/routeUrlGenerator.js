"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteUrlGenerator = void 0;
const route_1 = require("./route");
const support_1 = require("@rheas/support");
const helpers_1 = require("@rheas/support/helpers");
const routeParamComponent_1 = require("./uri/routeParamComponent");
const uriComponentFactory_1 = require("./uri/uriComponentFactory");
const invalidArgument_1 = require("@rheas/errors/invalidArgument");
class RouteUrlGenerator {
    /**
     * Creates a new route url generator for the given route
     *
     * @param route
     */
    constructor(route) {
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
    generateUrl(params = {}, secure) {
        const protocol = this.getProtocolString(secure);
        const domain = this.getDomainString(params);
        let path = this.getPathString(params);
        path = path.length > 0 ? '/' + path : '';
        const queryString = this.getQueryString(params);
        return protocol + domain + path + queryString;
    }
    /**
     * Returns the protocol string of the route
     *
     * @param secure
     */
    getProtocolString(secure) {
        if (secure == null) {
            return this._route.isHttpRoute() ? 'http://' : 'https://';
        }
        return !secure ? 'http://' : 'https://';
    }
    /**
     * Returns the domain part of this route (without the protocol part).
     *
     * @param params
     */
    getDomainString(params = {}) {
        return this.getDomainComponents().map((component) => this.getComponentValue(component, params)).join('.');
    }
    /**
     * Returns the route path after replacing any parameters.
     *
     * @param params
     */
    getPathString(params = {}) {
        return this._route.getUriComponents().map((component) => this.getComponentValue(component, params)).join('/');
    }
    /**
     * Returns the uri/domain component value. If the component is a param
     * component, then the submitted param valu is used or throws an error
     * if no param is provided.
     *
     * @param component
     * @param params
     */
    getComponentValue(component, params) {
        let value = component.getSegment();
        if (component instanceof routeParamComponent_1.ParamComponent) {
            // If the component is a parameterComponent, we have to
            // use the submitted parameter value. If the required param
            // is not submitted and is not optional, throw an error stopping
            // the route url generation.
            const paramName = component.getName();
            if (!params.hasOwnProperty(paramName)) {
                throw new invalidArgument_1.InvalidArgumentException(`Parameter ${paramName} is not provided.`);
            }
            value = params[paramName];
        }
        return value;
    }
    /**
     * Returns a query string excluding the domain param and path param
     * names/keys.
     *
     * @param params
     */
    getQueryString(params = {}) {
        const domainParams = this.getDomainParamComponents();
        const pathParams = this.getPathParamComponents();
        const excludeKeys = [...Object.keys(domainParams), ...Object.keys(pathParams)];
        return support_1.Str.queryString(params, excludeKeys);
    }
    /**
     * Returns parameter components in the route domain as key-value object
     * where key is the parameter name and value is the param component
     *
     * @returns array
     */
    getDomainParamComponents() {
        if (this._domainParams === null) {
            this._domainParams = this.getParamComponents(this.getDomainComponents());
        }
        return this._domainParams;
    }
    /**
     * Returns the domain components of this route.
     *
     * @returns array
     */
    getDomainComponents() {
        if (this._domainComponents === null) {
            this._domainComponents = uriComponentFactory_1.ComponentFactory.createFromDomain(this.domain());
        }
        return this._domainComponents;
    }
    /**
     * Gets the route domain if it exists or reads the domain from the config
     * file. The domain will have no trailing slashes and no protocol section.
     *
     * @returns string
     */
    domain() {
        if (!this._domain) {
            this._domain = this._route.routeDomain() ||
                // If route domain is empty, read the domain from app 
                // config file.
                route_1.Route.clearDomain(helpers_1.config('app.domain', ''));
        }
        return this._domain;
    }
    /**
     * Returns parameter components in the route path as key-value object
     * where key is the parameter name and value is the param component
     *
     * @returns array
     */
    getPathParamComponents() {
        if (this._pathParams === null) {
            this._pathParams = this.getParamComponents(this._route.getUriComponents());
        }
        return this._pathParams;
    }
    /**
     * Returns a key-value collection of param components in
     * the submitted components list
     *
     * @param components
     */
    getParamComponents(components) {
        const paramComponents = {};
        components.forEach(uriComponent => {
            if (uriComponent instanceof routeParamComponent_1.ParamComponent) {
                paramComponents[uriComponent.getName()] = uriComponent;
            }
        });
        return paramComponents;
    }
}
exports.RouteUrlGenerator = RouteUrlGenerator;
