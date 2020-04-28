"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var support_1 = require("@laress/support");
var component_1 = require("./component");
var paramComponent_1 = require("./paramComponent");
var ComponentFactory = /** @class */ (function () {
    function ComponentFactory() {
    }
    /**
     * Creates a Uri component from the uri
     *
     * @param uri
     */
    ComponentFactory.createFromComponent = function (component) {
        if (component.startsWith(':')) {
            return new paramComponent_1.ParamComponent(component);
        }
        return new component_1.UriComponent(component);
    };
    /**
     * Creates uriComponents from a route uri and returns it.
     *
     * @param uri
     */
    ComponentFactory.createFromUri = function (uri) {
        var clearUri = support_1.Str.trim(support_1.Str.replaceWithOne(uri.trim(), '/'), '/');
        return clearUri.split('/').map(function (component) { return ComponentFactory.createFromComponent(component); });
    };
    return ComponentFactory;
}());
exports.ComponentFactory = ComponentFactory;
