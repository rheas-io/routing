import { IRoute } from "./route";

export interface IRouteRegistrar extends IRoute {

    routesList(): IRoute[];
}