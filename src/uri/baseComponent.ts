import { IUriComponent } from "@rheas/contracts/routes/uri";

export class UriComponent implements IUriComponent {

    /**
     * @inheritdoc
     */
    public component: string;

    /**
     * Stores the segment as it is. No trimming or any other modifications
     * are done here as there may be instances where spaces are put purposefully
     * in request uri's.
     * 
     * @param uriSegment 
     */
    constructor(uriSegment: string) {
        this.component = uriSegment;
    }

    /**
     * Base uri component equality check.
     * 
     * Returns true only if the component values matches.
     * 
     * @param uriComponent 
     */
    public equals(uriComponent: IUriComponent): boolean {
        if (uriComponent === null || uriComponent === void 0) {
            return false;
        }
        return this.component === uriComponent.component;
    }

}