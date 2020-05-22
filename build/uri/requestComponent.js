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
var routeParamComponent_1 = require("./routeParamComponent");
var RequestComponent = /** @class */ (function (_super) {
    __extends(RequestComponent, _super);
    function RequestComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @inheritdoc
     *
     * @param status
     */
    RequestComponent.prototype.setComponent = function (component) {
        this._routeComponent = component;
        return this;
    };
    /**
     * @inheritdoc
     *
     * @returns boolean
     */
    RequestComponent.prototype.isParam = function () {
        return this._routeComponent instanceof routeParamComponent_1.ParamComponent;
    };
    /**
     * @inheritdoc
     *
     * @return object
     */
    RequestComponent.prototype.getParam = function () {
        var param = {};
        if (this._routeComponent instanceof routeParamComponent_1.ParamComponent) {
            param[this._routeComponent.getName()] = decodeURIComponent(this.component);
        }
        return param;
    };
    return RequestComponent;
}(baseComponent_1.UriComponent));
exports.RequestComponent = RequestComponent;
