"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HostValidator = void 0;
class HostValidator {
    /**
     * Matches the route domain with the request domain.
     *
     * @param route
     * @param request
     */
    matches(route, request) {
        if ("" === route.routeDomain()) {
            return true;
        }
        return route.routeDomain() === request.getHost();
    }
}
exports.HostValidator = HostValidator;
