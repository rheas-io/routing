"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlServiceProvider = void 0;
const urlGenerator_1 = require("./urlGenerator");
const services_1 = require("@rheas/services");
class UrlServiceProvider extends services_1.ServiceProvider {
    /**
     * Registers the url generator service of the
     */
    register() {
        this.container.singleton(this.name, app => {
            return new urlGenerator_1.UrlGenerator(app.get('router'));
        });
    }
}
exports.UrlServiceProvider = UrlServiceProvider;
