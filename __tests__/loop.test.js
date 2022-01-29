let interpolateLoop;

describe('Resolve loops', () => {

    beforeEach(() => {
        // need to reset modules, else there is some remnants in jest memory, which causes it to fail
        jest.resetModules();
        interpolateLoop = require('../functions/loop');
    });

    it('adds values from an array property in the given object in the template', () => {
        const template = "<ul>{{% for prop of item  <li>{{prop}}</li> %}}</ul>";

        const templateObject = {
            item: ["Item1", "Item2", "Item3"],
        };

        expect(interpolateLoop(template, templateObject)).toBe("<ul><li>Item1</li><li>Item2</li><li>Item3</li></ul>");
    });

    it('adds values from an object in an array property in the given object in the template', () => {
        const template = "<ul>{{% for object of item  <li>{{object.label}}</li> %}}</ul>";

        const templateObject = {
            item: [{ label: "Item1" }, { label: "Item2" }, { label: "Item3" }],
        };

        expect(interpolateLoop(template, templateObject)).toBe("<ul><li>Item1</li><li>Item2</li><li>Item3</li></ul>");
    });
});