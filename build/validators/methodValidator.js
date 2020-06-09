"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MethodValidator = void 0;
var MethodValidator = /** @class */ (function () {
    function MethodValidator() {
    }
    /**
     * Validates the requested method with the route.
     *
     * @param route
     * @param request
     */
    MethodValidator.prototype.matches = function (route, request) {
        return route.getMethods().includes(request.getMethod());
    };
    return MethodValidator;
}());
exports.MethodValidator = MethodValidator;
