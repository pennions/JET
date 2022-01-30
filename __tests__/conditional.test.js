let processConditional;

describe('Resolve conditionals', () => {

    beforeEach(() => {
        // need to reset modules, else there is some remnants in jest memory, which causes it to fail
        jest.resetModules();
        processConditional = require('../functions/conditional');
    });

    it('should  return a template if truthyCheck is true', () => {
        const template = "{{~ if item is I exist  <p>{{item}}</p> ~}}";

        const templateObject = {
            item: 'I exist'
        };

        expect(processConditional(template, templateObject)).toBe("<p>{{item}}</p>");
    });

    it('should return a template if property exists ', () => {
        const template = "{{~ if item <p>{{item}}</p> ~}}";

        const templateObject = {
            item: 'I exist'
        };

        expect(processConditional(template, templateObject)).toBe("<p>{{item}}</p>");
    });

    it('should not return a template if truthyCheck is false', () => {
        const template = "{{~ if item is true <p>{{item}}</p> ~}}";

        const templateObject = {
            item: false
        };

        expect(processConditional(template, templateObject)).toBe("");
    });

    it('should return the same template if an if statement is not found', () => {
        const template = "<p>{{item}}</p>";

        const templateObject = {
            item: false
        };

        expect(processConditional(template, templateObject)).toBe(template);
    });

    it('returns the nested if when conditional is true', () => {
        const template = "{{~ if item <h1>Some item:</h1>  {{~ if item.label <p>{{item.label}}</p> ~}} ~}}";

        const templateObject = {
            item: {
                label: 'Nested is tested'
            }
        };

        expect(processConditional(template, templateObject)).toBe("<h1>Some item:</h1>  {{~ if item.label <p>{{item.label}}</p>  ~}}");
    });

    it('can resolve a property trail', () => {
        const template = "{{~ if item.label <p>{{item.label}}</p> ~}}";

        const templateObject = {
            item: {
                label: 'Trail is tested'
            }
        };

        expect(processConditional(template, templateObject)).toBe("<p>{{item.label}}</p>");
    });
});