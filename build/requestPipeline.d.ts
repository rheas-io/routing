import { IRequest } from "@rheas/contracts";
import { IResponse } from "@rheas/contracts/core/response";
import { IMiddleware, IRequestHandler } from "@rheas/contracts/routes";
export declare class RequestPipeline {
    /**
     * The middleware pipes through which the req and res has to pass
     * through.
     *
     * @var array
     */
    protected pipes: IMiddleware[];
    /**
     * The sequence of middlewares through which the request has to pass.
     *
     * @param handlers
     */
    through(pipes: IMiddleware[]): this;
    /**
     * Sends the req, res objects through the pipes to a destination and await
     * for a response.
     *
     * @param dest
     * @param req
     * @param res
     */
    sendTo(dest: IRequestHandler, req: IRequest, res: IResponse): Promise<IResponse>;
    /**
     * Returns a request handler that executes the current pipe on call.
     *
     * @param prev
     * @param current
     */
    protected pipelineReducer(next: IRequestHandler, current: IMiddleware): IRequestHandler;
}