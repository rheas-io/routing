"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UriComponent = void 0;
var UriComponent = /** @class */ (function () {
    /**
     * Stores the segment as it is. No trimming or any other modifications
     * are done here as there may be instances where spaces are put purposefully
     * in request uri's.
     *
     * @param uriSegment
     */
    function UriComponent(uriSegment) {
        this._component = uriSegment;
    }
    /**
     * Returns the whole path segment.
     *
     * @returns string
     */
    UriComponent.prototype.getSegment = function () {
        return this._component;
    };
    /**
     * Base uri component equality check.
     *
     * Returns true only if the component values matches.
     *
     * @param uriComponent
     */
    UriComponent.prototype.equals = function (uriComponent) {
        if (uriComponent === null || uriComponent === void 0) {
            return false;
        }
        return this.getSegment() === uriComponent.getSegment();
    };
    return UriComponent;
}());
exports.UriComponent = UriComponent;
