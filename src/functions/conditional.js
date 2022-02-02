const { hasConditionalRegex, conditionalPropertyRegex, cleanConditionalRegex, conditionalStatementRegex } = require("../regexes/templateRegexes");
const { getPropertyValue, getTemplate, getInnerTemplate } = require('./templating');

function resolveConditional(template, object) {

    if (!hasConditionalRegex.test(template)) return template;

    // return null if user did not provide an is or not
    const conditionalStatement = conditionalStatementRegex.exec(template);

    let truthyCheck = false;
    let falsyCheck = false;
    let comparisonValue = '';

    if (conditionalStatement) {
        const statementCheck = conditionalStatement[1].substring(0, 3).trim();

        truthyCheck = statementCheck === 'is';
        falsyCheck = statementCheck === 'not';
        comparisonValue = conditionalStatement[2].trim().toLowerCase();
    }

    let propToValidate = conditionalPropertyRegex.exec(template);

    propToValidate = propToValidate[1].trim();
    propertyValue = getPropertyValue(propToValidate, object);

    if (propertyValue) {
        propertyValue = propertyValue.toString().toLowerCase();
    }

    const conditionalTemplate = getTemplate("~", template);
    const cleanedTemplate = getInnerTemplate(conditionalTemplate).replace(cleanConditionalRegex, '');

    let replacement = '';

    if (truthyCheck) {
        replacement = propertyValue === comparisonValue ? cleanedTemplate : '';
    }

    if (falsyCheck) {
        replacement = propertyValue !== comparisonValue ? cleanedTemplate : '';
    }

    if (!conditionalStatement) {
        replacement = propertyValue ? cleanedTemplate : '';
    }

    let newTemplate = template.replace(conditionalTemplate, replacement);

    return resolveConditional(newTemplate, object);
}

module.exports = resolveConditional;