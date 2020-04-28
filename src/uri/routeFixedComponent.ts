import { UriComponent } from "./baseComponent";
import { IUriComponent } from "@laress/contracts/routes/uri";

export class FixedComponent extends UriComponent {

    /**
     * Caches the encoding required or not status of the component.
     * 
     * @var boolean
     */
    private mayBeEncoded: boolean;

    constructor(component: string) {
        super(component);

        this.mayBeEncoded = this.isDecodingNeeded();
    }

    /**
     * Checks if the encoded version of the component and component
     * are matching. If they are not matching, it is possible that
     * the request uri might be encoded by the browser and when 
     * component checking, the request uri component has to be decoded
     * and matched.
     * 
     * @return boolean
     */
    private isDecodingNeeded(): boolean {
        return encodeURIComponent(this.component) !== this.component;
    }

    /**
     * 
     * @param uriComponent 
     */
    public equals(uriComponent: IUriComponent): boolean {
        if (uriComponent === null || uriComponent === void 0) {
            return false;
        }
        return (this.component === uriComponent.component ||
            (this.mayBeEncoded && this.component === decodeURIComponent(uriComponent.component))
        );
    }
}