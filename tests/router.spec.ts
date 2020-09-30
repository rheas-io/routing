import { Router } from '../src';
import { IApp } from '@rheas/contracts/core/app';
import { UriValidator } from '../src/validators/uriValidator';
import { HostValidator } from '../src/validators/hostValidator';
import { apiRoutes, faqRoute, pricingRoute } from './testRoutes';
import { IMiddlewareManager } from '@rheas/contracts/middlewares';
import { SchemeValidator } from '../src/validators/schemeValidator';
import { MethodValidator } from '../src/validators/methodValidator';

class ExtendedRouter extends Router {
    /**
     * Asserts all the validators are returning proper types.
     */
    public assertValidators() {
        expect(this.routeValidators()).toEqual(
            expect.arrayContaining([
                new HostValidator(),
                new SchemeValidator(true),
                new MethodValidator(),
                new UriValidator(),
            ]),
        );
        // Cache check for branch coverage
        expect(this.routeValidators().length).toBe(4);
    }
}

const app: IApp = {
    configs: function () {
        return {
            get: function (key: string) {
                return true;
            },
        };
    },
} as IApp;

describe('router', () => {
    const router = new ExtendedRouter(app, {} as IMiddlewareManager);
    router.registerRoutes(apiRoutes);
    router.cacheRoutes();

    it('should have all the route validators', () => {
        router.assertValidators();
    });

    it('should return the correct routes for the passed names', () => {
        expect(router.getNamedRoute('faq')).toBe(faqRoute);
        expect(router.getNamedRoute('pricing')).toBe(pricingRoute);
    });

    it('should return null if no route is defined for the name `api`', () => {
        expect(router.getNamedRoute('api')).toBeNull();
    });
});
