"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentFactory = void 0;
const routeFixedComponent_1 = require("./routeFixedComponent");
const routeParamComponent_1 = require("./routeParamComponent");
class ComponentFactory {
    /**
     * Creates a Uri component from the uri string
     *
     * @param uri
     */
    static createFromComponent(component) {
        if (component.startsWith(':')) {
            return new routeParamComponent_1.ParamComponent(component);
        }
        return new routeFixedComponent_1.FixedComponent(component);
    }
    /**
     * Creates uriComponents from a domain string and returns the list.
     *
     * @param domain
     */
    static createFromDomain(domain) {
        return domain.split('.').map(component => ComponentFactory.createFromComponent(component));
    }
    /**
     * Creates uriComponents from a route uri and returns it.
     *
     * @param uri
     */
    static createFromRoute(route) {
        const uri = route.routePath();
        return uri.split('/').map(component => ComponentFactory.createFromComponent(component));
    }
}
exports.ComponentFactory = ComponentFactory;
