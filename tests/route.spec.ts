import { Route } from "../src";
import { KeyValue } from "@rheas/contracts";
import { IRoute } from "@rheas/contracts/routes";

/**
 * A route group with no prefix. Similar to web routes. Deeply
 * nested routes to check various scenarios.
 */
const homeRoutes = Route.group().routes(
    Route.get('/', '').name('home'),
    Route.group('blog').routes(
        Route.group().routes(
            Route.get('article1/:slug?', '').name('article_1'),
            Route.get('/article2/:slug? ', '').name('article_2'),
            Route.get('/article3/:slug?/', '').name('article_3'),
        )
    )
);

/**
 * A route group with "api" as prefix. A deeply nested group is
 * used for checking paths and other functions of routes. Add as
 * many route as possible to test all scenarios.
 */
const apiRoutes = Route.group('api').routes(
    Route.get('/faq', '').name('faq'),
    Route.get('pricing', '').name('pricing'),
    Route.get('/contact/', '').name('contact'),
    Route.group('/projects').routes(
        Route.get('rheas', '').name('project_rheas'),
        Route.get('/kaysy', '').name('project_kaysy'),
        Route.get('/kuber/', '').name('project_kuber')
    )
);

/**
 * A collection of named routes as key-value where name is the key
 * and route is the value.
 */
const namedRoutes: KeyValue<IRoute> = [
    ...homeRoutes.routeEndpoints(),
    ...apiRoutes.routeEndpoints()
].reduce<KeyValue<IRoute>>((routes, currentRoute) => {
    const name = currentRoute.getName().trim();

    if (name.length > 0) {
        routes[name] = currentRoute;
    }
    return routes;
}, {});

describe("route", () => {

    // Route methods check
    it("methods check", () => {
        let route = Route.all("/api", "");
        expect(route.getMethods()).toEqual(Route.verbs);

        route = Route.get('/', '');
        expect(route.getMethods()).toContain("GET");
        expect(route.getMethods()).toContain("HEAD");
        expect(route.getMethods()).not.toContain("POST");

        route = Route.put('/user', '');
        expect(route.getMethods()).toContain("PUT");
        expect(route.getMethods()).not.toContain("HEAD");

        route = new Route().methods("GET");
        expect(route.getMethods()).toContain("HEAD");

        // Throw error when invalid method is used
        expect(() => { route = new Route().methods("ANY"); }).toThrow();
    });

    //Test route path string
    it("path_test", () => {
        expect(namedRoutes['home'].routePath()).toBe("");
        expect(namedRoutes['article_1'].routePath()).toBe("blog/article1/:slug?");
        expect(namedRoutes['article_2'].routePath()).toBe("blog/article2/:slug?");
        expect(namedRoutes['article_3'].routePath()).toBe("blog/article3/:slug?");

        expect(namedRoutes['faq'].routePath()).toBe("api/faq");
        expect(namedRoutes['contact'].routePath()).toBe("api/contact");
        expect(namedRoutes['pricing'].routePath()).toBe("api/pricing");

        expect(namedRoutes['project_rheas'].routePath()).toBe("api/projects/rheas");
        expect(namedRoutes['project_kaysy'].routePath()).toBe("api/projects/kaysy");
        expect(namedRoutes['project_kuber'].routePath()).toBe("api/projects/kuber");
    });
});