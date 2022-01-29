let resolveLoop;
let interpolate;

describe('Resolving and interpolating loops', () => {

    beforeEach(() => {
        // need to reset modules, else there is some remnants in jest memory, which causes it to fail
        jest.resetModules();
        resolveLoop = require('../functions/loop');
        const interpolationModule = require('../functions/interpolation');
        interpolate = interpolationModule.interpolate;
    });

    it('correctly renders an array', () => {
        const template = "<ul>{{% for prop of item  <li>{{prop}}</li> %}}</ul>";

        const templateObject = {
            item: ["Item1", "Item2", "Item3"],
        };

        const resolvedTemplate = resolveLoop(template, templateObject);

        expect(interpolate(resolvedTemplate, templateObject)).toBe("<ul><li>Item1</li><li>Item2</li><li>Item3</li></ul>");
    });

    it('correctly renders an array with objects', () => {
        const template = "<ul>{{% for object of item  <li>{{object.label}}</li> %}}</ul>";

        const templateObject = {
            item: [{ label: "Item1" }, { label: "Item2" }, { label: "Item3" }],
        };

        const resolvedTemplate = resolveLoop(template, templateObject);

        expect(interpolate(resolvedTemplate, templateObject)).toBe("<ul><li>Item1</li><li>Item2</li><li>Item3</li></ul>");
    });

    it('renders a multi-loop correctly', () => {
        const template = "<div>TestDiv</div>{{% for item of list <ul>{{% for object of item  <li>{{object.label}}</li> %}}</ul> %}}";

        const templateObject = {
            list: [[{ label: "Item1" }, { label: "Item2" }, { label: "Item3" }]],
        };
        const resolvedTemplate = resolveLoop(template, templateObject);
        expect(interpolate(resolvedTemplate, templateObject)).toBe("<div>TestDiv</div><ul><li>Item1</li><li>Item2</li><li>Item3</li></ul>");
    });
});