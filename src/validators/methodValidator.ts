import { IRequest } from "@laress/contracts";
import { IRouteValidator, IRoute } from "@laress/contracts/routes"

export class MethodValidator implements IRouteValidator {

    /**
     * 
     * @param route 
     * @param request 
     */
    public matches(route: IRoute, request: IRequest): boolean {
        throw new Error("Method not implemented.");
    }
}