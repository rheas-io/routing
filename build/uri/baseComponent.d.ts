import { IUriComponent } from "@rheas/contracts/routes/uri";
export declare class UriComponent implements IUriComponent {
    /**
     * Single route uri segment obtained when the route is split by forward slash (/)
     *
     * @var string
     */
    protected _component: string;
    /**
     * Stores the segment as it is. No trimming or any other modifications
     * are done here as there may be instances where spaces are put purposefully
     * in request uri's.
     *
     * @param uriSegment
     */
    constructor(uriSegment: string);
    /**
     * Returns the whole path segment.
     *
     * @returns string
     */
    getSegment(): string;
    /**
     * Base uri component equality check.
     *
     * Returns true only if the component values matches.
     *
     * @param uriComponent
     */
    equals(uriComponent: IUriComponent): boolean;
}
