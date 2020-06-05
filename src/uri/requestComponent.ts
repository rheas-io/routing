import { UriComponent } from "./baseComponent";
import { StringObject } from "@rheas/contracts";
import { ParamComponent } from "./routeParamComponent";
import { IRequestComponent, IUriComponent } from "@rheas/contracts/routes/uri";

export class RequestComponent extends UriComponent implements IRequestComponent {

    /**
     * The matching route uri component of this uri component.
     * 
     * @var IUriComponent
     */
    private _routeComponent: IUriComponent | undefined;

    /**
     * @inheritdoc
     * 
     * @param status 
     */
    public setComponent(component: IUriComponent): IRequestComponent {
        this._routeComponent = component;

        return this;
    }

    /**
     * @inheritdoc
     * 
     * @returns boolean
     */
    public isParam(): boolean {
        return this._routeComponent instanceof ParamComponent;
    }

    /**
     * @inheritdoc
     * 
     * @return object
     */
    public getParam(): StringObject {
        const param: StringObject = {};

        if (this._routeComponent instanceof ParamComponent) {
            param[this._routeComponent.getName()] = decodeURIComponent(this.getSegment());
        }
        return param;
    }
}