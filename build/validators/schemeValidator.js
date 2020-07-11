"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemeValidator = void 0;
var helpers_1 = require("@rheas/support/helpers");
var SchemeValidator = /** @class */ (function () {
    /**
     * Creates a scheme validator. Reads the dev mode status from app
     * configurations.
     *
     */
    function SchemeValidator() {
        this._devMode = helpers_1.config('app.dev', false);
    }
    /**
     * Checks if the request came through a secure channel if the
     * route accepts secure channel requests only. In all other cases,
     * return true.
     *
     * @param route
     * @param request
     */
    SchemeValidator.prototype.matches = function (route, request) {
        if (!this._devMode && !request.isSecure()) {
            return route.isHttpRoute();
        }
        return true;
    };
    return SchemeValidator;
}());
exports.SchemeValidator = SchemeValidator;
