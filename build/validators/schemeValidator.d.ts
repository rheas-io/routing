import { IRequest } from "@rheas/contracts";
import { IApp } from "@rheas/contracts/core/app";
import { IRouteValidator, IRoute } from "@rheas/contracts/routes";
export declare class SchemeValidator implements IRouteValidator {
    /**
     * Development mode flag
     *
     * @var boolean
     */
    protected _devMode: boolean;
    /**
     * Creates a scheme validator. Reads the dev mode status from app
     * configurations.
     *
     * @param app
     */
    constructor(app: IApp);
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
