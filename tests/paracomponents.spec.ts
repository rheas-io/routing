import { Route } from '../src';
import { ParamComponent } from '../src/uri/routeParamComponent';
import { ComponentFactory } from '../src/uri/uriComponentFactory';

describe('Parameter components test', () => {
    const routeComponents = ComponentFactory.createFromRoute(
        new Route('/api/list/:id/subscriber/:id?'),
    );

    it('should match `api` equals `api`', () => {
        expect(new ParamComponent('api').equals(routeComponents[0])).toBe(true);
    });

    it('should match `:api` equals `list` and `:id?` equals `subscriber`', () => {
        expect(new ParamComponent(':api').equals(routeComponents[1])).toBe(true);
        expect(new ParamComponent(':id?').equals(routeComponents[3])).toBe(true);
    });

    it('should match optional `:api?` with no/empty input', () => {
        //@ts-ignore --optional with no input
        expect(new ParamComponent(':api?').equals()).toBe(true);

        //optional with empty input
        expect(new ParamComponent(':api?').equals(new ParamComponent(''))).toBe(true);
    });

    it('should fail with empty components if not an optional param', () => {
        //@ts-ignore ----with no input
        expect(new ParamComponent(':api').equals()).toBe(false);

        //with empty input
        expect(new ParamComponent(':api').equals(new ParamComponent(''))).toBe(false);
    });

    it('should return the correct name of param component', () => {
        expect(new ParamComponent(':api').getName()).toBe('api');
        expect(new ParamComponent(':id?').getName()).toBe('id');
        expect(new ParamComponent(':lång?').getName()).toBe('lång');
    });
});
