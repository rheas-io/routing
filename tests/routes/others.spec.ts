import { FixedComponent } from '../../src/uri/routeFixedComponent';
import { ParamComponent } from '../../src/uri/routeParamComponent';
import { ComponentFactory } from '../../src/uri/uriComponentFactory';
import { apiRoutes, faqRoute, pricingRoute, namedRoutes } from '../testRoutes';

describe('others', () => {
    /**
     * Check if the route is an http route.
     */
    it('isHttp route', () => {
        expect(pricingRoute.isHttpRoute()).toEqual(false);

        pricingRoute.http();
        expect(pricingRoute.isHttpRoute()).toBe(true);

        pricingRoute.http(false);
        expect(pricingRoute.isHttpRoute()).toBe(false);

        expect(faqRoute.isHttpRoute()).toBe(false);
    });

    /**
     * Endpoint routes action check.
     */
    it('getAction', () => {
        expect(apiRoutes.getAction()).toBe('');
        expect(pricingRoute.getAction()).toBe('pricingController@get');
        expect(namedRoutes['article_1'].getAction()).toBe('articleController@get');
    });

    /**
     * Uri componet match tests.
     */
    it('uriComponents', () => {
        expect(namedRoutes['article_1'].getUriComponents()).toStrictEqual([
            new FixedComponent('blog'),
            new FixedComponent('article1'),
            new ParamComponent(':slug?'),
        ]);
        expect(faqRoute.getUriComponents()).toStrictEqual(
            ComponentFactory.createFromRoute(faqRoute),
        );
        expect(faqRoute.getUriComponents()).toStrictEqual([
            new FixedComponent('api'),
            new FixedComponent('faq'),
        ]);
        expect(namedRoutes['project_rheas'].getUriComponents()).toStrictEqual([
            new FixedComponent('api'),
            new FixedComponent('projects'),
            new FixedComponent('rheas'),
        ]);
    });
});
