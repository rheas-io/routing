import { IRequest, IResponse } from '@rheas/contracts';
import { IRequestHandler } from '@rheas/contracts/routes';
import { IMiddleware } from '@rheas/contracts/middlewares';

export class RequestPipeline {
    /**
     * The middleware pipes through which the req and res has to pass
     * through.
     *
     * @var array
     */
    protected _pipes: IMiddleware[] = [];

    /**
     * The sequence of middlewares through which the request has to pass.
     *
     * @param handlers
     */
    public through(pipes: IMiddleware[]) {
        this._pipes = pipes;

        return this;
    }

    /**
     * Sends the req, res objects through the middleware pipes to a destination
     * and await for a response.
     *
     * @param dest
     * @param req
     * @param res
     */
    public async sendTo(dest: IRequestHandler, req: IRequest, res: IResponse): Promise<IResponse> {
        const pipeline = this.resolvePipeline(dest);

        return await pipeline(req, res);
    }

    /**
     * Gets the complete request handler pipeline.
     *
     * @param dest
     */
    protected resolvePipeline(dest: IRequestHandler): IRequestHandler {
        return this._pipes.reduceRight(this.pipelineReducer, dest);
    }

    /**
     * Returns a request handler that executes the current pipe on call.
     *
     * @param next
     * @param current
     */
    protected pipelineReducer(next: IRequestHandler, current: IMiddleware): IRequestHandler {
        return async (req: IRequest, res: IResponse) => {
            return await current(req, res, next);
        };
    }
}
