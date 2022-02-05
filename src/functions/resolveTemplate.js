import { resolvePartials } from './partial';
import { resolveLoop } from './loop';
import { resolveConditional } from './conditional';

export function resolveTemplate(template, viewmodel) {
    let newTemplate = resolvePartials(template, viewmodel);
    newTemplate = resolveLoop(newTemplate, viewmodel);
    newTemplate = resolveConditional(newTemplate, viewmodel);

    return newTemplate;
}
