"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UriComponent = void 0;
class UriComponent {
    /**
     * Stores the segment as it is. No trimming or any other modifications
     * are done here as there may be instances where spaces are put purposefully
     * in request uri's.
     *
     * @param uriSegment
     */
    constructor(uriSegment) {
        this._component = uriSegment;
    }
    /**
     * Returns the whole path segment.
     *
     * @returns string
     */
    getSegment() {
        return this._component;
    }
    /**
     * Base uri component equality check.
     *
     * Returns true only if the component values matches.
     *
     * @param uriComponent
     */
    equals(uriComponent) {
        if (uriComponent === null || uriComponent === void 0) {
            return false;
        }
        return this.getSegment() === uriComponent.getSegment();
    }
}
exports.UriComponent = UriComponent;
