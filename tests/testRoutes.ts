import { Route } from '../src';
import { KeyValue } from '@rheas/contracts';
import { IRoute } from '@rheas/contracts/routes';

/**
 * Independent route group with prefix blog and name blog.
 */
const blogRoutes = Route.group('blog').routes(
    Route.get('article1/:slug?', 'articleController@get').name('article_1'),
    Route.get('/article2/:slug? ', 'articleController@get').name('article_2'),
    Route.get('/article3/:slug?/', 'articleController@get').name('article_3'),
);

/**
 * A route group with no prefix. Similar to web routes. Deeply
 * nested routes to check various scenarios.
 */
const homeRoutes = Route.group().routes(
    Route.get('/', 'homeController@get').name('home'),
    blogRoutes,
);

/**
 * Independent named routes.
 */
const faqRoute = Route.get('/faq', 'faqController@get').name('faq');
const pricingRoute = Route.get('pricing', 'pricingController@get')
    .middleware('auth')
    .name('pricing');

/**
 * A route group with "api" as prefix. A deeply nested group is
 * used for checking paths and other functions of routes. Add as
 * many route as possible to test all scenarios.
 */
const apiRoutes = Route.group('api')
    .middleware('api', 'throttle:60,1')
    .routes(
        faqRoute,
        pricingRoute,
        Route.get('/contact/', 'contactController@get').name('contact'),
        Route.group('/projects').routes(
            Route.get('rheas', 'rheasController@get').name('project_rheas'),
            Route.get('/kaysy', 'kaysyController@get').name('project_kaysy'),
            Route.get('/kuber/', 'kuberController@get').name('project_kuber'),
        ),
    );

/**
 * A collection of named routes as key-value where name is the key
 * and route is the value.
 */
const namedRoutes = [...homeRoutes.getRoutes(), ...apiRoutes.getRoutes()].reduce<KeyValue<IRoute>>(
    (routes, currentRoute) => {
        const name = currentRoute.getName().trim();

        if (name.length > 0) {
            routes[name] = currentRoute;
        }
        return routes;
    },
    {},
);

export { blogRoutes, homeRoutes, apiRoutes, faqRoute, pricingRoute, namedRoutes };
