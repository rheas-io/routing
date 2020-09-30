import { RequestPipeline } from '../src/requestPipeline';
import { IRequestHandler } from '@rheas/contracts/routes';
import { IMiddleware } from '@rheas/contracts/middlewares';
import { IRequest, IResponse } from '@rheas/contracts/core';

const req = {} as IRequest;
const res = {} as IResponse;

class ExtendedPipeline extends RequestPipeline {
    /**
     * Checks if the given pipe is included in the pipes list.
     *
     * @param pipe
     */
    public assertPipes(...pipe: IMiddleware[]) {
        expect(Array.isArray(this._pipes)).toBe(true);
        expect(this._pipes).toEqual(expect.arrayContaining(pipe));
    }

    /**
     * Performs exception tests when data flows through pipeline.
     *
     * @param finalDestination
     */
    public assertSendException(finalDestination: IRequestHandler, exceptionMessage: string) {
        expect(this.sendTo(finalDestination, req, res)).rejects.toThrowError(exceptionMessage);
    }

    /**
     * Performs tests when data flows through pipeline.
     *
     * @param finalDestination
     */
    public assertSend(finalDestination: IRequestHandler) {
        expect(this.sendTo(finalDestination, req, res)).resolves.toBe(res);
    }
}

describe('pipeline request flow check', () => {
    const pipeline = new ExtendedPipeline();
    const middleware: IMiddleware = async (req, res, next) => await next(req, res);

    /**
     * Check middlewares are registered properly on the request
     * pipeline.
     */
    it('should match the values in the pipe', () => {
        pipeline.through([middleware]).assertPipes(middleware);
        pipeline.through([]).assertPipes();
    });

    /**
     * Send a request through a middleware pipe that does not throw
     * an exception. Destination should return the
     */
    it('should pass a request through a middleware without exception', () => {
        pipeline.through([middleware]).assertSend(async (req, res) => res);
    });

    /**
     * Check if pipeline throws exception when middleware throws an
     * exception.
     */
    it('should throw exception when middleware throws exception', () => {
        const middleware2: IMiddleware = async (req, res, next) => {
            throw new Error('Middleware exception');
        };
        pipeline
            .through([middleware, middleware2])
            .assertSendException(async (req, res) => res, 'Middleware exception');
    });

    /**
     * Check if pipeline throws exception when the request controller throws an
     * exception.
     */
    it('should throw exception when controller throws exception', () => {
        pipeline.through([middleware]).assertSendException(async (req, res) => {
            throw new Error('Controller exception');
        }, 'Controller exception');
    });
});
