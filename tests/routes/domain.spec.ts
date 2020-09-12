import { Route } from '../../src';

describe('route domain check', () => {
    it('domain', () => {
        let route = Route.group().domain('https://kaysy.io/');
        expect(route.routeDomain()).toEqual('kaysy.io');

        route.domain(':account.kaysy.io/');
        expect(route.routeDomain()).toEqual(':account.kaysy.io');

        const innerRoute = Route.get('/docs', '');
        route.domain('https://rheas.io/');
        route.routes(innerRoute);

        expect(innerRoute.routeDomain()).toEqual('rheas.io');

        innerRoute.domain('docs.rheas.io/');
        expect(innerRoute.routeDomain()).toEqual('docs.rheas.io');
    });
});
