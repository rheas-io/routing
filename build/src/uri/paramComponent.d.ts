import { UriComponent } from "./component";
import { IParamComponent, IUriComponent } from "@laress/contracts/routes/uri";
export declare class ParamComponent extends UriComponent implements IParamComponent {
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
     *
     * @param uriComponent
     */
    equals(uriComponent: IUriComponent): boolean;
}
