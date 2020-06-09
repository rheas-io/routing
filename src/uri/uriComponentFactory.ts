import { IRoute } from "@rheas/contracts/routes";
import { FixedComponent } from "./routeFixedComponent";
import { ParamComponent } from "./routeParamComponent";
import { IUriComponent } from "@rheas/contracts/routes/uri";

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
     * Creates uriComponents from a domain string and returns the list.
     * 
     * @param domain
     */
    public static createFromDomain(domain: string): IUriComponent[] {

        return domain.split('.').map(
            component => ComponentFactory.createFromComponent(component)
        );
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
}