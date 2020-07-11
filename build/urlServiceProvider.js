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
exports.UrlServiceProvider = void 0;
var urlGenerator_1 = require("./urlGenerator");
var services_1 = require("@rheas/services");
var UrlServiceProvider = /** @class */ (function (_super) {
    __extends(UrlServiceProvider, _super);
    function UrlServiceProvider() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Registers the url generator service of the
     */
    UrlServiceProvider.prototype.register = function () {
        this.container.singleton(this.name, function (app) {
            return new urlGenerator_1.UrlGenerator(app.get('router'));
        });
    };
    return UrlServiceProvider;
}(services_1.ServiceProvider));
exports.UrlServiceProvider = UrlServiceProvider;
