import { Route } from "../src";
import { KeyValue } from "@rheas/contracts";
import { IRoute } from "@rheas/contracts/routes";
import { FixedComponent } from "../src/uri/routeFixedComponent";
import { ParamComponent } from "../src/uri/routeParamComponent";

/**
 * Independent route group with prefix blog and name blog.
 */
const blogRoutes = Route.group('blog').name('blog').routes(
    Route.get('article1/:slug?', 'articleController@get').name('article_1'),
    Route.get('/article2/:slug? ', 'articleController@get').name('article_2'),
    Route.get('/article3/:slug?/', 'articleController@get').name('article_3'),
);

/**
 * A route group with no prefix. Similar to web routes. Deeply
 * nested routes to check various scenarios.
 */
const homeRoutes = Route.group().routes(
    Route.get('/', 'homeController@get').name('home'), blogRoutes
);

/**
 * Independent amed routes.
 */
const faqRoute = Route.get('/faq', 'faqController@get').name('faq');
const pricingRoute = Route.get('pricing', 'pricingController@get').middleware("auth").name('pricing');

/**
 * A route group with "api" as prefix. A deeply nested group is
 * used for checking paths and other functions of routes. Add as
 * many route as possible to test all scenarios.
 */
const apiRoutes = Route.group('api').middleware(["api", "throttle:60,1"]).routes(
    faqRoute, pricingRoute,
    Route.get('/contact/', 'contactController@get').name('contact'),
    Route.group('/projects').routes(
        Route.get('rheas', 'rheasController@get').name('project_rheas'),
        Route.get('/kaysy', 'kaysyController@get').name('project_kaysy'),
        Route.get('/kuber/', 'kuberController@get').name('project_kuber')
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

    route = Route.post('/user', '');
    expect(route.getMethods()).toContain("POST");
    expect(route.getMethods()).not.toContain("HEAD");

    route = Route.patch('/user', '');
    expect(route.getMethods()).toContain("PATCH");
    expect(route.getMethods()).not.toContain("HEAD");

    route = Route.options('/user', '');
    expect(route.getMethods()).toContain("OPTIONS");
    expect(route.getMethods()).not.toContain("HEAD");

    route = Route.delete('/user', '');
    expect(route.getMethods()).toContain("DELETE");
    expect(route.getMethods()).not.toContain("HEAD");

    route = new Route().methods("GET");
    expect(route.getMethods()).toContain("HEAD");

    // Throw error when invalid method is used
    expect(() => { route = new Route().methods("ANY"); }).toThrow();
});

//Test path string
it("path_test", () => {
    expect(namedRoutes['article_2'].getPath()).toBe("article2/:slug?");
    expect(namedRoutes['article_3'].getPath()).toBe("article3/:slug?");
    expect(namedRoutes['faq'].getPath()).toBe("faq");
    expect(namedRoutes['project_rheas'].getPath()).toBe("rheas");

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

// Route domain
it("domain", () => {
    let route = Route.group().domain("https://kaysy.io/");
    expect(route.routeDomain()).toEqual("kaysy.io");

    route.domain(":account.kaysy.io/");
    expect(route.routeDomain()).toEqual(":account.kaysy.io");

    const innerRoute = Route.get('/docs', '');
    route.domain("https://rheas.io/");
    route.routes(innerRoute);

    expect(innerRoute.routeDomain()).toEqual("rheas.io");

    innerRoute.domain("docs.rheas.io/")
    expect(innerRoute.routeDomain()).toEqual("docs.rheas.io");
});

// hasParent check
it("has_parent_check", () => {
    expect(blogRoutes.hasParent()).toEqual(true);
    expect(faqRoute.hasParent()).toEqual(true);
    expect(namedRoutes['pricing'].hasParent()).toEqual(true);
    expect(apiRoutes.hasParent()).not.toEqual(true);
});

// Parent route check
it("parent_check", () => {
    expect(namedRoutes['pricing'].getParent()).toEqual(apiRoutes);
    expect(namedRoutes['article_1'].getParent()).toEqual(blogRoutes);
    expect(namedRoutes['article_1'].getParent()).not.toEqual(homeRoutes);
});

// endpoint check
it("isEndpoint", () => {
    expect(blogRoutes.isEndpoint()).not.toBe(true);
    expect(apiRoutes.isEndpoint()).not.toBe(true);
    expect(faqRoute.isEndpoint()).toBe(true);
    expect(pricingRoute.isEndpoint()).toBe(true);
});

// Middleware check
it("middlewares_check", () => {
    expect(faqRoute.routeMiddlewares()).toContainEqual("api");
    expect(pricingRoute.routeMiddlewares()).toContainEqual("auth");
    expect(pricingRoute.routeMiddlewares()).toContainEqual("throttle:60,1");
    expect(blogRoutes.routeMiddlewares()).not.toContain("api");

    expect(pricingRoute.middlewaresToResolve()).toEqual(
        expect.arrayContaining(["auth", "api", "throttle:60,1"])
    );
});

//Http route
it("isHttp route", () => {
    expect(pricingRoute.isHttpRoute()).toEqual(false);

    pricingRoute.http();
    expect(pricingRoute.isHttpRoute()).toBe(true);
    expect(faqRoute.isHttpRoute()).toBe(false);
});

//action check
it("getAction", () => {
    expect(apiRoutes.getAction()).toBe("");
    expect(pricingRoute.getAction()).toBe("pricingController@get");
    expect(namedRoutes["article_1"].getAction()).toBe("articleController@get");
});

//withoutMiddleware
it("withoutMiddleware", () => {
    pricingRoute.withoutMiddleware("auth");

    expect(pricingRoute.routeMiddlewares()).not.toContainEqual("auth");
    expect(faqRoute.getExcludedMiddlewares()).toEqual([]);
    expect(pricingRoute.getExcludedMiddlewares()).toEqual(expect.arrayContaining(["auth"]));
});

//uriComponents
it("uriComponents", () => {
    expect(namedRoutes["article_1"].getUriComponents()).toStrictEqual([
        new FixedComponent("blog"), new FixedComponent("article1"), new ParamComponent(":slug?")
    ]);
    expect(faqRoute.getUriComponents()).toStrictEqual([
        new FixedComponent("api"), new FixedComponent("faq")
    ]);
    expect(namedRoutes["project_rheas"].getUriComponents()).toStrictEqual([
        new FixedComponent("api"), new FixedComponent("projects"), new FixedComponent("rheas")
    ]);
});