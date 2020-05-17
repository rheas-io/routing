import { IRequest } from "@rheas/contracts";
import { IResponse } from "@rheas/contracts/core/response";
import { IRoutePipeHandler, IRequestHandler } from "@rheas/contracts/routes";
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
    sendTo(destination: IRequestHandler, req: IRequest, res: IResponse): Promise<IResponse>;
    protected pipeReducer(prev: IRequestHandler, current: IRoutePipeHandler): (req: IRequest, res: IResponse) => Promise<IResponse>;
    /**
     *
     * @param prev
     * @param current
     */
    protected pipelineReducer(prev: IRequestHandler, current: IRoutePipeHandler): (req: IRequest, res: IResponse) => Promise<IResponse>;
}
