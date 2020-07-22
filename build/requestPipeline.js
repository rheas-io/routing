"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestPipeline = void 0;
class RequestPipeline {
    constructor() {
        /**
         * The middleware pipes through which the req and res has to pass
         * through.
         *
         * @var array
         */
        this._pipes = [];
    }
    /**
     * The sequence of middlewares through which the request has to pass.
     *
     * @param handlers
     */
    through(pipes) {
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
    async sendTo(dest, req, res) {
        const pipeline = this.resolvePipeline(dest);
        return await pipeline(req, res);
    }
    /**
     * Gets the complete request handler pipeline.
     *
     * @param dest
     */
    resolvePipeline(dest) {
        return this._pipes.reduceRight(this.pipelineReducer, dest);
    }
    /**
     * Returns a request handler that executes the current pipe on call.
     *
     * @param prev
     * @param current
     */
    pipelineReducer(next, current) {
        return async (req, res) => {
            return await current(req, res, next);
        };
    }
}
exports.RequestPipeline = RequestPipeline;
