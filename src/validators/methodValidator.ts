import { IRequest } from '@rheas/contracts';
import { IRouteValidator, IRoute } from '@rheas/contracts/routes';

export class MethodValidator implements IRouteValidator {
    /**
     * Validates the requested method with the route.
     *
     * @param route
     * @param request
     */
    public matches(route: IRoute, request: IRequest): boolean {
        return route.getMethods().includes(request.getMethod());
    }
}
