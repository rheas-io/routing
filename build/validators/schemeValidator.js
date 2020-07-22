"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemeValidator = void 0;
const helpers_1 = require("@rheas/support/helpers");
class SchemeValidator {
    /**
     * Creates a scheme validator. Reads the production mode flag from app
     * configurations. If the app is not in production mode, ie in debug
     * mode, schema check is ignored.
     *
     */
    constructor() {
        this._production = helpers_1.config('app.production', true);
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
        if (this._production && !request.isSecure()) {
            return route.isHttpRoute();
        }
        return true;
    }
}
exports.SchemeValidator = SchemeValidator;
