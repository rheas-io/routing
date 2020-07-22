"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlGenerator = void 0;
const route_1 = require("./route");
const support_1 = require("@rheas/support");
const routeUrlGenerator_1 = require("./routeUrlGenerator");
const invalidArgument_1 = require("@rheas/errors/invalidArgument");
class UrlGenerator {
    /**
     * Creates a url generator for the application
     *
     * @param router
     */
    constructor(router) {
        this._router = router;
    }
    /**
     * Returns the current request url.
     *
     * @param req
     */
    current(req) {
        return req.getFullUrl();
    }
    /**
     * Returns the previous url or the fallback url, if not empty. Otherwise
     * returns the root url.
     *
     * @param req
     * @param fallback
     */
    previous(req, fallback = "/") {
        //TODO
        return this.to(fallback);
    }
    /**
     * Generates a full route url. Params are replaced with the given argument list.
     * Throws error when params are not given. If routes doesn't need the params given,
     * they are appended as query string
     *
     * @param name
     * @param params
     */
    toRoute(name, params = {}) {
        const route = this._router.getNamedRoute(name);
        if (route === null) {
            throw new invalidArgument_1.InvalidArgumentException(`Route ${name} not defined.`);
        }
        return this.routeUrl(route, params);
    }
    /**
     * Returns a url of the given route.
     *
     * @param route
     * @param params
     * @param secure
     */
    routeUrl(route, params = {}, secure) {
        return new routeUrlGenerator_1.RouteUrlGenerator(route).generateUrl(params, secure);
    }
    /**
     * Creates an absolute url to the given path. Params are used to replace params or append query
     * string. By default all paths are created as secure if no value is given.
     *
     * @param path
     * @param params
     * @param secure
     */
    to(path, params = {}, secure) {
        if (support_1.Str.isValidUrl(path)) {
            return path;
        }
        // If the url is not a valid url, create a route from the
        // path and generate a route url. As long as a route is not 
        // registered on a router, we can do things like this.
        const route = new route_1.Route(path);
        return this.routeUrl(route, params, secure);
    }
}
exports.UrlGenerator = UrlGenerator;
