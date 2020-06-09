"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var routeFixedComponent_1 = require("./routeFixedComponent");
var routeParamComponent_1 = require("./routeParamComponent");
var ComponentFactory = /** @class */ (function () {
    function ComponentFactory() {
    }
    /**
     * Creates a Uri component from the uri string
     *
     * @param uri
     */
    ComponentFactory.createFromComponent = function (component) {
        if (component.startsWith(':')) {
            return new routeParamComponent_1.ParamComponent(component);
        }
        return new routeFixedComponent_1.FixedComponent(component);
    };
    /**
     * Creates uriComponents from a domain string and returns the list.
     *
     * @param domain
     */
    ComponentFactory.createFromDomain = function (domain) {
        return domain.split('.').map(function (component) { return ComponentFactory.createFromComponent(component); });
    };
    /**
     * Creates uriComponents from a route uri and returns it.
     *
     * @param uri
     */
    ComponentFactory.createFromRoute = function (route) {
        var uri = route.routePath();
        return uri.split('/').map(function (component) { return ComponentFactory.createFromComponent(component); });
    };
    return ComponentFactory;
}());
exports.ComponentFactory = ComponentFactory;
