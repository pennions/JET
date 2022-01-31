/**
 * @param {string} template
 * @returns html string with whitespace cleaned between elements
 *          but preserved inside elements
 */
function cleanHtml(template) {
    return template.trim().replace(/[>](\s+)[<]/gmi, '><');
}

function escapeHtml(value) {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function getPropertyValue(property, object) {
    const propertyTrail = property.split('.');

    let templateItem = '';

    for (let prop of propertyTrail) {
        prop = prop.trim();
        if (!templateItem) templateItem = object[prop];
        else templateItem = templateItem[prop];
    }
    return templateItem;
}

function getTemplate(templatingToken, template) {
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

function getInnerTemplate(template) {
    // template length minus the three template tokens, e.g. ~}} and a space before
    return template.substring(4, template.length - 4);
}

module.exports = {
    cleanHtml,
    escapeHtml,
    getPropertyValue,
    getTemplate,
    getInnerTemplate
};