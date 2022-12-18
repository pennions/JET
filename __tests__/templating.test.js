import { getPropertyName } from '../src/functions/templating';

describe('Templating functions', () => {

    it('can retrieve a top-level property name from a template', () => {

        const template = `
        {{ message }}
        `;

        const result = getPropertyName(template);

        expect(result).toBe("message");
    });

    it('can retrieve a nested property name from a template', () => {

        const template = `
        {{ nested.message }}
        `;

        const result = getPropertyName(template);

        expect(result).toBe("message");
    });

    it('can retrieve a nested property name with array index from a template', () => {

        const template = `
        {{ nested.message.4.5.6 }}
        `;

        const result = getPropertyName(template);

        expect(result).toBe("message");
    });

    it('can retrieve a top-level  property name from an unescaped template', () => {

        const template = `
        {{! codeExample }}
        `;

        const result = getPropertyName(template);

        expect(result).toBe("codeExample");
    });

    it('can retrieve a property name from a template with a loop', () => {

        const template = `<ul>
    {{% for task in todoList
        <li>
            {{ task }}
        </li>
    %}}
</ul>`;

        const result = getPropertyName(template);

        expect(result).toBe("todoList");
    });

    it('can retrieve a nested property name from a template with a loop', () => {

        const template = `<ul>
    {{% for task in lists.todoList
        <li>
            {{ task }}
        </li>
    %}}
</ul>`;

        const result = getPropertyName(template);

        expect(result).toBe("todoList");
    });

    it('can retrieve a nested property name from a template when it is a partial', () => {

        const template = `{{# 
            partial.myPartial 
            #}}`;

        const result = getPropertyName(template);

        expect(result).toBe("myPartial");
    });

    it('can retrieve property name from a conditional', () => {

        const template = `{{~ if shoppingList.bakery.birthday is carrot cake 
            <div>The cake is not a lie!</div>
        ~}}`;

        const result = getPropertyName(template);

        expect(result).toBe("birthday");
    });
});