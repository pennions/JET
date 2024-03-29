import { buildTemplate } from "../src/functions/buildTemplate";
import { cleanHtml } from "../src/functions/templating";

const testTemplate = `
<main>
    {{~ if articles.0
        <section>
        {{% for article of articles
            <article>
            <h1>{{article.header}}</h1>
            <p>{{article.text}}</p>
            {{~ if article.footer
                <footer>{{article.footer}}</footer>
            ~}}
            </article>
        %}}
        </section>
    ~}}
</main>
`;

const viewModel = {
    articles: [{
        header: 'Article 1',
        text: '1) Lorem ipsum dolor'
    }, {
        header: 'Article 2',
        text: '2) Amet and some other stuff'
    }, {
        header: 'Article 3',
        text: '3) Hello world.',
        footer: "Written by Edgar Allan Poe"
    }]
};

describe('Resolving of constructed templates', () => {
    it('can resolve a template with nested statements', () => {
        let template = buildTemplate(testTemplate, viewModel);
        // for easier assertion
        template = cleanHtml(template);
        expect(template).toBe("<main><section><article><h1>{{articles.0.header}}</h1><p>{{articles.0.text}}</p></article><article><h1>{{articles.1.header}}</h1><p>{{articles.1.text}}</p></article><article><h1>{{articles.2.header}}</h1><p>{{articles.2.text}}</p><footer>{{articles.2.footer}}</footer></article></section></main>");
    });

    it('can resolve a template with all kinds of statements', () => {

        const completeVM = {
            conditional: true,
            partial: '<div>{{ message }}</div>',
            nested: {
                message: 'I am a nested message.'
            },
            list: ['a', 'b', 'c'],
            message: 'Top level message'
        };

        const completeTemplate = `<main>
   <section>
        {{ message }}

        {{~ if conditional
            {{# partial #}}
        ~}}

        {{% for item in list
            {{ item }}
        %}}

        {{$ from nested
            {{# partial #}}
        $}}
   </section>
</main>`;

        const expectedTemplate = `<main><section>{{ message }}<div>{{ message }}</div>{{ list.0 }}{{ list.1 }}{{ list.2 }}<div>{{ nested.message }}</div></section></main>`;

        let template = buildTemplate(completeTemplate, completeVM);

        /** getting weird spacing errors when trying to compare. so eliminate it all! */
        template = template.replace(/\n/gim, '');
        template = template.replace(/[}](\s+)[<]/gim, '}<');
        template = template.replace(/[>](\s+)[{]/gim, '>{');
        template = template.replace(/[}](\s+)[{]/gim, '}{');
        template = template.replace(/[>](\s+)[<]/gim, '><');


        expect(template).toBe(expectedTemplate);
    });
});
