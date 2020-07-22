"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MethodValidator = void 0;
class MethodValidator {
    /**
     * Validates the requested method with the route.
     *
     * @param route
     * @param request
     */
    matches(route, request) {
        return route.getMethods().includes(request.getMethod());
    }
}
exports.MethodValidator = MethodValidator;
