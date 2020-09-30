import { Router } from './router';
import { IApp } from '@rheas/contracts/core/app';
import { IRouter } from '@rheas/contracts/routes';
import { ServiceProvider } from '@rheas/services';
import { InstanceHandler } from '@rheas/contracts/container';

export abstract class RouterServiceProvider extends ServiceProvider {
    /**
     * Application router instance.
     *
     * @var IRouter
     */
    protected router: IRouter;

    /**
     * Creates a new router service with the router initialized.
     *
     * @param name
     * @param app
     */
    constructor(name: string, app: IApp) {
        super(name, app);

        this.router = new Router(app, app.get('middlewares'));

        // Register all the routes after `router` gets registered on the
        // app container.
        this.registered(() => this.registerRoutesOnRouter());

        // Once app is booted, ie all the services are booted, cache all the
        // routes, if they are not already cached.
        app.booted(() => {
            !this.router.cached() && this.router.cacheRoutes();
        });
    }

    /**
     * Registers a router on the application instance. We will return
     * the already initialized router instance.
     */
    public serviceResolver(): InstanceHandler {
        return () => this.router;
    }

    /**
     * Register the application routes here.
     */
    protected abstract registerRoutesOnRouter(): void;
}
