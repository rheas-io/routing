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
        let toCheck = new FixedComponent(" ");
        expect(new FixedComponent("api").equals(toCheck)).toBe(false);

        toCheck = new FixedComponent("0");
        expect(new FixedComponent("api").equals(toCheck)).toBe(false);

        toCheck = new FixedComponent(":api");
        expect(new FixedComponent("api").equals(toCheck)).toBe(false);

        toCheck = new FixedComponent("");
        expect(new FixedComponent("api").equals(toCheck)).toBe(false);
    });
});