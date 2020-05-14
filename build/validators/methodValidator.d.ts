import { IRequest } from "@rheas/contracts";
import { IRouteValidator, IRoute } from "@rheas/contracts/routes";
export declare class MethodValidator implements IRouteValidator {
    /**
     * Validates the requested method with the route.
     *
     * @param route
     * @param request
     */
    matches(route: IRoute, request: IRequest): boolean;
}
