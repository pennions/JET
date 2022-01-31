const { getPropertyValue, getTemplate, getInnerTemplate } = require('../functions/templating');

const detectConditional = /\{\{~([\s\S]+?)~\}\}/mi;
const popertyToCheckRegex = /if([\s\S]+?)\s|is|not/mi;
const cleanConditionalRegex = / ?if([\s\S]+?)[is|not]?([\s\S]+?)(?=<|{)/mi;
const checkTrue = /is([\s\S]+?)(\n|<|{)/mi;
const checkFalse = /not([\s\S]+?)(\n|<|{)/mi;

function resolveConditional(template, object) {

    if (!detectConditional.test(template)) return template;

    let truthyCheck = checkTrue.exec(template);
    let falsyCheck = checkFalse.exec(template);
    let validateProp = popertyToCheckRegex.exec(template);

    truthyCheck = truthyCheck ? truthyCheck[1].trim() : null;
    falsyCheck = falsyCheck ? falsyCheck[1].trim() : null;
    validateProp = validateProp[1].trim();
    propertyValue = getPropertyValue(validateProp, object);

    const conditionalTemplate = getTemplate("~", template);
    const cleanedTemplate = getInnerTemplate(conditionalTemplate).replace(cleanConditionalRegex, '');
    
    let replacement = '';

    if (truthyCheck) {
        replacement = propertyValue.toString().toLowerCase() === truthyCheck.toLowerCase() ? cleanedTemplate : '';
    }

    if (falsyCheck) {
        replacement = propertyValue.toString().toLowerCase() !== falsyCheck.toLowerCase() ? cleanedTemplate : '';
    }

    if (!truthyCheck && !falsyCheck) {
        replacement = propertyValue ? cleanedTemplate : '';
    }

    let newTemplate = template.replace(conditionalTemplate, replacement);

    return resolveConditional(newTemplate, object);
}

module.exports = resolveConditional;