const interpolateRegex = /\{\{([\s\S]+?)\}\}/gmi;

function escapeHtml(value) {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function interpolate(template, object) {
    return template.replace(interpolateRegex, (_, p1) => {
        let replacement = '';

        p1 = p1.trim();

        const encode = p1[0] === '!';

        if (encode) {
            p1 = p1.substring(1).trim();
        }

        const propertyTrail = p1.split('.');

        let templateItem = '';

        for (const prop of propertyTrail) {

            if (!templateItem) templateItem = object[prop];
            else templateItem = templateItem[prop];
        }

        if (templateItem) {
            replacement = templateItem;
        }

        return encode ? escapeHtml(replacement) : replacement;
    });
}

module.exports = interpolate;
