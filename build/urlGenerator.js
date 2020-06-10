"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlGenerator = void 0;
var route_1 = require("./route");
var support_1 = require("@rheas/support");
var routeUrlGenerator_1 = require("./routeUrlGenerator");
var invalidArgument_1 = require("@rheas/errors/invalidArgument");
var UrlGenerator = /** @class */ (function () {
    /**
     * Creates a url generator for the application
     *
     * @param app
     */
    function UrlGenerator(app, router) {
        this._app = app;
        this._router = router;
    }
    /**
     * Returns the current request url.
     *
     * @param req
     */
    UrlGenerator.prototype.current = function (req) {
        return req.getFullUrl();
    };
    /**
     * Returns the previous url or the fallback url, if not empty. Otherwise
     * returns the root url.
     *
     * @param req
     * @param fallback
     */
    UrlGenerator.prototype.previous = function (req, fallback) {
        if (fallback === void 0) { fallback = "/"; }
        //TODO
        return this.to(fallback);
    };
    /**
     * Generates a full route url. Params are replaced with the given argument list.
     * Throws error when params are not given. If routes doesn't need the params given,
     * they are appended as query string
     *
     * @param name
     * @param params
     */
    UrlGenerator.prototype.toRoute = function (name, params) {
        if (params === void 0) { params = {}; }
        var route = this._router.getNamedRoute(name);
        if (route === null) {
            throw new invalidArgument_1.InvalidArgumentException("Route " + name + " not defined.");
        }
        return this.routeUrl(route, params);
    };
    /**
     * Returns a url of the given route.
     *
     * @param route
     * @param params
     * @param secure
     */
    UrlGenerator.prototype.routeUrl = function (route, params, secure) {
        if (params === void 0) { params = {}; }
        return new routeUrlGenerator_1.RouteUrlGenerator(this._app, route).generateUrl(params, secure);
    };
    /**
     * Creates an absolute url to the given path. Params are used to replace params or append query
     * string. By default all paths are created as secure if no value is given.
     *
     * @param path
     * @param params
     * @param secure
     */
    UrlGenerator.prototype.to = function (path, params, secure) {
        if (params === void 0) { params = {}; }
        if (support_1.Str.isValidUrl(path)) {
            return path;
        }
        // If the url is not a valid url, create a route from the
        // path and generate a route url. As long as a route is not 
        // registered on a router, we can do things like this.
        var route = new route_1.Route(path);
        return this.routeUrl(route, params, secure);
    };
    return UrlGenerator;
}());
exports.UrlGenerator = UrlGenerator;
