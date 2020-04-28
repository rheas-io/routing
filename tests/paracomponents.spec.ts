import { ParamComponent } from "../src/uri/paramComponent";
import { ComponentFactory } from "../src/uri/uriComponentFactory";

describe("Param components test", () => {
    const uriComponents = ComponentFactory.createFromUri('/api/list/:id/subscriber/:id?');

    it("component match test", () => {
        //api===api
        expect(new ParamComponent("api").equals(uriComponents[0])).toBe(true);
        //:api===list
        expect(new ParamComponent(":api").equals(uriComponents[1])).toBe(true);
        //:id?===subscriber
        expect(new ParamComponent(":id?").equals(uriComponents[3])).toBe(true);
    });

    it("invalid input test", () => {
        //@ts-ignore ----needs an input
        expect(new ParamComponent(":api").equals()).toBe(false);
        //@ts-ignore --optional with no input
        expect(new ParamComponent(":api?").equals()).toBe(true);
        //@ts-ignore --- with empty input
        expect(new ParamComponent(":api").equals({ component: "" })).toBe(false);
        //@ts-ignore --optional with empty input
        expect(new ParamComponent(":api?").equals({ component: "" })).toBe(true);
    })
});