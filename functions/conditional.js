const { getPropertyValue } = require('../functions/templating');

const detectConditional = /\{\{~([\s\S]+?)~\}\}/mi;
const popertyToCheckRegex = /if([\s\S]+?)\s|is|not/mi;
const checkTrue = /is([\s\S]+?)(\n|<|{)/mi;
const checkFalse = /not([\s\S]+?)(\n|<|{)/mi;

const cleanupTemplate = (prop, template) => {
    // in case a property has spaces
    const propertyParts = prop.split(' ');
    const length = propertyParts.length - 1;

    const cleanupFirstPart = new RegExp(`\{\{.+(?<=${propertyParts[length]})`, 'mi');
    template = template.replace(cleanupFirstPart, '').replace(/\~\}\}/mi, '');

    return template.trim();
};

const cleanupTemplateWithDefined = (prop, template) => {

    const cleanupFirstPart = new RegExp(`\{\{~ ?if ?(${prop})`, 'mi');
    template = template.replace(cleanupFirstPart, '').replace(/\~\}\}/mi, '');

    return template.trim();
};

function resolveConditional(template, object) {

    if (!detectConditional.test(template)) return template;

    let truthyCheck = checkTrue.exec(template);
    let falsyCheck = checkFalse.exec(template);
    let validateProp = popertyToCheckRegex.exec(template);

    if (!validateProp) return '';

    validateProp = validateProp[1].trim();

    truthyCheck = truthyCheck ? truthyCheck[1].trim() : null;
    falsyCheck = falsyCheck ? falsyCheck[1].trim() : null;
    propertyValue = validateProp ? getPropertyValue(validateProp, object) : null;

    let renderTemplate = '';

    if (truthyCheck) {
        renderTemplate = propertyValue.toString().toLowerCase() === truthyCheck.toLowerCase() ? cleanupTemplate(truthyCheck, template) : '';
    }

    if (falsyCheck) {
        renderTemplate = propertyValue.toString().toLowerCase() !== falsyCheck.toLowerCase() ? cleanupTemplate(falsyCheck, template) : '';
    }

    if (!truthyCheck && !falsyCheck) {
        renderTemplate = propertyValue ? cleanupTemplateWithDefined(validateProp, template) : '';
    }

    return resolveConditional(renderTemplate, object);
}

module.exports = resolveConditional;