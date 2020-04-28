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
var support_1 = require("@laress/support");
var component_1 = require("./component");
var ParamComponent = /** @class */ (function (_super) {
    __extends(ParamComponent, _super);
    function ParamComponent(component) {
        var _this = _super.call(this, component) || this;
        _this.optional = component.endsWith('?');
        return _this;
    }
    /**
     * @inheritdoc
     */
    ParamComponent.prototype.getName = function () {
        return support_1.Str.trimStart(this.component, ":");
    };
    /**
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
}(component_1.UriComponent));
exports.ParamComponent = ParamComponent;
