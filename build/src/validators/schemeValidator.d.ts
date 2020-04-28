import { IRequest } from "@laress/contracts";
import { IRouteValidator, IRoute } from "@laress/contracts/routes";
export declare class SchemeValidator implements IRouteValidator {
    /**
     *
     * @param route
     * @param request
     */
    matches(route: IRoute, request: IRequest): boolean;
}
