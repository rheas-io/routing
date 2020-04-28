import { Route } from "../src";
import { FixedComponent } from "../src/uri/routeFixedComponent";
import { ComponentFactory } from "../src/uri/uriComponentFactory";

describe("Route uri component tests", () => {
    const uriComponents = ComponentFactory.createFromRoute(new Route('/api/list/:id/subscriber/:id?'));

    it("component match test", () => {
        expect(uriComponents[0].equals(new FixedComponent("api"))).toBe(true);
        expect(uriComponents[0].equals(new FixedComponent(":api"))).toBe(false);
        expect(uriComponents[4].equals(new FixedComponent(":id?"))).toBe(true);
    });

    it("invalid input test", () => {
        //@ts-ignore
        expect(new FixedComponent("api").equals(undefined)).toBe(false);
        //@ts-ignore
        expect(new FixedComponent("api").equals("api")).toBe(false);
        //@ts-ignore
        expect(new FixedComponent("api").equals(true)).toBe(false);
        //@ts-ignore
        expect(new FixedComponent("api").equals({ component: "api" })).toBe(true);
        //@ts-ignore
        expect(new FixedComponent("api").equals({ component: "" })).toBe(false);
    });
});