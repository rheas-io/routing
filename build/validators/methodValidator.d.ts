import { IRequest } from "@laress/contracts";
import { IRouteValidator, IRoute } from "@laress/contracts/routes";
export declare class MethodValidator implements IRouteValidator {
    /**
     * Validates the requested method with the route.
     *
     * @param route
     * @param request
     */
    matches(route: IRoute, request: IRequest): boolean;
}
