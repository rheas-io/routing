import { Route } from '../src';
import { FixedComponent } from '../src/uri/routeFixedComponent';
import { ComponentFactory } from '../src/uri/uriComponentFactory';

describe('Route uri component tests', () => {
    const uriComponents = ComponentFactory.createFromRoute(
        new Route('/api/list/:id/subscriberså/:id?'),
    );

    /**
     * Test for component matches at specific positions. We use fixed components
     * to check, so that we can confirm that the expected values are present at the
     * exact position.
     */
    it('should match components at specific position', () => {
        expect(uriComponents[0].equals(new FixedComponent('api'))).toBe(true);
        expect(uriComponents[4].equals(new FixedComponent(':id?'))).toBe(true);
    });

    /**
     * Special characters will be encoded by the browser. So we will
     * check a component matches with the encoded string or not.
     */
    it('should match components with special characters', () => {
        expect(uriComponents[3].equals(new FixedComponent('subscriberså'))).toBe(true);
        expect(uriComponents[3].equals(new FixedComponent('subscribers%C3%A5'))).toBe(true);
        expect(uriComponents[3].equals(new FixedComponent('subscribersåƒ'))).toBe(false);
        expect(uriComponents[3].equals(new FixedComponent('subscribers%C3%A5%C6%92'))).toBe(false);
    });

    /**
     * Checks for the invalid component segments like null/undefined etc
     */
    it('should fail for invalid component parts', () => {
        //@ts-ignore
        expect(uriComponents[0].equals(null)).toBe(false);
        //@ts-ignore
        expect(uriComponents[0].equals(undefined)).toBe(false);
        expect(uriComponents[0].equals(new FixedComponent(':api'))).toBe(false);
    });

    /**
     * Checks if an empty value gets equated to a valid string or not.
     */
    it('should fail ` `, ``, and `0` with `api`', () => {
        let toCheck = new FixedComponent(' ');
        expect(new FixedComponent('api').equals(toCheck)).toBe(false);

        toCheck = new FixedComponent('');
        expect(new FixedComponent('api').equals(toCheck)).toBe(false);

        toCheck = new FixedComponent('0');
        expect(new FixedComponent('api').equals(toCheck)).toBe(false);
    });

    /**
     * Checks if `:api` matches with `api` string. We are using fixed 
     * component, so these should not match. Only when the Parameter
     * Component is used, these should match
     */
    it('should fail fixed component `:api` with `api`', () => {
        let toCheck = new FixedComponent(':api');
        expect(new FixedComponent('api').equals(toCheck)).toBe(false);
    });
});
