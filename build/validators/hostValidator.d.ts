import { IRequest } from "@rheas/contracts";
import { IRouteValidator, IRoute } from "@rheas/contracts/routes";
export declare class HostValidator implements IRouteValidator {
    /**
     * Matches the route domain with the request domain.
     *
     * @param route
     * @param request
     */
    matches(route: IRoute, request: IRequest): boolean;
}
