"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParamComponent = void 0;
const support_1 = require("@rheas/support");
const baseComponent_1 = require("./baseComponent");
class ParamComponent extends baseComponent_1.UriComponent {
    /**
     * Creates a new parameter component of the route path. The particular
     * segment is passed as argument.
     *
     * @param component
     */
    constructor(component) {
        super(component);
        this._optional = component.endsWith('?');
    }
    /**
     * Returns true if the parameter is optional ie has a ? at
     * the end of the path fragment.
     *
     * @returns boolean
     */
    isOptional() {
        return this._optional;
    }
    /**
     * Returns the name of the parameter without any optional
     * symbol (?) or colon (:)
     *
     * @returns param name
     */
    getName() {
        return support_1.Str.trimEnd(support_1.Str.trimStart(this.getSegment(), ":"), '?');
    }
    /**
     * Returns true if the argument components value is not
     * empty. Emptiness is checked by char length. We won't be
     * trimming any characters, so even blank spaces are counted
     * as valid.
     *
     * @param uriComponent
     */
    equals(uriComponent) {
        if (uriComponent === null || uriComponent === void 0) {
            return this.isOptional();
        }
        // If there is an actual component passed, check the length
        // of the string. Length of the string > 0 indicates, the presence
        // of a value and return true, otherwise return value of optional.
        return uriComponent.getSegment().length > 0 || this.isOptional();
    }
}
exports.ParamComponent = ParamComponent;
