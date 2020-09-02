import { IRequest } from '@rheas/contracts';
import { IRouteValidator, IRoute } from '@rheas/contracts/routes';

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

        if (reqComponents.length > routeComponents.length) {
            return false;
        }

        for (let i = 0; i < routeComponents.length; i++) {
            if (!routeComponents[i].equals(reqComponents[i])) {
                return false;
            }
            // Sets the matching route component on the request uri component.
            // This helps in later determining the route params.
            reqComponents[i] && reqComponents[i].setComponent(routeComponents[i]);
        }
        return true;
    }
}
