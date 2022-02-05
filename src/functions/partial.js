import { partialRegex, getPropertyValue, getInnerTemplate } from './templating';

export function resolvePartials(template, object) {
    return template.replace(partialRegex, (match) => {
        let replacement = '';

        const property = getInnerTemplate(match);

        let templateItem = getPropertyValue(property, object);

        if (templateItem) {
            replacement = templateItem;
        }

        replacement = replacement.trim();

        return replacement;
    });
}
