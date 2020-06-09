import { Route } from "./route";
import { Str } from "@rheas/support";
import { IApp } from "@rheas/contracts/core/app";
import { IRoute } from "@rheas/contracts/routes";
import { AnyObject, KeyValue } from "@rheas/contracts";
import { ParamComponent } from "./uri/routeParamComponent";
import { ComponentFactory } from "./uri/uriComponentFactory";
import { InvalidArgumentException } from "@rheas/errors/invalidArgument";
import { IUriComponent, IParamComponent } from "@rheas/contracts/routes/uri";

export class RouteUrlGenerator {

    /**
     * The application instance.
     * 
     * @var IApp
     */
    protected _app: IApp;

    /**
     * The route object.
     * 
     * @var IRoute
     */
    protected _route: IRoute;

    /**
     * Cached route domain string
     * 
     * @var string
     */
    protected _domain: string = "";

    /**
     * Caches the domain component.
     * 
     * @var array
     */
    protected _domainComponents: IUriComponent[] | null = null;

    /**
     * Param components of this routes domain.
     * 
     * @var object
     */
    protected _domainParams: KeyValue<IParamComponent> | null = null;

    /**
     * Param components of this routes paths.
     * 
     * @var object
     */
    protected _pathParams: KeyValue<IParamComponent> | null = null;

    /**
     * Creates a new route url generator for the given route
     * 
     * @param app
     * @param route 
     */
    constructor(app: IApp, route: IRoute) {
        this._app = app;
        this._route = route;
    }

    /**
     * Creates a url for the route.
     * 
     * @param params 
     */
    public generateUrl(params: AnyObject = {}): string {

        const secure = this._route.isHttpRoute() ? 'http://' : 'https://';
        const domain = this.getDomainString(params);

        let path = this.getPathString(params);
        path = path.length > 0 ? '/' + path : '';

        const queryString = this.getQueryString(params);

        return secure + domain + path + queryString;
    }

    /**
     * Returns the domain part of this route (without the protocol part).
     * 
     * @param params 
     */
    public getDomainString(params: AnyObject = {}): string {
        return this.getDomainComponents().map(
            (component) => this.getComponentValue(component, params)
        ).join('.');
    }

    /**
     * Returns the route path after replacing any parameters.
     * 
     * @param params 
     */
    public getPathString(params: AnyObject = {}): string {
        return this._route.getUriComponents().map(
            (component) => this.getComponentValue(component, params)
        ).join('/');
    }

    /**
     * Returns the uri/domain component value. If the component is a param
     * component, then the submitted param valu is used or throws an error
     * if no param is provided.
     * 
     * @param component 
     * @param params 
     */
    private getComponentValue(component: IUriComponent, params: AnyObject): string {
        let value = component.getSegment();

        if (component instanceof ParamComponent) {
            // If the component is a parameterComponent, we have to
            // use the submitted parameter value. If the required param
            // is not submitted and is not optional, throw an error stopping
            // the route url generation.
            const paramName = component.getName();

            if (!params.hasOwnProperty(paramName)) {
                throw new InvalidArgumentException(`Parameter ${paramName} is not provided.`);
            }
            value = params[paramName];
        }
        return value;
    }

    /**
     * Returns a query string excluding the domain param and path param
     * names/keys.
     * 
     * @param params 
     */
    public getQueryString(params: AnyObject = {}): string {
        const domainParams = this.getDomainParamComponents();
        const pathParams = this.getPathParamComponents();

        const excludeKeys = [...Object.keys(domainParams), ...Object.keys(pathParams)];

        return Str.queryString(params, excludeKeys);
    }

    /**
     * Returns parameter components in the route domain as key-value object
     * where key is the parameter name and value is the param component
     * 
     * @returns array
     */
    public getDomainParamComponents(): KeyValue<IParamComponent> {

        if (this._domainParams === null) {
            this._domainParams = this.getParamComponents(this.getDomainComponents());
        }
        return this._domainParams;
    }

    /**
     * Returns the domain components of this route.
     * 
     * @returns array
     */
    public getDomainComponents(): IUriComponent[] {
        if (this._domainComponents === null) {
            this._domainComponents = ComponentFactory.createFromDomain(this.domain());
        }
        return this._domainComponents;
    }

    /**
     * Gets the route domain if it exists or reads the domain from the config
     * file. The domain will have no trailing slashes and no protocol section.
     * 
     * @returns string
     */
    public domain(): string {

        if (!this._domain) {
            this._domain = this._route.routeDomain() ||
                // If route domain is empty, read the domain from app 
                // config file.
                Route.clearDomain(this._app.config('app.domain', ''));
        }

        return this._domain;
    }

    /**
     * Returns parameter components in the route path as key-value object
     * where key is the parameter name and value is the param component
     * 
     * @returns array
     */
    public getPathParamComponents(): KeyValue<IParamComponent> {

        if (this._pathParams === null) {
            this._pathParams = this.getParamComponents(this._route.getUriComponents());
        }
        return this._pathParams;
    }

    /**
     * Returns a key-value collection of param components in
     * the submitted components list
     * 
     * @param components 
     */
    public getParamComponents(components: IUriComponent[]): KeyValue<IParamComponent> {
        const paramComponents: KeyValue<IParamComponent> = {};

        components.forEach(uriComponent => {
            if (uriComponent instanceof ParamComponent) {
                paramComponents[uriComponent.getName()] = uriComponent;
            }
        });
        return paramComponents;
    }
}