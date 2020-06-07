import { Str } from "@rheas/support";
import { IApp } from "@rheas/contracts/core/app";
import { RouteUrlGenerator } from "./routeUrlGenerator";
import { StringObject, IRequest } from "@rheas/contracts";
import { InvalidArgumentException } from "@rheas/errors/invalidArgument";
import { IUrlGenerator, IRouter, IRoute } from "@rheas/contracts/routes";

export class UrlGenerator implements IUrlGenerator {

    /**
     * Application instance.
     * 
     * @var IApp
     */
    protected _app: IApp;

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
     * @param app 
     */
    constructor(app: IApp) {
        this._app = app;

        this._router = this._app.get('router');
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
    public previous(req: IRequest, fallback: string = "/"): string {
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
    public toRoute(name: string, params: StringObject = {}): string {
        const route: IRoute | null = this._router.getNamedRoute(name);

        if (route === null) {
            throw new InvalidArgumentException(`Route ${name} not defined.`);
        }

        return new RouteUrlGenerator(this._app, route).generateUrl(params);
    }

    /**
     * Creates an absolute url to the given path. Params are used to replace params or append query 
     * string. By default all paths are created as secure if no value is given.
     * 
     * @param path 
     * @param params
     * @param secure
     */
    public to(path: string, params: StringObject = {}, secure: boolean | null = null): string {

        if (Str.isValidUrl(path)) {
            return path;
        }

        return path;
    }
}