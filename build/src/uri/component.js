"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UriComponent = /** @class */ (function () {
    function UriComponent(component) {
        this.component = component.trim();
    }
    /**
     *
     * @param uriComponent
     */
    UriComponent.prototype.equals = function (uriComponent) {
        if (uriComponent === null || uriComponent === void 0) {
            return false;
        }
        return this.component === uriComponent.component;
    };
    return UriComponent;
}());
exports.UriComponent = UriComponent;
