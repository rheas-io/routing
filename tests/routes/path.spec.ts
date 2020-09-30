import { namedRoutes } from '../testRoutes';

describe('route path check', () => {
    it('should match the route path at root level', () => {
        expect(namedRoutes['home'].getPath()).toBe('');
    });

    it('should match route path 1 layer deep', () => {
        expect(namedRoutes['faq'].getPath()).toBe('api/faq');
        expect(namedRoutes['contact'].getPath()).toBe('api/contact');
        expect(namedRoutes['pricing'].getPath()).toBe('api/pricing');
    });

    it('should match route path 2 layer deep', () => {
        expect(namedRoutes['article_1'].getPath()).toBe('blog/article1/:slug?');
        expect(namedRoutes['article_2'].getPath()).toBe('blog/article2/:slug?');
        expect(namedRoutes['article_3'].getPath()).toBe('blog/article3/:slug?');

        expect(namedRoutes['project_rheas'].getPath()).toBe('api/projects/rheas');
        expect(namedRoutes['project_kaysy'].getPath()).toBe('api/projects/kaysy');
        expect(namedRoutes['project_kuber'].getPath()).toBe('api/projects/kuber');
    });
});
