
import { interpolateTemplate } from "../src/functions/interpolation";

const template = "<div>{{ variableB }} {{variableC}} {{variableA}}</div>";

describe('Template variable interpolation', () => {
    it('adds values from a given object in the right places', () => {
        const templateObject = {
            variableA: 'works.',
            variableB: 'Great!',
            variableC: 'Interpolation'
        };

        expect(interpolateTemplate(template, templateObject)).toBe('<div>Great! Interpolation works.</div>');
    });

    it('can add nested values', () => {
        const template = "<div>{{ variableB }} {{variableC.a}} {{variableA}}</div>";

        const templateObject = {
            variableA: 'works.',
            variableB: 'Great!',
            variableC: {
                a: 'Nested interpolation'
            }
        };

        expect(interpolateTemplate(template, templateObject)).toBe('<div>Great! Nested interpolation works.</div>');
    });

    it('can escape html', () => {
        const template = "<pre><code>{{! myExample }}</code></pre>";

        const templateObject = {
            myExample: '<p>This HTML is for a code example</p>',
        };

        expect(interpolateTemplate(template, templateObject)).toBe('<pre><code>&lt;p&gt;This HTML is for a code example&lt;/p&gt;</code></pre>');
    });
});
