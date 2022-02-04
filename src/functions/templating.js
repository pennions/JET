import {
    propertyRegex,
    cleanHtmlRegex,
    hasConditionalRegex,
    conditionalPropertyRegex,
    cleanConditionalRegex,
    conditionalStatementRegex,
    loopPropertyRegex,
    loopListPropertyRegex,
    hasLoopRegex,
    cleanLoopRegex,
    partialRegex,
    trailRegex
} from '../regexes/templateRegexes.js';

export {
    propertyRegex,
    cleanHtmlRegex,
    hasConditionalRegex,
    conditionalPropertyRegex,
    cleanConditionalRegex,
    conditionalStatementRegex,
    loopPropertyRegex,
    loopListPropertyRegex,
    hasLoopRegex,
    cleanLoopRegex,
    partialRegex,
    trailRegex
};

/**
 * @param {string} template
 * @returns html string with whitespace cleaned between elements
 *          but preserved inside elements
 */
export function cleanHtml(template) {
    return template.trim().replace(cleanHtmlRegex, '><');
}

export function escapeHtml(value) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

export function getPropertyValue(property, object) {
    const propertyTrail = property.split('.');

    let templateItem = '';

    for (let prop of propertyTrail) {
        prop = prop.trim();
        if (!templateItem) templateItem = object[prop];
        else templateItem = templateItem[prop];
    }
    return templateItem;
}

// Create a property trail that can be interpolated
export function replacePropWithTrail(template, prop, trail) {
    let replacedTemplate = template.replace(trailRegex, (match) => {
        return match.replace(prop, trail);
    });

    // also replace the properties of an if within a loop, to match up correctly
    replacedTemplate = replacedTemplate.replace(
        conditionalPropertyRegex,
        (match) => {
            return match.replace(prop, trail);
        }
    );

    // do the same for nested loops
    return replacedTemplate.replace(loopListPropertyRegex, (match) => {
        return match.replace(prop, trail);
    });
}

export function getTemplate(templatingToken, template) {
    const beginTemplate = `{{${templatingToken}`;
    const endTemplate = `${templatingToken}}}`;

    const start = template.indexOf(beginTemplate);
    const nextStart = template.indexOf(beginTemplate, start + 3);
    const firstEnd = template.indexOf(endTemplate);

    // check for nested
    const nested = nextStart !== -1 && nextStart < firstEnd;

    const end = nested ? template.lastIndexOf(endTemplate) : firstEnd;
    // +3 to include the last part of the templating structure
    return template.substring(start, end + 3);
}

export function getInnerTemplate(template) {
    // template length minus the three template tokens, e.g. ~}} and a space before
    return template.substring(4, template.length - 4);
}
