import { IRequest } from "@laress/contracts";
import { IRouteValidator, IRoute } from "@laress/contracts/routes"

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