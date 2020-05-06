import { IUriComponent } from "@laress/contracts/routes/uri";
export declare class UriComponent implements IUriComponent {
    /**
     * @inheritdoc
     */
    component: string;
    /**
     * Stores the segment as it is. No trimming or any other modifications
     * are done here as there may be instances where spaces are put purposefully
     * in request uri's.
     *
     * @param uriSegment
     */
    constructor(uriSegment: string);
    /**
     * Base uri component equality check.
     *
     * Returns true only if the component values matches.
     *
     * @param uriComponent
     */
    equals(uriComponent: IUriComponent): boolean;
}
