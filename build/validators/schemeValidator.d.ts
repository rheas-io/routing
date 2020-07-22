import { IRequest } from "@rheas/contracts";
import { IRouteValidator, IRoute } from "@rheas/contracts/routes";
export declare class SchemeValidator implements IRouteValidator {
    /**
     * Production mode flag
     *
     * @var boolean
     */
    protected _production: boolean;
    /**
     * Creates a scheme validator. Reads the production mode flag from app
     * configurations. If the app is not in production mode, ie in debug
     * mode, schema check is ignored.
     *
     */
    constructor();
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
