/**
 * A simple templating engine, created by Jelmer Veen 2022
 */
export { buildTemplate } from './functions/buildTemplate';
export { interpolateTemplate } from './functions/interpolation';

/** Builds the template and interpolates it */
export function render(template, viewmodel) {
    let compiledTemplate = jet.buildTemplate(template, viewmodel);
    return jet.interpolateTemplate(compiledTemplate, viewmodel);
};
