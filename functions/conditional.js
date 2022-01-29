
const detectLogic = /\{\{%([\s\S]+?)%\}\}/gmi;
const popertyToCheckRegex = /if([\s\S]+?)\s|is|not/gmi;
const checkTrue = /is([\s\S]+?)(\n|<|{)/gmi;
const checkFalse = /not([\s\S]+?)(\n|<|{)/gmi;

const cleanupTemplate = (prop, template) => {
    // in case a property has spaces
    const propertyParts = prop.split(' ');
    const length = propertyParts.length -1;
    
    const cleanupFirstPart = new RegExp(`\{\{.+(?<=${propertyParts[length]})`, 'mi');
    template = template.replace(cleanupFirstPart, '').replace(/\%\}\}/mi, '');

    return template.trim();

};

const cleanupTemplateWithDefined = (prop, template) => {

    const cleanupFirstPart = new RegExp(`\{\{% ?if ?(${prop})`, 'mi');
    template = template.replace(cleanupFirstPart, '').replace(/\%\}\}/mi, '');

    return template.trim();
};

function processConditional(template, object) {

    if (!detectLogic.test(template)) return template;

    let truthyCheck = checkTrue.exec(template);
    let falsyCheck = checkFalse.exec(template);
    let validateProp = popertyToCheckRegex.exec(template);

    if (!validateProp) return '';

    truthyCheck = truthyCheck ? truthyCheck[1].trim() : null;
    falsyCheck = falsyCheck ? falsyCheck[1].trim() : null;
    validateProp = validateProp ? validateProp[1].trim() : null;

    let renderTemplate = '';

    if (truthyCheck) {
        renderTemplate = object[validateProp].toString().toLowerCase() === truthyCheck.toLowerCase() ? cleanupTemplate(truthyCheck, template) : '';
    }

    if (falsyCheck) {
        renderTemplate = object[validateProp].toString().toLowerCase() !== falsyCheck.toLowerCase() ? cleanupTemplate(falsyCheck, template) : '';
    }

    if (!truthyCheck && !falsyCheck) {
        renderTemplate = object[validateProp] ? cleanupTemplateWithDefined(validateProp, template) : '';
    }

    return renderTemplate;
}

module.exports = processConditional;