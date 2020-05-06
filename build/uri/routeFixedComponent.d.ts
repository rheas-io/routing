import { UriComponent } from "./baseComponent";
import { IUriComponent } from "@laress/contracts/routes/uri";
export declare class FixedComponent extends UriComponent {
    /**
     * Caches the encoding required or not status of the component.
     *
     * @var boolean
     */
    private mayBeEncoded;
    constructor(component: string);
    /**
     * Checks if the encoded version of the component and component
     * are matching. If they are not matching, it is possible that
     * the request uri might be encoded by the browser and when
     * component checking, the request uri component has to be decoded
     * and matched.
     *
     * @return boolean
     */
    private isDecodingNeeded;
    /**
     * Returns true if the component values are matching. If it is not
     * matching, we check for the need of decoding. If decoding is required,
     * we decode the argument submitted and compare it with this value
     *
     * @param uriComponent
     */
    equals(uriComponent: IUriComponent): boolean;
}
