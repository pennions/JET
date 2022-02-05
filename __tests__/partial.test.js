
import { resolvePartials } from "../src/functions/partial";
import { cleanHtml } from "../src/functions/templating";

const template = `<body>
    {{# partials.navbar #}}
    <main>Main content and such</main>
    {{# partials.footer #}}
</body>`;

describe('Resolving partials', () => {
    it('can add partials', () => {
        const templateObject = {
            partials: {
                navbar: '<nav><a>Some menu content</a>{{~ admin <button>To admin panel</button> ~}}</nav>',
                footer: '<footer>(C) made with JET</footer>'
            }
        };

        let resolvedTemplate = resolvePartials(template, templateObject);
        resolvedTemplate = cleanHtml(resolvedTemplate);

        expect(resolvedTemplate).toBe('<body><nav><a>Some menu content</a>{{~ admin <button>To admin panel</button> ~}}</nav><main>Main content and such</main><footer>(C) made with JET</footer></body>');
    });

    it('can resolve partials beginning with template characters', () => {
        const templateObject = {
            shoppingList: {
                groceryStore: ['Carrot', 'Melon', 'Potato'],
            },
            username: 'Jet',
            partials: {
                shoppingList: `<ul> {{% for item in shoppingList.groceryStore <li> {{ item }} </li> %}} </ul>`,
                username: `{{~ if username <div>{{ username }}</div> ~}}`
            }
        }
        
        const template = `
        {{# partials.username #}}
        {{# partials.shoppingList #}}
        `
        let resolvedTemplate = resolvePartials(template, templateObject);
        resolvedTemplate = cleanHtml(resolvedTemplate);

        expect(resolvedTemplate).toBe(`{{~ if username <div>{{ username }}</div> ~}}
        <ul> {{% for item in shoppingList.groceryStore <li> {{ item }} </li> %}} </ul>`);
    })
});
