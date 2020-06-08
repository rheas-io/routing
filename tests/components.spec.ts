import { Route } from "../src";
import { FixedComponent } from "../src/uri/routeFixedComponent";
import { ComponentFactory } from "../src/uri/uriComponentFactory";

describe("Route uri component tests", () => {
    const uriComponents = ComponentFactory.createFromRoute(new Route('/api/list/:id/subscriberså/:id?'));

    it("component match test", () => {
        expect(uriComponents[0].equals(new FixedComponent("api"))).toBe(true);
        expect(uriComponents[4].equals(new FixedComponent(":id?"))).toBe(true);
    });

    it("encoded match test", () => {        
        expect(uriComponents[3].equals(new FixedComponent("subscriberså"))).toBe(true);
        expect(uriComponents[3].equals(new FixedComponent('subscribers%C3%A5'))).toBe(true);
        expect(uriComponents[3].equals(new FixedComponent('subscribersåƒ'))).toBe(false);
        expect(uriComponents[3].equals(new FixedComponent('subscribers%C3%A5%C6%92'))).toBe(false);
    });

    it("invalid input test", () => {
        //@ts-ignore
        expect(uriComponents[0].equals(null)).toBe(false);
        //@ts-ignore
        expect(uriComponents[0].equals(undefined)).toBe(false);
        expect(uriComponents[0].equals(new FixedComponent(":api"))).toBe(false);

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