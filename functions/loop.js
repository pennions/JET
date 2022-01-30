const { getPropertyValue } = require('../functions/templating');

const detectLogic = /\{\{%([\s\S]+?)%\}\}/mi;
const cleanLoopRegex = / ?for([\s\S]+?)of([\s\S]+?)(?=<|{)/mi;
const propertyOfLoopedObjectRegex = /for([\s\S]+?)of/mi;
const propertyOfMainObjectRegex = /of([\s\S]+?)(?=<|{)/mi;

// Create a property trail that can be interpolated
function replacePropWithTrail(template, prop, trail) {
    if (prop.includes('.')) trail = `${prop}.${trail}`;
    return template.replace(prop, trail);
}

function resolveLoop(template, object) {

    if (!detectLogic.test(template)) return template;

    const startOfLoop = template.indexOf('{{%');
    const endOfLoop = template.lastIndexOf('%}}');
    const insideLoop = template.substring(startOfLoop, endOfLoop + 3);

    // Getting the complete regex, we need the 2nd part and trim whitespaces
    const mainProp = propertyOfMainObjectRegex.exec(insideLoop)[1].trim();
    const item = getPropertyValue(mainProp, object);

    const prop = propertyOfLoopedObjectRegex.exec(insideLoop)[1].trim();

    let replacement = '';
    let cleanedTemplate = insideLoop.substring(3, insideLoop.length - 3).replace(cleanLoopRegex, '').trim();

    for (const index in item) {
        replacement += replacePropWithTrail(cleanedTemplate, prop, `${mainProp}.${index}`);
    }

    let newTemplate = template.replace(insideLoop, replacement).trim();


    return resolveLoop(newTemplate, object);
}


module.exports = resolveLoop;;