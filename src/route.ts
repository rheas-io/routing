import { RouteBase } from './routeBase';
import { Str } from '@rheas/support/str';
import { RouteGroup } from './routeGroup';
import { IUriComponent } from '@rheas/contracts/routes/uri';
import { ComponentFactory } from './uri/uriComponentFactory';
import { IRequestHandler, IRoute, IRouteGroup } from '@rheas/contracts/routes';

export class Route extends RouteBase<IRoute> implements IRoute {
    /**
     * All of the verbs supported by the route.
     *
     * @var array
     */
    public static verbs = [
        'GET',
        'HEAD',
        'POST',
        'PUT',
        'PATCH',
        'DELETE',
        'OPTIONS',
        'CONNECT',
        'TRACE',
    ];

    /**
     * Http methods this route handles.
     *
     * @var array
     */
    protected _methods: string[] = [];

    /**
     * Route controller action
     *
     * @var string
     */
    protected _action: string | IRequestHandler = '';

    /**
     * Name of this route
     *
     * @var string
     */
    protected _name: string = '';

    /**
     * Uri path of this group of routes
     *
     * @var string
     */
    protected _path: string = '';

    /**
     * Returns the uri components of this route path
     *
     * @var array
     */
    private _uriComponents: IUriComponent[] | null = null;

    /**
     * Creates a new route for the given path.
     *
     * @return Route
     */
    constructor(path: string) {
        super();

        this._path = Str.path(path);
    }

    /**
     * Creates a new route group.
     *
     * @param prefix
     */
    public static group(prefix: string = ''): IRouteGroup {
        return new RouteGroup(prefix);
    }

    /**
     * Creates a new route for all methods
     *
     * @param uri
     * @param controller
     */
    public static all(uri: string, controller: string | IRequestHandler) {
        return new Route(uri).methods([...Route.verbs]).action(controller);
    }

    /**
     * Creates a new route for GET and HEAD requests
     *
     * @param uri
     * @param controller
     */
    public static get(uri: string, controller: string | IRequestHandler) {
        return new Route(uri).methods('GET').action(controller);
    }

    /**
     * Creates a new route for PUT requests
     *
     * @param uri
     * @param controller
     */
    public static put(uri: string, controller: string | IRequestHandler) {
        return new Route(uri).methods('PUT').action(controller);
    }

    /**
     * Creates a new route for post requests
     *
     * @param uri
     * @param controller
     */
    public static post(uri: string, controller: string | IRequestHandler) {
        return new Route(uri).methods('POST').action(controller);
    }

    /**
     * Creates a new route for PATCH requests
     *
     * @param uri
     * @param controller
     */
    public static patch(uri: string, controller: string | IRequestHandler) {
        return new Route(uri).methods('PATCH').action(controller);
    }

    /**
     * Creates a new route for DELETE requests
     *
     * @param uri
     * @param controller
     */
    public static delete(uri: string, controller: string | IRequestHandler) {
        return new Route(uri).methods('DELETE').action(controller);
    }

    /**
     * Creates a new route for OPTIONS requests
     *
     * @param uri
     * @param controller
     */
    public static options(uri: string, controller: string | IRequestHandler) {
        return new Route(uri).methods('OPTIONS').action(controller);
    }

    /**
     * Sets the name of this route
     *
     * @param name
     */
    public name(name: string): IRoute {
        this._name = name;

        return this;
    }

    /**
     * Sets the methods of this route
     *
     * @param methods
     */
    public methods(methods: string | string[]): IRoute {
        if (!Array.isArray(methods)) {
            methods = Array.from(arguments);
        }

        if (!methods.every((method) => Route.verbs.includes(method))) {
            throw new Error(
                `Method not supported on route ${this._path}. ` +
                    `Supported methods are: ${Route.verbs}`,
            );
        }

        // Add HEAD if methods contains GET and does not contain a HEAD
        if (methods.includes('GET') && !methods.includes('HEAD')) {
            methods.push('HEAD');
        }

        this._methods = methods;

        return this;
    }

    /**
     * Sets the controller action of this route
     *
     * @param action
     */
    public action(action: string | IRequestHandler): IRoute {
        this._action = action;

        return this;
    }

    /**
     * Sets the group properties on the route like setting perfixes, prepending
     * middlewares, updating excluded middlewares etc.
     *
     * @param group
     */
    public setGroupProperties(group: IRouteGroup): IRoute {
        // Prepend the group prefix to the route path.
        this._path = Str.path(Str.path(group.getPrefix()) + '/' + this.getPath());

        // Add middlewares from the group at the beginning of the
        // middleware list.
        this._middlewares.unshift(...group.getMiddlewares());

        // Merge route middleware exclusion list with the group
        // exclusion list.
        group.excludedMiddlewares().forEach(this._excludedMiddlewares.add);

        // Set a domain only if one is not already set on the route.
        if (!this.getDomain()) {
            this.domain(group.getDomain());
        }
        // isHttp is a property of the route. Set the property only if
        // it is not already set.
        if (!this.isHttpRoute()) {
            this.http(group.isHttpRoute());
        }
        return this;
    }

    /**
     * Returns the name of this route.
     *
     * @return string
     */
    public getName(): string {
        return this._name;
    }

    /**
     * Returns the route path.
     *
     * @return string
     */
    public getPath(): string {
        return this._path;
    }

    /**
     * Returns the methods of this route.
     *
     * @return string
     */
    public getMethods(): string[] {
        return this._methods;
    }

    /**
     * Returns the route request handler.
     *
     * @return IRequestHandler
     */
    public getAction(): string | IRequestHandler {
        return this._action;
    }

    /**
     * Returns the uri components of this route.
     *
     * @return array
     */
    public getUriComponents(): IUriComponent[] {
        if (this._uriComponents === null) {
            this._uriComponents = ComponentFactory.createFromRoute(this);
        }
        return this._uriComponents;
    }
}
