import { IRequest } from "@rheas/contracts";
import { IRouteValidator, IRoute } from "@rheas/contracts/routes";
export declare class UriValidator implements IRouteValidator {
    /**
     * Validates whether the request uri matches the route uri
     *
     * @param route
     * @param request
     */
    matches(route: IRoute, request: IRequest): boolean;
}
