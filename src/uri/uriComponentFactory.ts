import { UriComponent } from "./baseComponent";
import { IRoute } from "@laress/contracts/routes";
import { IRequest } from "../../../contracts/build";
import { FixedComponent } from "./routeFixedComponent";
import { ParamComponent } from "./routeParamComponent";
import { IUriComponent } from "@laress/contracts/routes/uri";

export class ComponentFactory {

    /**
     * Creates a Uri component from the uri string
     * 
     * @param uri 
     */
    private static createFromComponent(component: string): IUriComponent {
        if (component.startsWith(':')) {
            return new ParamComponent(component);
        }
        return new FixedComponent(component);
    }

    /**
     * Creates uriComponents from a route uri and returns it.
     * 
     * @param uri 
     */
    public static createFromRoute(route: IRoute): IUriComponent[] {
        const uri = route.getPath();

        return uri.split('/').map(
            component => ComponentFactory.createFromComponent(component)
        );
    }

    /**
     * Creates a uri components list from the request path.
     * 
     * @param request 
     */
    public static createFromRequest(request: IRequest): IUriComponent[] {
        const uri = request.getPath();

        return uri.split('/').map(component => new UriComponent(component));
    }
}