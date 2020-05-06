import { IRequest } from "@laress/contracts";
import { IRouteValidator, IRoute } from "@laress/contracts/routes";
export declare class SchemeValidator implements IRouteValidator {
    /**
     * Checks if the request came through a secure channel if the
     * route accepts secure channel requests only. In all other cases,
     * return true.
     *
     * @param route
     * @param request
     */
    matches(route: IRoute, request: IRequest): boolean;
}
