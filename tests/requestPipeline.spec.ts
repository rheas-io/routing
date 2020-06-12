import { RequestPipeline } from "../src/requestPipeline";
import { MockRequest, MockResponse } from "@rheas/mockers";
import { IMiddleware, IRequestHandler } from "@rheas/contracts/routes";

const req = new MockRequest("");
const res = new MockResponse(req);

class ExtendedPipeline extends RequestPipeline {
    /**
     * Checks if the given pipe is included in the pipes
     * list.
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
    public assertSendException(finalDestination: IRequestHandler) {
        expect(this.sendTo(finalDestination, req, res)).rejects.toThrowError(
            (this._pipes.includes(middleware2) ? "Middleware" : "Controller") + " exception"
        );
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

/**
 * Normal middleware with no exception
 * 
 * @param req 
 * @param res 
 * @param next 
 * @param params 
 */
const middleware: IMiddleware = async (req, res, next, ...params) => {
    return await next(req, res);
}

/**
 * Exception throwing middleware
 * 
 * @param req 
 * @param res 
 * @param next 
 * @param params 
 */
const middleware2: IMiddleware = async (req, res, next, ...params) => {
    if (req) {
        throw new Error("Middleware exception");
    }
    return await next(req, res);
}

describe("pipeline", () => {

    let pipeline = new ExtendedPipeline();

    // Pipes check
    it("pipesCheck", () => {
        pipeline = pipeline.through([middleware]);
        pipeline.assertPipes(middleware);

        pipeline = pipeline.through([]);
        pipeline.assertPipes();
    });

    // Send data through pipeline without exception
    it("sendTo check", () => {
        const controller: IRequestHandler = async function (req, res) {
            return res;
        }

        // Middleware exception
        pipeline = pipeline.through([middleware]);
        pipeline.assertSend(controller);
    });

    // Send data through pipeline of exceptions
    it("sendTo exception check", () => {
        const controller: IRequestHandler = function (req, res) {
            throw new Error("Controller exception");
        }

        // Middleware exception
        pipeline = pipeline.through([middleware, middleware2]);
        pipeline.assertSendException(controller);

        // controller exception
        pipeline = pipeline.through([middleware]);
        pipeline.assertSendException(controller);
    });
});