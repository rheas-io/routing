import { IRequest, IResponse } from "@rheas/contracts";
import { IMiddleware, IRequestHandler } from "@rheas/contracts/routes";

export class RequestPipeline {
    /**
     * The middleware pipes through which the req and res has to pass
     * through.
     * 
     * @var array
     */
    protected pipes: IMiddleware[] = [];

    /**
     * The sequence of middlewares through which the request has to pass.
     * 
     * @param handlers 
     */
    public through(pipes: IMiddleware[]) {
        this.pipes = pipes;

        return this;
    }

    /**
     * Sends the req, res objects through the pipes to a destination and await
     * for a response.
     * 
     * @param dest 
     * @param req 
     * @param res 
     */
    public async sendTo(dest: IRequestHandler, req: IRequest, res: IResponse): Promise<IResponse> {
        const pipeline = this.pipes.reduceRight(this.pipelineReducer, dest);

        return await pipeline(req, res);
    }

    /**
     * Returns a request handler that executes the current pipe on call.
     * 
     * @param prev 
     * @param current 
     */
    protected pipelineReducer(next: IRequestHandler, current: IMiddleware): IRequestHandler {
        return async (req: IRequest, res: IResponse) => {
            return await current(req, res, next);
        };
    }
}