import { IRequest } from "@rheas/contracts";
import { IRouteValidator, IRoute } from "@rheas/contracts/routes"

export class SchemeValidator implements IRouteValidator {

    /**
     * Checks if the request came through a secure channel if the
     * route accepts secure channel requests only. In all other cases,
     * return true.
     * 
     * @param route 
     * @param request 
     */
    public matches(route: IRoute, request: IRequest): boolean {
        if (route.routeSecure()) {
            return request.isSecure();
        }
        return true;
    }
}