const templating = require("../functions/templating");
const resolveLoop = require('../functions/loop');
const interpolate = require('../functions/interpolation');
const resolveConditional = require('../functions/conditional');

describe('Test inteprolating after resolving conditionals and/or loops', () => {

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

    it('renders a nested loop correctly', () => {
        const template = "<div>TestDiv</div>{{% for item of list <ul>{{% for object of item  <li>{{object.label}}</li> %}}</ul> %}}";

        const templateObject = {
            list: [[{ label: "Item1" }, { label: "Item2" }, { label: "Item3" }]],
        };
        const resolvedTemplate = resolveLoop(template, templateObject);
        expect(interpolate(resolvedTemplate, templateObject)).toBe("<div>TestDiv</div><ul><li>Item1</li><li>Item2</li><li>Item3</li></ul>");
    });

    it('renders a nested loop correctly if it is multi-line', () => {
        const template = `
<div>TestDiv</div>
{{% for item of list 
    <ul>
    {{% for object of item  
        <li>{{object.label}}</li> 
    %}}
    </ul> 
%}}`;

        const templateObject = {
            list: [[{ label: "Item1" }, { label: "Item2" }, { label: "Item3" }]],
        };
        let resolvedTemplate = resolveLoop(template, templateObject);
        resolvedTemplate = templating.cleanHtml(resolvedTemplate);

        expect(interpolate(resolvedTemplate, templateObject)).toBe("<div>TestDiv</div><ul><li>Item1</li><li>Item2</li><li>Item3</li></ul>");
    });

    it('renders a nested if correctly', () => {
        const template = "{{~ if item <h1>Some item:</h1>{{~ if item.label <p>{{item.label}}</p> ~}} ~}}";

        const templateObject = {
            item: {
                label: 'Nested is tested'
            }
        };

        const resolvedTemplate = resolveConditional(template, templateObject);

        expect(interpolate(resolvedTemplate, templateObject)).toBe("<h1>Some item:</h1> <p>Nested is tested</p>");
    });

    it('renders a nested if correctly when template is multi-line', () => {
        const template = `
{{~ if item 
    <h1>Some item: </h1>
    {{~ if item.label 
        <p>{{item.label}}</p> 
    ~}}
~}}`;

        const templateObject = {
            item: {
                label: 'Nested is tested'
            }
        };

        let resolvedTemplate = resolveConditional(template, templateObject);
        resolvedTemplate = templating.cleanHtml(resolvedTemplate);

        expect(interpolate(resolvedTemplate, templateObject)).toBe("<h1>Some item: </h1><p>Nested is tested</p>");
    });
});