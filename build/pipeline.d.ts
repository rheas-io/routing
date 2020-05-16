import { IRequest } from "@rheas/contracts";
import { IResponse } from "@rheas/contracts/core/response";
import { IRoutePipe, IRoutePipeHandler } from "@rheas/contracts/routes";
export declare class Pipeline {
    /**
     *
     *
     * @var array
     */
    protected pipes: IRoutePipeHandler[];
    /**
     * The sequence of middlewares through which the request has to pass.
     *
     * @param handlers
     */
    through(pipes: IRoutePipeHandler[]): this;
    /**
     *
     * @param req
     * @param res
     */
    sendTo(req: IRequest, res: IResponse, destination: IRoutePipe): Promise<any>;
    protected pipeReducer(prev: IRoutePipe, current: IRoutePipeHandler): (req: IRequest, res: IResponse) => Promise<IResponse>;
    /**
     *
     * @param prev
     * @param current
     */
    protected pipelineReducer(prev: IRoutePipe, current: IRoutePipeHandler): (req: IRequest, res: IResponse) => Promise<IResponse>;
}
