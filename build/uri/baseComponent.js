"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UriComponent = /** @class */ (function () {
    /**
     * Stores the segment as it is. No trimming or any other modifications
     * are done here as there may be instances where spaces are put purposefully
     * in request uri's.
     *
     * @param uriSegment
     */
    function UriComponent(uriSegment) {
        this.component = uriSegment;
    }
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
        return this.component === uriComponent.component;
    };
    return UriComponent;
}());
exports.UriComponent = UriComponent;