const { getPropertyValue } = require("./templating");

const partialRegex = /\{\{#([\s\S]+?)\}\}/gmi;

function resolvePartials(template, object) {
    return template.replace(partialRegex, (_, p1) => {
        let replacement = '';

        p1 = p1.trim();


        let templateItem = getPropertyValue(p1, object);

        if (templateItem) {
            replacement = templateItem;
        }

        replacement = replacement.trim();

        return replacement;
    });
}

module.exports = resolvePartials;
