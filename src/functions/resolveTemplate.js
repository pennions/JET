import { resolvePartials } from "./partial";
import { resolveLoop } from "./loop";
import { resolveConditional } from "./conditional";

export function resolveTemplate(template, viewmodel) {
    let newTemplate = resolvePartials(template, viewmodel);
    newTemplate = resolveLoop(template, viewmodel);
    newTemplate = resolveConditional(newTemplate, viewmodel);

    return newTemplate;
}
