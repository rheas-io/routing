import { FixedComponent } from '../../src/uri/routeFixedComponent';
import { ParamComponent } from '../../src/uri/routeParamComponent';
import { faqRoute, pricingRoute, namedRoutes } from '../testRoutes';
import { ComponentFactory } from '../../src/uri/uriComponentFactory';

describe('others', () => {
    it('should be false by default - the http flag of `pricingRoute` and `faqRoute`', () => {
        expect(pricingRoute.isHttpRoute()).toEqual(false);
        expect(faqRoute.isHttpRoute()).toBe(false);
    });

    it('should be an http route after setting', () => {
        pricingRoute.http();
        expect(pricingRoute.isHttpRoute()).toBe(true);
    });

    it('should not be an http route after reset', () => {
        pricingRoute.http(false);
        expect(pricingRoute.isHttpRoute()).toBe(false);
    });

    it('should return the correct controller action on `getAction()`', () => {
        expect(pricingRoute.getAction()).toBe('pricingController@get');
        expect(namedRoutes['article_1'].getAction()).toBe('articleController@get');
    });

    it('should match the uri components of the test route `article_1`', () => {
        let components = [
            new FixedComponent('blog'),
            new FixedComponent('article1'),
            new ParamComponent(':slug?'),
        ];
        expect(namedRoutes['article_1'].getUriComponents()).toStrictEqual(components);
    });

    it('should match the uri components of the test route named `project_rheas`', () => {
        let components = [
            new FixedComponent('api'),
            new FixedComponent('projects'),
            new FixedComponent('rheas'),
        ];
        expect(namedRoutes['project_rheas'].getUriComponents()).toStrictEqual(components);
    });

    it('should match the uri components of the test route named `faqRoute`', () => {
        let components = [new FixedComponent('api'), new FixedComponent('faq')];

        expect(faqRoute.getUriComponents()).toStrictEqual(components);
    });

    it('should match `route.getUriComponents` and components from factory', () => {
        expect(faqRoute.getUriComponents()).toStrictEqual(
            ComponentFactory.createFromRoute(faqRoute),
        );
    });
});
