import { IRoute } from "@rheas/contracts/routes";
import { IUriComponent } from "@rheas/contracts/routes/uri";
export declare class ComponentFactory {
    /**
     * Creates a Uri component from the uri string
     *
     * @param uri
     */
    private static createFromComponent;
    /**
     * Creates uriComponents from a domain string and returns the list.
     *
     * @param domain
     */
    static createFromDomain(domain: string): IUriComponent[];
    /**
     * Creates uriComponents from a route uri and returns it.
     *
     * @param uri
     */
    static createFromRoute(route: IRoute): IUriComponent[];
}
