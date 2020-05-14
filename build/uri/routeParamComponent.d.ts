import { UriComponent } from "./baseComponent";
import { IUriComponent } from "@rheas/contracts/routes/uri";
export declare class ParamComponent extends UriComponent {
    /**
     * @inheritdoc
     */
    optional: boolean;
    constructor(component: string);
    /**
     * @inheritdoc
     */
    getName(): string;
    /**
     * Returns true if the argument components value is not
     * empty. Emptiness is checked by char length. We won't be
     * trimming any characters, so even blank spaces are counted
     * as valid.
     *
     * @param uriComponent
     */
    equals(uriComponent: IUriComponent): boolean;
}
