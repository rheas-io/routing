"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SchemeValidator = /** @class */ (function () {
    function SchemeValidator() {
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
        if (route.routeSecure()) {
            return request.isSecure();
        }
        return true;
    };
    return SchemeValidator;
}());
exports.SchemeValidator = SchemeValidator;
