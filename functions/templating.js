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

    for (const prop of propertyTrail) {

        if (!templateItem) templateItem = object[prop];
        else templateItem = templateItem[prop];
    }
    return templateItem;
}

module.exports = {
    cleanHtml,
    escapeHtml,
    getPropertyValue
};