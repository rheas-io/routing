import { Router } from "../src";
import { MockApp } from "@rheas/mockers";
import { HostValidator } from "../src/validators/hostValidator";
import { UriValidator } from "../src/validators/uriValidator";
import { SchemeValidator } from "../src/validators/schemeValidator";
import { MethodValidator } from "../src/validators/methodValidator";
import { homeRoutes, apiRoutes, faqRoute, pricingRoute } from "./testRoutes";

class ExtendedRouter extends Router {
    /**
     * Asserts all the validators are returning proper types.
     */
    public assertValidators() {
        expect(this.routeValidators()).toEqual(expect.arrayContaining([
            new HostValidator, new SchemeValidator(this.app), new MethodValidator, new UriValidator
        ]));
        // Cache check for branch coverage
        expect(this.routeValidators().length).toBe(4);
    }
}

describe("router", () => {

    const router = new ExtendedRouter(new MockApp(__dirname));
    router.middleware("trimString", "maintenance");
    router.routes(apiRoutes, homeRoutes);
    router.cacheRoutes();

    //Route validators
    it("route_validators", () => { router.assertValidators(); });

    //Route middlewares check. router.routeMiddleware should always
    // return an empty array and middlewaresToResolve should return the
    // global middlewares.
    it("route_middlewares", () => {
        expect(router.routeMiddlewares()).toEqual([]);
        expect(router.middlewaresToResolve()).toEqual(expect.arrayContaining([
            "trimString", "maintenance"
        ]))
    });

    // Named routes check
    it("namedRoutes", () => {
        expect(router.getNamedRoute('faq')).toBe(faqRoute);
        expect(router.getNamedRoute('pricing')).toBe(pricingRoute);

        expect(router.getNamedRoute('api')).toBeNull();
    });
});