"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UrlGenerator = /** @class */ (function () {
    /**
     * Creates a url generator for the application
     *
     * @param app
     */
    function UrlGenerator(app) {
        this._app = app;
        this._router = this._app.get('router');
    }
    /**
     * Returns the current request url.
     *
     * @param req
     */
    UrlGenerator.prototype.current = function (req) {
        throw new Error("Method not implemented.");
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
        throw new Error("Method not implemented.");
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
        throw new Error("Method not implemented.");
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
        if (secure === void 0) { secure = null; }
        throw new Error("Method not implemented.");
    };
    return UrlGenerator;
}());
exports.UrlGenerator = UrlGenerator;
