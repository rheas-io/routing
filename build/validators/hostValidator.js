"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HostValidator = /** @class */ (function () {
    function HostValidator() {
    }
    /**
     * Matches the route domain with the request domain.
     *
     * @param route
     * @param request
     */
    HostValidator.prototype.matches = function (route, request) {
        return route.routeDomain() === request.getHost();
    };
    return HostValidator;
}());
exports.HostValidator = HostValidator;
