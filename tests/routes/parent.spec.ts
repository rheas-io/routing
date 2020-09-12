import { blogRoutes, faqRoute, apiRoutes } from '../testRoutes';
import { homeRoutes, pricingRoute, namedRoutes } from '../testRoutes';

describe('parent, child, endpoint', () => {
    /**
     * Has parent check
     */
    it('has_parent_check', () => {
        expect(blogRoutes.hasParent()).toEqual(true);
        expect(faqRoute.hasParent()).toEqual(true);
        expect(namedRoutes['pricing'].hasParent()).toEqual(true);
        expect(apiRoutes.hasParent()).not.toEqual(true);
    });

    /**
     * Parent route check
     */
    it('parent_check', () => {
        expect(namedRoutes['pricing'].getParent()).toEqual(apiRoutes);
        expect(namedRoutes['article_1'].getParent()).toEqual(blogRoutes);
        expect(namedRoutes['article_1'].getParent()).not.toEqual(homeRoutes);
    });

    /**
     * Child route check
     */
    it('child_check', () => {
        expect(namedRoutes['pricing'].getChildRoutes()).toEqual([]);
        expect(apiRoutes.getChildRoutes()).toEqual(expect.arrayContaining([faqRoute]));
    });

    /**
     * Is endpoint check
     */
    it('isEndpoint', () => {
        expect(blogRoutes.isEndpoint()).not.toBe(true);
        expect(apiRoutes.isEndpoint()).not.toBe(true);
        expect(faqRoute.isEndpoint()).toBe(true);
        expect(pricingRoute.isEndpoint()).toBe(true);
    });
});
