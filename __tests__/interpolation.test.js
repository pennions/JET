
const interpolate = require('../functions/interpolation');

const template = "<div>{{ variableB }} {{variableC}} {{variableA}}</div>";

describe('Template variable interpolation', () => {
    it('adds values from a given object in the right places', () => {
        const templateObject = {
            variableA: 'works.',
            variableB: 'Great!',
            variableC: 'Interpolation'
        };

        expect(interpolate(template, templateObject)).toBe('<div>Great! Interpolation works.</div>');
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

        expect(interpolate(template, templateObject)).toBe('<div>Great! Nested interpolation works.</div>');
    });
});
