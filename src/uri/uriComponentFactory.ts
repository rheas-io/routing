import { Str } from "@laress/support";
import { UriComponent } from "./component";
import { ParamComponent } from "./paramComponent";
import { IUriComponent } from "@laress/contracts/routes/uri";

export class ComponentFactory {
    /**
     * Creates a Uri component from the uri
     * 
     * @param uri 
     */
    public static createFromComponent(component: string): IUriComponent {
        if (component.startsWith(':')) {
            return new ParamComponent(component);
        }
        return new UriComponent(component);
    }

    /**
     * Creates uriComponents from a route uri and returns it.
     * 
     * @param uri 
     */
    public static createFromUri(uri: string): IUriComponent[] {
        const clearUri = Str.trim(Str.replaceWithOne(uri.trim(), '/'), '/');

        return clearUri.split('/').map(
            component => ComponentFactory.createFromComponent(component)
        );
    }
}