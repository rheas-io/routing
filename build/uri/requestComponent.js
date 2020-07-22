"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestComponent = void 0;
const baseComponent_1 = require("./baseComponent");
const routeParamComponent_1 = require("./routeParamComponent");
class RequestComponent extends baseComponent_1.UriComponent {
    /**
     * @inheritdoc
     *
     * @param status
     */
    setComponent(component) {
        this._routeComponent = component;
        return this;
    }
    /**
     * @inheritdoc
     *
     * @returns boolean
     */
    isParam() {
        return this._routeComponent instanceof routeParamComponent_1.ParamComponent;
    }
    /**
     * @inheritdoc
     *
     * @return object
     */
    getParam() {
        const param = {};
        if (this._routeComponent instanceof routeParamComponent_1.ParamComponent) {
            param[this._routeComponent.getName()] = decodeURIComponent(this.getSegment());
        }
        return param;
    }
}
exports.RequestComponent = RequestComponent;
