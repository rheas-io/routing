import { Route } from "../src";
import { ParamComponent } from "../src/uri/routeParamComponent";
import { ComponentFactory } from "../src/uri/uriComponentFactory";

describe("Param components test", () => {
    const routeComponents = ComponentFactory.createFromRoute(new Route('/api/list/:id/subscriber/:id?'));

    it("component match test", () => {
        //api===api
        expect(new ParamComponent("api").equals(routeComponents[0])).toBe(true);
        //:api===list
        expect(new ParamComponent(":api").equals(routeComponents[1])).toBe(true);
        //:id?===subscriber
        expect(new ParamComponent(":id?").equals(routeComponents[3])).toBe(true);
    });

    it("invalid input test", () => {
        //@ts-ignore ----needs an input
        expect(new ParamComponent(":api").equals()).toBe(false);
        //@ts-ignore --optional with no input
        expect(new ParamComponent(":api?").equals()).toBe(true);

        const toCheck = new ParamComponent("");
        //with empty input
        expect(new ParamComponent(":api").equals(toCheck)).toBe(false);
        //optional with empty input
        expect(new ParamComponent(":api?").equals(toCheck)).toBe(true);
    })
});