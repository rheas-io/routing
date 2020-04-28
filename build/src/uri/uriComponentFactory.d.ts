import { IUriComponent } from "@laress/contracts/routes/uri";
export declare class ComponentFactory {
    /**
     * Creates a Uri component from the uri
     *
     * @param uri
     */
    static createFromComponent(component: string): IUriComponent;
    /**
     * Creates uriComponents from a route uri and returns it.
     *
     * @param uri
     */
    static createFromUri(uri: string): IUriComponent[];
}
