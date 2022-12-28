import { resolvePartials } from './partial';
import { resolveLoop } from './loop';
import { resolveConditional } from './conditional';
import { resolveTemplateWrapper } from './viewmodelWrapper';

export function resolveTemplate(template, viewmodel) {
    let newTemplate = resolvePartials(template, viewmodel);
    newTemplate = resolveTemplateWrapper(newTemplate);
    newTemplate = resolveLoop(newTemplate, viewmodel);
    newTemplate = resolveConditional(newTemplate, viewmodel);

    return newTemplate;
}
