import { UriComponent } from "./baseComponent";
import { StringObject } from "@rheas/contracts";
import { IRequestComponent, IUriComponent } from "@rheas/contracts/routes/uri";
export declare class RequestComponent extends UriComponent implements IRequestComponent {
    /**
     * The matching route uri component of this uri component.
     *
     * @var IUriComponent
     */
    private _routeComponent;
    /**
     * @inheritdoc
     *
     * @param status
     */
    setComponent(component: IUriComponent): IRequestComponent;
    /**
     * @inheritdoc
     *
     * @returns boolean
     */
    isParam(): boolean;
    /**
     * @inheritdoc
     *
     * @return object
     */
    getParam(): StringObject;
}
