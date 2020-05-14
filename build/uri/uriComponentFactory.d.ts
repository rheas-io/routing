import { IRequest } from "@rheas/contracts";
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
     * Creates uriComponents from a route uri and returns it.
     *
     * @param uri
     */
    static createFromRoute(route: IRoute): IUriComponent[];
    /**
     * Creates a uri components list from the request path.
     *
     * @param request
     */
    static createFromRequest(request: IRequest): IUriComponent[];
}
