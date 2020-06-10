import { IApp } from "@rheas/contracts/core/app";
import { IRoute } from "@rheas/contracts/routes";
import { AnyObject, KeyValue } from "@rheas/contracts";
import { IUriComponent, IParamComponent } from "@rheas/contracts/routes/uri";
export declare class RouteUrlGenerator {
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
    protected _domain: string;
    /**
     * Caches the domain component.
     *
     * @var array
     */
    protected _domainComponents: IUriComponent[] | null;
    /**
     * Param components of this routes domain.
     *
     * @var object
     */
    protected _domainParams: KeyValue<IParamComponent> | null;
    /**
     * Param components of this routes paths.
     *
     * @var object
     */
    protected _pathParams: KeyValue<IParamComponent> | null;
    /**
     * Creates a new route url generator for the given route
     *
     * @param app
     * @param route
     */
    constructor(app: IApp, route: IRoute);
    /**
     * Creates a url for the route.
     *
     * @param params
     */
    generateUrl(params?: AnyObject, secure?: boolean): string;
    /**
     * Returns the protocol string of the route
     *
     * @param secure
     */
    getProtocolString(secure?: boolean): "http://" | "https://";
    /**
     * Returns the domain part of this route (without the protocol part).
     *
     * @param params
     */
    getDomainString(params?: AnyObject): string;
    /**
     * Returns the route path after replacing any parameters.
     *
     * @param params
     */
    getPathString(params?: AnyObject): string;
    /**
     * Returns the uri/domain component value. If the component is a param
     * component, then the submitted param valu is used or throws an error
     * if no param is provided.
     *
     * @param component
     * @param params
     */
    private getComponentValue;
    /**
     * Returns a query string excluding the domain param and path param
     * names/keys.
     *
     * @param params
     */
    getQueryString(params?: AnyObject): string;
    /**
     * Returns parameter components in the route domain as key-value object
     * where key is the parameter name and value is the param component
     *
     * @returns array
     */
    getDomainParamComponents(): KeyValue<IParamComponent>;
    /**
     * Returns the domain components of this route.
     *
     * @returns array
     */
    getDomainComponents(): IUriComponent[];
    /**
     * Gets the route domain if it exists or reads the domain from the config
     * file. The domain will have no trailing slashes and no protocol section.
     *
     * @returns string
     */
    domain(): string;
    /**
     * Returns parameter components in the route path as key-value object
     * where key is the parameter name and value is the param component
     *
     * @returns array
     */
    getPathParamComponents(): KeyValue<IParamComponent>;
    /**
     * Returns a key-value collection of param components in
     * the submitted components list
     *
     * @param components
     */
    getParamComponents(components: IUriComponent[]): KeyValue<IParamComponent>;
}
