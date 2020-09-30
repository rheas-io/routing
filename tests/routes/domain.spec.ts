import { Route } from '../../src';

describe('route domain check', () => {
    it('should return a domain without schema and trailing/leading slashes', () => {
        let routeGroup = Route.group().domain('https://kaysy.io/');
        expect(routeGroup.getDomain()).toEqual('kaysy.io');

        routeGroup.domain(':account.kaysy.io/');
        expect(routeGroup.getDomain()).toEqual(':account.kaysy.io');
    });

    it('should inherit group domain when no domain is set on the route', () => {
        const innerRoute = Route.get('/docs', '');
        const routeGroup = Route.group().domain('https://rheas.io/').routes(innerRoute);

        routeGroup.getRoutes();

        expect(innerRoute.getDomain()).toEqual('rheas.io');
    });

    it('should not inherit group domain when a domain is set on the route', () => {
        const innerRoute = Route.get('/docs', '').domain('docs.rheas.io/');
        const routeGroup = Route.group().domain('https://rheas.io/').routes(innerRoute);

        routeGroup.getRoutes();

        expect(innerRoute.getDomain()).toEqual('docs.rheas.io');
    });
});
