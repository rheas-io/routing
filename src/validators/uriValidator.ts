import { IRequest } from "@laress/contracts";
import { IRouteValidator, IRoute } from "@laress/contracts/routes"

export class UriValidator implements IRouteValidator {

    /**
     * Validates whether the request uri matches the route uri
     * 
     * @param route 
     * @param request 
     */
    public matches(route: IRoute, request: IRequest): boolean {
        const routeComponents = route.getUriComponents();
        const reqComponents = request.getPathComponents();

        for (let i = 0; i < routeComponents.length; i++) {
            if (!routeComponents[i].equals(reqComponents[i])) {
                return false;
            }
        }
        return true;
    }
}