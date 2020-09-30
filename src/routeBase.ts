import { Str } from '@rheas/support/str';
import { IRouteBase } from '@rheas/contracts/routes/routeBase';

export class RouteBase<T extends IRouteBase<T>> implements IRouteBase<T> {
    /**
     * Sub domain/domain of this route/group
     *
     * @var string
     */
    protected _domain: string = '';

    /**
     * Flag to set if this route or route/group is for http
     * connections.
     *
     * @var boolean
     */
    protected _httpRoute: boolean = false;

    /**
     * Route specific middlewares
     *
     * @var array
     */
    protected _middlewares: string[] = [];

    /**
     * Middlewares that doesn't have to be run on this route.
     *
     * @var Set
     */
    protected _excludedMiddlewares: Set<string> = new Set();

    /**
     * Sets the domian of this route
     *
     * @param domain
     */
    public domain(domain: string): T {
        this._domain = Str.domainWithoutSchema(domain);

        return (this as unknown) as T;
    }

    /**
     * Sets the route to allow http requests.
     *
     * @return this
     */
    public http(httpRoute: boolean = true): T {
        this._httpRoute = httpRoute;

        return (this as unknown) as T;
    }

    /**
     * Sets the middlewares to be used by this route or route group.
     *
     * @param middlewares
     */
    public middleware(...middlewares: string[]): T {
        this._middlewares = middlewares;

        return (this as unknown) as T;
    }

    /**
     * Sets the excluded middlewares of this route.
     *
     * @param middlewares
     */
    public withoutMiddleware(...middlewares: string[]): T {
        middlewares.forEach((middleware) => this._excludedMiddlewares.add(middleware));

        return (this as unknown) as T;
    }

    /**
     * Returns the domain of this route/group.
     *
     * @returns
     */
    public getDomain(): string {
        return this._domain;
    }

    /**
     * Returns true if the route accepts http conenction.
     *
     * @returns
     */
    public isHttpRoute(): boolean {
        return !!this._httpRoute;
    }

    /**
     * Returns all the route middlewares.
     *
     * @returns
     */
    public getMiddlewares(): string[] {
        return this._middlewares;
    }

    /**
     * Returns all the excluded middlewares.
     *
     * @returns
     */
    public excludedMiddlewares(): Set<string> {
        return this._excludedMiddlewares;
    }
}
