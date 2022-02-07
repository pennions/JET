/**
 * A simple templating engine, created by Jelmer Veen
 */
import { resolveTemplate } from './functions/resolveTemplate';
import { interpolate } from './functions/interpolation';

export const build = resolveTemplate;
export const render = interpolate;

export const compile = function (template, viewmodel) {
    let compiledTemplate = build(template, viewmodel);
    return render(compiledTemplate, viewmodel);
};

/* Used for browser registration */
if (globalThis) {
    globalThis.jet = {
        build,
        render,
        compile
    };
}
else {
    module.exports = {
        build,
        render,
        compile
    };
}