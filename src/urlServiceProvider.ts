import { IApp } from "@rheas/contracts/core";
import { UrlGenerator } from "./urlGenerator";
import { ServiceProvider } from "@rheas/services";

export class UrlServiceProvider extends ServiceProvider {

    /**
     * Registers the url generator service of the
     */
    public register() {
        this.container.singleton(this.name, app => {
            return new UrlGenerator(<IApp>app, app.get('router'));
        });
    }
}