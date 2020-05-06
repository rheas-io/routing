import { IRequest } from "@laress/contracts";
import { IRouteValidator, IRoute } from "@laress/contracts/routes";
export declare class UriValidator implements IRouteValidator {
    /**
     * Validates whether the request uri matches the route uri
     *
     * @param route
     * @param request
     */
    matches(route: IRoute, request: IRequest): boolean;
}
