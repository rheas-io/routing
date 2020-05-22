import { IRequest } from "@rheas/contracts";
import { IRoute } from "@rheas/contracts/routes";
import { RequestComponent } from "./requestComponent";
import { FixedComponent } from "./routeFixedComponent";
import { ParamComponent } from "./routeParamComponent";
import { IUriComponent, IRequestComponent } from "@rheas/contracts/routes/uri";

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
        const uri = route.routePath();

        return uri.split('/').map(
            component => ComponentFactory.createFromComponent(component)
        );
    }

    /**
     * Creates a uri components list from the request path.
     * 
     * @param request 
     */
    public static createFromRequest(request: IRequest): IRequestComponent[] {
        const uri = request.getPath();

        return uri.split('/').map(component => new RequestComponent(component));
    }
}