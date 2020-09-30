import { blogRoutes, faqRoute, pricingRoute } from '../testRoutes';

describe('route middlewares', () => {
    it('should return the middlewares of the route on calling `getMiddlewares()`', () => {
        expect(faqRoute.getMiddlewares()).toContainEqual('api');
        expect(pricingRoute.getMiddlewares()).toContainEqual('auth');
        expect(pricingRoute.getMiddlewares()).toContainEqual('throttle:60,1');

        expect(blogRoutes.getMiddlewares()).not.toContain('api');
        expect(pricingRoute.getMiddlewares()).toEqual(
            expect.arrayContaining(['auth', 'api', 'throttle:60,1']),
        );
    });

    it('should not contain any middleware in exclusion list', () => {
        pricingRoute.withoutMiddleware();

        expect(Array.from(pricingRoute.excludedMiddlewares().values())).toEqual([]);
        expect(Array.from(faqRoute.excludedMiddlewares().values())).toEqual([]);
    });

    it('should contain `auth` and `api` in the exclusion list after excluding', () => {
        pricingRoute.withoutMiddleware('auth', 'api');

        const excludedList = Array.from(pricingRoute.excludedMiddlewares().values());
        expect(excludedList).toEqual(expect.arrayContaining(['auth', 'api']));
    });
});
