import { Route } from '../../src';

describe('route methods check', () => {
    it('methods check', () => {
        let route = Route.all('/api', '');
        expect(route.getMethods()).toEqual(Route.verbs);

        route = Route.get('/', '');
        expect(route.getMethods()).toContain('GET');
        expect(route.getMethods()).toContain('HEAD');
        expect(route.getMethods()).not.toContain('POST');

        route = Route.put('/user', '');
        expect(route.getMethods()).toContain('PUT');
        expect(route.getMethods()).not.toContain('HEAD');

        route = Route.post('/user', '');
        expect(route.getMethods()).toContain('POST');
        expect(route.getMethods()).not.toContain('HEAD');

        route = Route.patch('/user', '');
        expect(route.getMethods()).toContain('PATCH');
        expect(route.getMethods()).not.toContain('HEAD');

        route = Route.options('/user', '');
        expect(route.getMethods()).toContain('OPTIONS');
        expect(route.getMethods()).not.toContain('HEAD');

        route = Route.delete('/user', '');
        expect(route.getMethods()).toContain('DELETE');
        expect(route.getMethods()).not.toContain('HEAD');

        route = new Route().methods('GET');
        expect(route.getMethods()).toContain('HEAD');

        // Throw error when invalid method is used
        expect(() => {
            route = new Route().methods('ANY');
        }).toThrow();
    });
});
