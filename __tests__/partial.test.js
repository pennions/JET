
const resolvePartials = require('../functions/partial');
const { cleanHtml } = require("../functions/templating");

const template = `<body>
    {{# partials.navbar }}
    <main>Main content and such</main>
    {{# partials.footer}}
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
});
