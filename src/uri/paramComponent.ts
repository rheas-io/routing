import { Str } from "@laress/support";
import { UriComponent } from "./component";
import { IParamComponent, IUriComponent } from "@laress/contracts/routes/uri";

export class ParamComponent extends UriComponent implements IParamComponent {

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