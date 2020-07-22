"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemeValidator = void 0;
const helpers_1 = require("@rheas/support/helpers");
class SchemeValidator {
    /**
     * Creates a scheme validator. Reads the dev mode status from app
     * configurations.
     *
     */
    constructor() {
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
    matches(route, request) {
        if (!this._devMode && !request.isSecure()) {
            return route.isHttpRoute();
        }
        return true;
    }
}
exports.SchemeValidator = SchemeValidator;
