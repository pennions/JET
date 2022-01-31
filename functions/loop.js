const { getPropertyValue, getTemplate, getInnerTemplate } = require('../functions/templating');

const detectLogic = /\{\{%([\s\S]+?)%\}\}/mi;
const cleanLoopRegex = / ?for([\s\S]+?)of([\s\S]+?)(?=<|{)/mi;
const propertyOfLoopedObjectRegex = /for([\s\S]+?)of/mi;
const propertyOfMainObjectRegex = /of([\s\S]+?)(?=<|{)/mi;
const conditionalProperty = /if([\s\S]+?)\s|is|not/mi;

// Create a property trail that can be interpolated
function replacePropWithTrail(template, prop, trail) {
    if (prop.includes('.')) trail = `${prop}.${trail}`;
    let replacedTemplate = template.replace(/\{\{(.+)\}\}/gmi, (match) => {
        return match.replace(prop, trail);
    });

    // also replace the properties of an if within a loop, to match up correctly
    replacedTemplate = replacedTemplate.replace(conditionalProperty, (match) => {
        return match.replace(prop, trail);
    });

    // do the same for nested loops
    return replacedTemplate.replace(propertyOfMainObjectRegex, (match) => {
        return match.replace(prop, trail);
    });
}

function resolveLoop(template, object) {

    if (!detectLogic.test(template)) return template;

    const loopTemplate = getTemplate("%", template);

    // Getting the complete regex, we need the 2nd part and trim whitespaces
    const mainProp = propertyOfMainObjectRegex.exec(loopTemplate)[1].trim();
    const item = getPropertyValue(mainProp, object);

    const prop = propertyOfLoopedObjectRegex.exec(loopTemplate)[1].trim();
    const cleanedTemplate = getInnerTemplate(loopTemplate).replace(cleanLoopRegex, '');

    let replacement = '';

    for (const index in item) {
        replacement += replacePropWithTrail(cleanedTemplate, prop, `${mainProp}.${index}`);
    }

    const newTemplate = template.replace(loopTemplate, replacement);

    return resolveLoop(newTemplate, object);
}


module.exports = resolveLoop;;