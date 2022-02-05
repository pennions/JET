import { compile } from "../src/jet";
import { cleanHtml } from "../src/functions/templating";

describe('Test inteprolating after resolving conditionals and/or loops', () => {

    it('correctly renders an array', () => {
        const template = "<ul>{{% for prop of item  <li>{{prop}}</li> %}}</ul>";

        const templateObject = {
            item: ["Item1", "Item2", "Item3"],
        };

        expect(cleanHtml(compile(template, templateObject))).toBe("<ul><li>Item1</li><li>Item2</li><li>Item3</li></ul>");
    });

    it('correctly renders an array with objects', () => {
        const template = "<ul>{{% for object of item  <li>{{object.label}}</li> %}}</ul>";

        const templateObject = {
            item: [{ label: "Item1" }, { label: "Item2" }, { label: "Item3" }],
        };

        expect(cleanHtml(compile(template, templateObject))).toBe("<ul><li>Item1</li><li>Item2</li><li>Item3</li></ul>");
    });

    it('renders a nested loop correctly', () => {
        const template = "<div>TestDiv</div>{{% for item of list <ul>{{% for object of item  <li>{{object.label}}</li> %}}</ul> %}}";

        const templateObject = {
            list: [[{ label: "Item1" }, { label: "Item2" }, { label: "Item3" }]],
        };

        expect(cleanHtml(compile(template, templateObject))).toBe("<div>TestDiv</div><ul><li>Item1</li><li>Item2</li><li>Item3</li></ul>");
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

        expect(cleanHtml(compile(template, templateObject))).toBe("<div>TestDiv</div><ul><li>Item1</li><li>Item2</li><li>Item3</li></ul>");
    });

    it('renders a nested if correctly', () => {
        const template = "{{~ if item <h1>Some item:</h1>{{~ if item.label <p>{{item.label}}</p> ~}} ~}}";

        const templateObject = {
            item: {
                label: 'Nested is tested'
            }
        };

        expect(cleanHtml(compile(template, templateObject))).toBe("<h1>Some item:</h1><p>Nested is tested</p>");
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

        expect(cleanHtml(compile(template, templateObject))).toBe("<h1>Some item: </h1><p>Nested is tested</p>");
    });

    it('renders a loop from a nested property', () => {
        const template = "<ul>{{% for item of object.list <li>{{ item.label }}</li> %}}</ul>";

        const templateObject = {
            object: {
                list: [{ label: "Item1" }, { label: "Item2" }, { label: "Item3" }],
            }
        };
        expect(cleanHtml(compile(template, templateObject))).toBe("<ul><li>Item1</li><li>Item2</li><li>Item3</li></ul>");
    });
});
