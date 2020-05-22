"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
