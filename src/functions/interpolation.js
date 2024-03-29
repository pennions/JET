import { propertyRegex, escapeHtml, getPropertyValue } from './templating';

/** Fills in all the property values */
export function interpolateTemplate(template, object) {
    return template.replace(propertyRegex, (_, p1) => {
        let replacement = '';

        p1 = p1.trim();

        const encode = p1[0] === '!';

        if (encode) {
            p1 = p1.substring(1).trim();
        }

        let templateItem = getPropertyValue(p1, object);

        if (templateItem) {
            replacement = templateItem;
        }

        replacement = Array.isArray(replacement) ? replacement.join(', ') : replacement.toString().trim();

        return encode ? escapeHtml(replacement) : replacement;
    });
}
