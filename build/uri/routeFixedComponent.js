"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixedComponent = void 0;
const baseComponent_1 = require("./baseComponent");
class FixedComponent extends baseComponent_1.UriComponent {
    constructor(component) {
        super(component);
        this.mayBeEncoded = this.isDecodingNeeded();
    }
    /**
     * Checks if the encoded version of the component and component
     * are matching. If they are not matching, it is possible that
     * the request uri might be encoded by the browser and when
     * component checking, the request uri component has to be decoded
     * and matched.
     *
     * @return boolean
     */
    isDecodingNeeded() {
        return encodeURIComponent(this.getSegment()) !== this.getSegment();
    }
    /**
     * Returns true if the component values are matching. If it is not
     * matching, we check for the need of decoding. If decoding is required,
     * we decode the argument submitted and compare it with this value
     *
     * @param uriComponent
     */
    equals(uriComponent) {
        if (uriComponent === null || uriComponent === void 0) {
            return false;
        }
        return (this.getSegment() === uriComponent.getSegment() ||
            (this.mayBeEncoded && this.getSegment() === decodeURIComponent(uriComponent.getSegment())));
    }
}
exports.FixedComponent = FixedComponent;
