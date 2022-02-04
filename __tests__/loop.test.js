import { resolveLoop } from "../src/functions/loop";

describe('Resolve loops', () => {

    it('adds a trail to the values from an array property in the given object in the template', () => {
        const template = "<ul>{{% for prop of item  <li>{{prop}}</li> %}}</ul>";

        const templateObject = {
            item: ["Item1", "Item2", "Item3"],
        };

        expect(resolveLoop(template, templateObject)).toBe("<ul><li>{{item.0}}</li><li>{{item.1}}</li><li>{{item.2}}</li></ul>");
    });

    it('also works with for ... in ...', () => {
        const template = "<ul>{{% for prop in array  <li>{{prop}}</li> %}}</ul>";

        const templateObject = {
            array: ["Item1", "Item2", "Item3"],
        };

        expect(resolveLoop(template, templateObject)).toBe("<ul><li>{{array.0}}</li><li>{{array.1}}</li><li>{{array.2}}</li></ul>");
    });

    it('adds a trail to the values from an object in an array property in the given object in the template', () => {
        const template = "<ul>{{% for object of item  <li>{{object.label}}</li> %}}</ul>";

        const templateObject = {
            item: [{ label: "Item1" }, { label: "Item2" }, { label: "Item3" }],
        };

        expect(resolveLoop(template, templateObject)).toBe("<ul><li>{{item.0.label}}</li><li>{{item.1.label}}</li><li>{{item.2.label}}</li></ul>");
    });

    it('resolves nested loop', () => {
        const template = "<div>TestDiv</div>{{% for item of list <ul>{{% for object of item  <li>{{object.label}}</li> %}}</ul> %}}";

        const templateObject = {
            list: [[{ label: "Item1" }, { label: "Item2" }, { label: "Item3" }]],
        };

        expect(resolveLoop(template, templateObject)).toBe("<div>TestDiv</div><ul><li>{{list.0.0.label}}</li><li>{{list.0.1.label}}</li><li>{{list.0.2.label}}</li></ul>");
    });

    it('resolves a loop from a nested property', () => {
        const template = "<ul>{{% for item of object.list <li>{{ item.label }}</li> %}}</ul>";

        const templateObject = {
            object: {
                list: [{ label: "Item1" }, { label: "Item2" }, { label: "Item3" }],
            }
        };

        expect(resolveLoop(template, templateObject)).toBe("<ul><li>{{ object.list.0.label }}</li><li>{{ object.list.1.label }}</li><li>{{ object.list.2.label }}</li></ul>");
    });
});
