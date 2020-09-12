import { blogRoutes, faqRoute, pricingRoute } from '../testRoutes';

describe('route middleware check', () => {
    // Middleware check
    it('middlewares_check', () => {
        expect(faqRoute.routeMiddlewares()).toContainEqual('api');
        expect(pricingRoute.routeMiddlewares()).toContainEqual('auth');
        expect(pricingRoute.routeMiddlewares()).toContainEqual('throttle:60,1');
        expect(blogRoutes.routeMiddlewares()).not.toContain('api');

        expect(pricingRoute.middlewaresToResolve()).toEqual(
            expect.arrayContaining(['auth', 'api', 'throttle:60,1']),
        );
    });

    //withoutMiddleware
    //TODO
    it('withoutMiddleware', () => {
        pricingRoute.withoutMiddleware('auth');
        expect(pricingRoute.routeMiddlewares()).not.toContainEqual('auth');

        pricingRoute.withoutMiddleware('auth', 'api');
        expect(pricingRoute.routeMiddlewares()).not.toContainEqual('api');
        expect(pricingRoute.getExcludedMiddlewares()).toEqual(
            expect.arrayContaining(['auth', 'api']),
        );

        pricingRoute.withoutMiddleware();
        expect(pricingRoute.getExcludedMiddlewares()).toEqual([]);
        expect(faqRoute.getExcludedMiddlewares()).toEqual([]);
    });
});
