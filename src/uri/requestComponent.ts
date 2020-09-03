import { UriComponent } from './baseComponent';
import { ParamComponent } from './routeParamComponent';
import { IRequestComponent, IUriComponent } from '@rheas/contracts/routes/uri';

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
     * Returns the route uri parameter name for this segment, if it is a 
     * parameterized segment or null.
     *
     * @return
     */
    public getParamName(): string | null {
        if (this._routeComponent instanceof ParamComponent) {
            return this._routeComponent.getName();
        }
        return null;
    }

    /**
     * @inheritdoc
     *
     * @return object
     */
    public getParam(): string {
        return decodeURIComponent(this.getSegment());
    }
}
