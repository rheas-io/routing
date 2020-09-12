import { namedRoutes } from '../testRoutes';

describe('route path check', () => {
    it('path_test', () => {
        expect(namedRoutes['article_2'].getPath()).toBe('article2/:slug?');
        expect(namedRoutes['article_3'].getPath()).toBe('article3/:slug?');
        expect(namedRoutes['faq'].getPath()).toBe('faq');
        expect(namedRoutes['project_rheas'].getPath()).toBe('rheas');

        expect(namedRoutes['home'].routePath()).toBe('');
        expect(namedRoutes['article_1'].routePath()).toBe('blog/article1/:slug?');
        expect(namedRoutes['article_2'].routePath()).toBe('blog/article2/:slug?');
        expect(namedRoutes['article_3'].routePath()).toBe('blog/article3/:slug?');

        expect(namedRoutes['faq'].routePath()).toBe('api/faq');
        expect(namedRoutes['contact'].routePath()).toBe('api/contact');
        expect(namedRoutes['pricing'].routePath()).toBe('api/pricing');

        expect(namedRoutes['project_rheas'].routePath()).toBe('api/projects/rheas');
        expect(namedRoutes['project_kaysy'].routePath()).toBe('api/projects/kaysy');
        expect(namedRoutes['project_kuber'].routePath()).toBe('api/projects/kuber');
    });
});
