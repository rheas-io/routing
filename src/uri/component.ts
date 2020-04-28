import { IUriComponent } from "@laress/contracts/routes/uri";

export class UriComponent implements IUriComponent {

    /**
     * @inheritdoc
     */
    public component: string;

    constructor(component: string) {
        this.component = component.trim();
    }

    /**
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