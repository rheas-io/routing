import { IUriComponent } from "@laress/contracts/routes/uri";
export declare class UriComponent implements IUriComponent {
    /**
     * @inheritdoc
     */
    component: string;
    constructor(component: string);
    /**
     *
     * @param uriComponent
     */
    equals(uriComponent: IUriComponent): boolean;
}
