import { resolveTemplateWrapper } from '../src/functions/viewmodelWrapper';

describe('Viewmodel wrapper', () => {
    test('Template is correctly resolved', () => {
        const template = `{{$ from lists.todos
<div>
    <h1>{{ title }}</h1>
    <p>{{ body }}</p>
</div>
$}}`;

        const resultTemplate = `<div>
    <h1>{{ lists.todos.title }}</h1>
    <p>{{ lists.todos.body }}</p>
</div>`;

        const result = resolveTemplateWrapper(template);

        expect(result).toEqual(resultTemplate);
    });

    test('Template is correctly resolved when nested with a loop', () => {
        const template = `{{$ from lists.todos
<div>
    <h1>{{ title }}</h1>
    <p>{{ body }}</p>
</div>
{{% for item in items 
    <span>{{ item }}</span>
%}}
$}}`;

        const resultTemplate = `<div>
    <h1>{{ lists.todos.title }}</h1>
    <p>{{ lists.todos.body }}</p>
</div>
{{% for item in lists.todos.items 
    <span>{{ item }}</span>
%}}`;

        const result = resolveTemplateWrapper(template);

        expect(result).toEqual(resultTemplate);
    });

    test('Template is correctly resolved with a conditional', () => {
        const template = `{{$ from lists.todos
{{~ if a
    {{ a }}
~}}
$}}`;

        const resultTemplate = `{{~ if lists.todos.a
    {{ lists.todos.a }}
~}}`;

        const result = resolveTemplateWrapper(template);

        expect(result).toEqual(resultTemplate);
    });

    test('Template is correctly resolved when nested with two loops', () => {
        const template = `{{$ from lists.todos
<div>
    <h1>{{ title }}</h1>
    <p>{{ body }}</p>
</div>
{{% for item in items 
    <span>{{ item }}</span>
%}}
{{% for property in properties 
    <span>{{ property }}</span>
%}}
$}}`;

        const resultTemplate = `<div>
    <h1>{{ lists.todos.title }}</h1>
    <p>{{ lists.todos.body }}</p>
</div>
{{% for item in lists.todos.items 
    <span>{{ item }}</span>
%}}
{{% for property in lists.todos.properties 
    <span>{{ property }}</span>
%}}`;

        const result = resolveTemplateWrapper(template);

        expect(result).toEqual(resultTemplate);
    });

    test('Template is correctly resolved when nested with a conditional, a loop and a partial', () => {
        const template = `{{$ from lists.todos
<div>
    <h1>{{ title }}</h1>
    <p>{{ body }}</p>
</div>
{{% for item in items
    <span>{{ item }}</span>
%}}
{{# partial #}}

{{~ if a
    <span>{{ a }}</span>
~}}
$}}`;

        const resultTemplate = `<div>
    <h1>{{ lists.todos.title }}</h1>
    <p>{{ lists.todos.body }}</p>
</div>
{{% for item in lists.todos.items
    <span>{{ item }}</span>
%}}
{{# lists.todos.partial #}}

{{~ if lists.todos.a
    <span>{{ lists.todos.a }}</span>
~}}`;

        const result = resolveTemplateWrapper(template);

        expect(result).toEqual(resultTemplate);
    });


    test('it can compile inlined wrapper', () => {
       const template = '{{$ from nested {{ message }} $}}'
       const resultTemplate = '{{ nested.message }}'

       const result = resolveTemplateWrapper(template);

       expect(result).toEqual(resultTemplate);
    })

});