import { Str } from "@laress/support";
import { UriComponent } from "./baseComponent";
import { IUriComponent } from "@laress/contracts/routes/uri";

export class ParamComponent extends UriComponent {

    /**
     * @inheritdoc
     */
    public optional: boolean;

    constructor(component: string) {
        super(component);

        this.optional = component.endsWith('?');
    }

    /**
     * @inheritdoc
     */
    public getName(): string {
        return Str.trimStart(this.component, ":");
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