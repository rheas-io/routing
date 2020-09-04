import { IApp } from '@rheas/contracts/core';
import { UrlGenerator } from './urlGenerator';
import { ServiceProvider } from '@rheas/services';
import { InstanceHandler } from '@rheas/contracts/container';

export class UrlServiceProvider extends ServiceProvider {
    /**
     * Returns the url generator service resolver.
     *
     * @returns
     */
    public serviceResolver(): InstanceHandler {
        return (app) => new UrlGenerator(app.get('router'));
    }
}
