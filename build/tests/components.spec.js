"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var component_1 = require("../src/uri/component");
var uriComponentFactory_1 = require("../src/uri/uriComponentFactory");
describe("Route uri component tests", function () {
    var uriComponents = uriComponentFactory_1.ComponentFactory.createFromUri('/api/list/:id/subscriber/:id?');
    it("component match test", function () {
        expect(uriComponents[0].equals(new component_1.UriComponent("api"))).toBe(true);
        expect(uriComponents[0].equals(new component_1.UriComponent(":api"))).toBe(false);
        expect(uriComponents[4].equals(new component_1.UriComponent(":id?"))).toBe(true);
    });
    it("invalid input test", function () {
        //@ts-ignore
        expect(new component_1.UriComponent("api").equals(undefined)).toBe(false);
        //@ts-ignore
        expect(new component_1.UriComponent("api").equals("api")).toBe(false);
        //@ts-ignore
        expect(new component_1.UriComponent("api").equals(true)).toBe(false);
        //@ts-ignore
        expect(new component_1.UriComponent("api").equals({ component: "api" })).toBe(true);
        //@ts-ignore
        expect(new component_1.UriComponent("api").equals({ component: "" })).toBe(false);
    });
});
