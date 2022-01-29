const interpolateRegex = /\{\{([\s\S]+?)\}\}/gmi;

function interpolate(template, object) {
    return template.replace(interpolateRegex, (_, p1) => {
        let replacement = '';

        const propertyTrail = p1.split('.');

        let templateItem = '';

        for (const prop of propertyTrail) {
            if (!templateItem) templateItem = object[prop.trim()];
            else templateItem = templateItem[prop.trim()];
        }

        if (templateItem) {
            replacement = templateItem;
        }

        return replacement;
    });
}

module.exports = interpolate;
