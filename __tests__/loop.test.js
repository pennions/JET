let resolveLoop;

describe('Resolve loops', () => {

    beforeEach(() => {
        // need to reset modules, else there is some remnants in jest memory, which causes it to fail
        jest.resetModules();
        resolveLoop = require('../functions/loop');
    });

    it('adds a trail to the values from an array property in the given object in the template', () => {
        const template = "<ul>{{% for prop of item  <li>{{prop}}</li> %}}</ul>";

        const templateObject = {
            item: ["Item1", "Item2", "Item3"],
        };
                
        expect(resolveLoop(template, templateObject)).toBe("<ul><li>{{item.0}}</li><li>{{item.1}}</li><li>{{item.2}}</li></ul>");
    });

    it('adds a trail to the values from an object in an array property in the given object in the template', () => {
        const template = "<ul>{{% for object of item  <li>{{object.label}}</li> %}}</ul>";

        const templateObject = {
            item: [{ label: "Item1" }, { label: "Item2" }, { label: "Item3" }],
        };

        expect(resolveLoop(template, templateObject)).toBe("<ul><li>{{item.0.label}}</li><li>{{item.1.label}}</li><li>{{item.2.label}}</li></ul>");
    });
});