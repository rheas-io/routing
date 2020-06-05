import { Str } from "@rheas/support";
import { UriComponent } from "./baseComponent";
import { IUriComponent } from "@rheas/contracts/routes/uri";

export class ParamComponent extends UriComponent {

    /**
     * Flag that caches the optional status of this param 
     * component.
     * 
     * @var boolean
     */
    public optional: boolean;

    /**
     * Creates a new parameter component of the route path. The particular
     * segment is passed as argument.
     * 
     * @param component 
     */
    constructor(component: string) {
        super(component);

        this.optional = component.endsWith('?');
    }

    /**
     * Returns the name of the parameter without any optional
     * symbol (?) or colon (:)
     * 
     * @returns param name
     */
    public getName(): string {
        return Str.trimEnd(Str.trimStart(this.component, ":"), '?');
    }

    /**
     * Returns true if the argument components value is not
     * empty. Emptiness is checked by char length. We won't be 
     * trimming any characters, so even blank spaces are counted
     * as valid.
     * 
     * @param uriComponent 
     */
    public equals(uriComponent: IUriComponent): boolean {

        if (uriComponent === null || uriComponent === void 0) {
            return this.optional;
        }
        // If there is an actual component passed, check the length
        // of the string. Length of the string > 0 indicates, the presence
        // of a value and return true, otherwise return value of optional.
        return uriComponent.component.length > 0 || this.optional;
    }
}