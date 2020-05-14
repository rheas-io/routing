import { IRequest } from "@rheas/contracts";
import { IRouteValidator, IRoute } from "@rheas/contracts/routes"

export class HostValidator implements IRouteValidator {

    /**
     * Matches the route domain with the request domain.
     * 
     * @param route 
     * @param request 
     */
    public matches(route: IRoute, request: IRequest): boolean {
        return route.routeDomain() === request.getHost();
    }
}