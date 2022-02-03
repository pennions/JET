/**
 * A simple templating engine, created by Jelmer Veen
 */
import { resolveTemplate } from './functions/resolveTemplate';
import { interpolate } from './functions/interpolation';

export const build = resolveTemplate;
export const render = interpolate;

export const compile = function (template, viewmodel) {
    let compiledTemplate = build(template, viewmodel);
    return render(compiledTemplate);
};

module.exports = {
    build,
    render,
    compile
};
