import { propertyRegex, escapeHtml, getPropertyValue } from './templating';

export function interpolate(template, object) {
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

        replacement = replacement.trim();

        return encode ? escapeHtml(replacement) : replacement;
    });
}
