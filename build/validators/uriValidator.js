"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UriValidator = void 0;
var UriValidator = /** @class */ (function () {
    function UriValidator() {
    }
    /**
     * Validates whether the request uri matches the route uri
     *
     * @param route
     * @param request
     */
    UriValidator.prototype.matches = function (route, request) {
        var routeComponents = route.getUriComponents();
        var reqComponents = request.getPathComponents();
        if (reqComponents.length > routeComponents.length) {
            return false;
        }
        for (var i = 0; i < routeComponents.length; i++) {
            if (!routeComponents[i].equals(reqComponents[i])) {
                return false;
            }
            // Sets the matching route component on the request uri component.
            // This helps in later determining the route params.
            reqComponents[i] && reqComponents[i].setComponent(routeComponents[i]);
        }
        return true;
    };
    return UriValidator;
}());
exports.UriValidator = UriValidator;
