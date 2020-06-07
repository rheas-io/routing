import { UriComponent } from "./baseComponent";
import { IUriComponent, IParamComponent } from "@rheas/contracts/routes/uri";
export declare class ParamComponent extends UriComponent implements IParamComponent {
    /**
     * Flag that caches the optional status of this param
     * component.
     *
     * @var boolean
     */
    protected _optional: boolean;
    /**
     * Creates a new parameter component of the route path. The particular
     * segment is passed as argument.
     *
     * @param component
     */
    constructor(component: string);
    /**
     * Returns true if the parameter is optional ie has a ? at
     * the end of the path fragment.
     *
     * @returns boolean
     */
    isOptional(): boolean;
    /**
     * Returns the name of the parameter without any optional
     * symbol (?) or colon (:)
     *
     * @returns param name
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
