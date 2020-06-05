import { IApp } from "@rheas/contracts/core/app";
import { StringObject, IRequest } from "@rheas/contracts";
import { IUrlGenerator, IRouter } from "@rheas/contracts/routes";
export declare class UrlGenerator implements IUrlGenerator {
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
    constructor(app: IApp);
    /**
     * Returns the current request url.
     *
     * @param req
     */
    current(req: IRequest): string;
    /**
     * Returns the previous url or the fallback url, if not empty. Otherwise
     * returns the root url.
     *
     * @param req
     * @param fallback
     */
    previous(req: IRequest, fallback?: string): string;
    /**
     * Generates a full route url. Params are replaced with the given argument list.
     * Throws error when params are not given. If routes doesn't need the params given,
     * they are appended as query string
     *
     * @param name
     * @param params
     */
    toRoute(name: string, params?: StringObject): string;
    /**
     * Creates an absolute url to the given path. Params are used to replace params or append query
     * string. By default all paths are created as secure if no value is given.
     *
     * @param path
     * @param params
     * @param secure
     */
    to(path: string, params?: StringObject, secure?: boolean | null): string;
}
