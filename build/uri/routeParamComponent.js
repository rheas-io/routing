"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var support_1 = require("@rheas/support");
var baseComponent_1 = require("./baseComponent");
var ParamComponent = /** @class */ (function (_super) {
    __extends(ParamComponent, _super);
    /**
     * Creates a new parameter component of the route path. The particular
     * segment is passed as argument.
     *
     * @param component
     */
    function ParamComponent(component) {
        var _this = _super.call(this, component) || this;
        _this.optional = component.endsWith('?');
        return _this;
    }
    /**
     * Returns the name of the parameter without any optional
     * symbol (?) or colon (:)
     *
     * @returns param name
     */
    ParamComponent.prototype.getName = function () {
        return support_1.Str.trimEnd(support_1.Str.trimStart(this.component, ":"), '?');
    };
    /**
     * Returns true if the argument components value is not
     * empty. Emptiness is checked by char length. We won't be
     * trimming any characters, so even blank spaces are counted
     * as valid.
     *
     * @param uriComponent
     */
    ParamComponent.prototype.equals = function (uriComponent) {
        if (uriComponent === null || uriComponent === void 0) {
            return this.optional;
        }
        // If there is an actual component passed, check the length
        // of the string. Length of the string > 0 indicates, the presence
        // of a value and return true, otherwise return value of optional.
        return uriComponent.component.length > 0 || this.optional;
    };
    return ParamComponent;
}(baseComponent_1.UriComponent));
exports.ParamComponent = ParamComponent;
