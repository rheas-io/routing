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
var baseComponent_1 = require("./baseComponent");
var FixedComponent = /** @class */ (function (_super) {
    __extends(FixedComponent, _super);
    function FixedComponent(component) {
        var _this = _super.call(this, component) || this;
        _this.mayBeEncoded = _this.isDecodingNeeded();
        return _this;
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
    FixedComponent.prototype.isDecodingNeeded = function () {
        return encodeURIComponent(this.component) !== this.component;
    };
    /**
     * Returns true if the component values are matching. If it is not
     * matching, we check for the need of decoding. If decoding is required,
     * we decode the argument submitted and compare it with this value
     *
     * @param uriComponent
     */
    FixedComponent.prototype.equals = function (uriComponent) {
        if (uriComponent === null || uriComponent === void 0) {
            return false;
        }
        return (this.component === uriComponent.component ||
            (this.mayBeEncoded && this.component === decodeURIComponent(uriComponent.component)));
    };
    return FixedComponent;
}(baseComponent_1.UriComponent));
exports.FixedComponent = FixedComponent;
