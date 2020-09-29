import { Route } from './route';
import { Str } from '@rheas/support/str';
import { AnyObject, IRequest } from '@rheas/contracts';
import { RouteUrlGenerator } from './routeUrlGenerator';
import { InvalidArgumentException } from '@rheas/errors/invalidArgument';
import { IUrlGenerator, IRouter, IRoute } from '@rheas/contracts/routes';

export class UrlGenerator implements IUrlGenerator {
    /**
     * Application router. Needed to resolve url by route
     * names.
     *
     * @var IRouter
     */
    protected _router: IRouter;

    /**
     * Creates a url generator for the application
     *
     * @param router
     */
    constructor(router: IRouter) {
        this._router = router;
    }

    /**
     * Returns the current request url.
     *
     * @param req
     */
    public current(req: IRequest): string {
        return req.getFullUrl();
    }

    /**
     * Returns the previous url or the fallback url, if not empty. Otherwise
     * returns the root url.
     *
     * @param req
     * @param fallback
     */
    public previous(req: IRequest, fallback: string = '/'): string {
        //TODO
        return this.to(fallback);
    }

    /**
     * Generates a full route url. Params are replaced with the given argument list.
     * Throws error when params are not given. If routes doesn't need the params given,
     * they are appended as query string
     *
     * @param name
     * @param params
     */
    public toRoute(name: string, params: AnyObject = {}): string {
        const route: IRoute | null = this._router.getNamedRoute(name);

        if (route === null) {
            throw new InvalidArgumentException(`Route ${name} not defined.`);
        }

        return this.routeUrl(route, params);
    }

    /**
     * Returns a url of the given route.
     *
     * @param route
     * @param params
     * @param secure
     */
    public routeUrl(route: IRoute, params: AnyObject = {}, secure?: boolean) {
        return new RouteUrlGenerator(route).generateUrl(params, secure);
    }

    /**
     * Creates an absolute url to the given path. Params are used to replace params or append query
     * string. By default all paths are created as secure if no value is given.
     *
     * @param path
     * @param params
     * @param secure
     */
    public to(path: string, params: AnyObject = {}, secure?: boolean): string {
        if (Str.isValidUrl(path)) {
            return path;
        }
        // If the url is not a valid url, create a route from the
        // path and generate a route url. As long as a route is not
        // registered on a router, we can do things like this.
        const route = new Route(path);

        return this.routeUrl(route, params, secure);
    }
}
