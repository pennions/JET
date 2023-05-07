import { resolvePartials } from './partial';
import { resolveLoop } from './loop';
import { resolveConditional } from './conditional';
import { resolveTemplateWrapper } from './viewmodelWrapper';

/** Constructs the template and makes it ready for interpolation */
export function buildTemplate(template, viewmodel) {
    let newTemplate = resolvePartials(template, viewmodel);
    newTemplate = resolveTemplateWrapper(newTemplate);
    newTemplate = resolveLoop(newTemplate, viewmodel);
    newTemplate = resolveConditional(newTemplate, viewmodel);

    return newTemplate;
}
