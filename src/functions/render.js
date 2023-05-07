import { buildTemplate } from './buildTemplate';
import { interpolateTemplate } from './interpolation';

export function render(template, viewmodel) {
    let compiledTemplate = buildTemplate(template, viewmodel);
    return interpolateTemplate(compiledTemplate, viewmodel);
};
