import { UriComponent } from "../src/uri/component";
import { ComponentFactory } from "../src/uri/uriComponentFactory";

describe("Route uri component tests", () => {
    const uriComponents = ComponentFactory.createFromUri('/api/list/:id/subscriber/:id?');

    it("component match test", () => {
        expect(uriComponents[0].equals(new UriComponent("api"))).toBe(true);
        expect(uriComponents[0].equals(new UriComponent(":api"))).toBe(false);
        expect(uriComponents[4].equals(new UriComponent(":id?"))).toBe(true);
    });

    it("invalid input test", () => {
        //@ts-ignore
        expect(new UriComponent("api").equals(undefined)).toBe(false);
        //@ts-ignore
        expect(new UriComponent("api").equals("api")).toBe(false);
        //@ts-ignore
        expect(new UriComponent("api").equals(true)).toBe(false);
        //@ts-ignore
        expect(new UriComponent("api").equals({ component: "api" })).toBe(true);
        //@ts-ignore
        expect(new UriComponent("api").equals({ component: "" })).toBe(false);
    });
});