"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var baseComponent_1 = require("./baseComponent");
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
     * Creates uriComponents from a route uri and returns it.
     *
     * @param uri
     */
    ComponentFactory.createFromRoute = function (route) {
        var uri = route.getPath();
        return uri.split('/').map(function (component) { return ComponentFactory.createFromComponent(component); });
    };
    /**
     * Creates a uri components list from the request path.
     *
     * @param request
     */
    ComponentFactory.createFromRequest = function (request) {
        var uri = request.getPath();
        return uri.split('/').map(function (component) { return new baseComponent_1.UriComponent(component); });
    };
    return ComponentFactory;
}());
exports.ComponentFactory = ComponentFactory;
