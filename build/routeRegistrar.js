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
exports.RouteRegistrar = void 0;
var route_1 = require("./route");
var RouteRegistrar = /** @class */ (function (_super) {
    __extends(RouteRegistrar, _super);
    function RouteRegistrar() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * List of middlewares to be used by this route
         *
         * @var array
         */
        _this._middlewares = [];
        /**
         * Route prefix to be used. For eg, change this to "api" to
         * register API routes, so that the routes defined in the routeList
         * doesn't have to prefix "api" before each route.
         *
         * @var string
         */
        _this._path = "";
        return _this;
    }
    /**
     * An exposed function that allows users to register their
     * routes
     *
     * @return array
     */
    RouteRegistrar.prototype.routesList = function () {
        return [];
    };
    return RouteRegistrar;
}(route_1.Route));
exports.RouteRegistrar = RouteRegistrar;
