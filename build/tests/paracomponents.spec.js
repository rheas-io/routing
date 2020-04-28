"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var paramComponent_1 = require("../src/uri/paramComponent");
var uriComponentFactory_1 = require("../src/uri/uriComponentFactory");
describe("Param components test", function () {
    var uriComponents = uriComponentFactory_1.ComponentFactory.createFromUri('/api/list/:id/subscriber/:id?');
    it("component match test", function () {
        //api===api
        expect(new paramComponent_1.ParamComponent("api").equals(uriComponents[0])).toBe(true);
        //:api===list
        expect(new paramComponent_1.ParamComponent(":api").equals(uriComponents[1])).toBe(true);
        //:id?===subscriber
        expect(new paramComponent_1.ParamComponent(":id?").equals(uriComponents[3])).toBe(true);
    });
    it("invalid input test", function () {
        //@ts-ignore ----needs an input
        expect(new paramComponent_1.ParamComponent(":api").equals()).toBe(false);
        //@ts-ignore --optional with no input
        expect(new paramComponent_1.ParamComponent(":api?").equals()).toBe(true);
        //@ts-ignore --- with empty input
        expect(new paramComponent_1.ParamComponent(":api").equals({ component: "" })).toBe(false);
        //@ts-ignore --optional with empty input
        expect(new paramComponent_1.ParamComponent(":api?").equals({ component: "" })).toBe(true);
    });
});
