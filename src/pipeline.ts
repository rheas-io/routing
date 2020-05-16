import { IRequest } from "@rheas/contracts";
import { IResponse } from "@rheas/contracts/core/response";
import { IRoutePipe, IRoutePipeHandler } from "@rheas/contracts/routes";

export class Pipeline {
    /**
     * 
     * 
     * @var array
     */
    protected pipes: IRoutePipeHandler[] = [];

    /**
     * The sequence of middlewares through which the request has to pass.
     * 
     * @param handlers 
     */
    public through(pipes: IRoutePipeHandler[]) {
        this.pipes = pipes;

        return this;
    }

    /**
     * 
     * @param req 
     * @param res 
     */
    public async sendTo(req: IRequest, res: IResponse, destination: IRoutePipe) {
        const pipeline = //this.pipes.reduceRight(this.pipelineReducer, destination);
            this.pipes.reduceRight(this.pipeReducer, destination);

        return await pipeline(req, res);
    }

    protected pipeReducer(prev: IRoutePipe, current: IRoutePipeHandler) {
        return async (req: IRequest, res: IResponse) => {
            return await current(req, res, prev);
        };
    }

    /**
     * 
     * @param prev 
     * @param current 
     */
    protected pipelineReducer(prev: IRoutePipe, current: IRoutePipeHandler) {

        return async (req: IRequest, res: IResponse) => {
            return await current(req, res, async (req, res) => {
                return await prev(req, res);
            });
        };
    }
}