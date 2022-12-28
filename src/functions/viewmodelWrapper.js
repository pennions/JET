import {
    hasWrapperRegex,
    propertyRegex,
    viewmodelWrapperPropertyRegex,
    getTemplate,
    getInnerTemplate,
    replacePropWithTrail,
    hasLoopRegex,
    getPropertyName,
    loopListPropertyRegex,
    partialRegex,
    conditionalPropertyRegex,
    hasConditionalRegex,
    cleanViewmodelWrapperPropertyRegex
} from './templating';

export function resolveTemplateWrapper(template) {
    if (!hasWrapperRegex.test(template)) return template;

    const wrapperTemplate = getTemplate('$', template);
    const nestedProp = viewmodelWrapperPropertyRegex.exec(wrapperTemplate)[2].trim();

    const replacedLoops = extractLogic('%', nestedProp, wrapperTemplate);
    const replacedConditionals = extractLogic('~', nestedProp, replacedLoops.template);
    const replacedPartials = extractLogic('#', nestedProp, replacedConditionals.template);
    const cleanedTemplate = getInnerTemplate(replacedPartials.template).replace(cleanViewmodelWrapperPropertyRegex, '').trim();

    let newTemplate = cleanedTemplate;
    const properties = cleanedTemplate.match(propertyRegex);

    if (properties) {

        for (const property of properties) {
            const templateProp = getPropertyName(property).trim();

            newTemplate = replacePropWithTrail(
                newTemplate,
                property,
                `{{ ${nestedProp}.${templateProp} }}`
            );
        }
       newTemplate = template.replace(wrapperTemplate, newTemplate);
    }

    /** Return the extracted logic. */
    const replacedLogic = replacedLoops.extractedLogic.concat(replacedConditionals.extractedLogic.concat(replacedPartials.extractedLogic));
    for (const logic of replacedLogic) {
        newTemplate = newTemplate.replace(logic.id, logic.template);
    }
    return newTemplate;
}


function extractLogic(logicToken, nestedProp, template, extractedLogic, index) {
    if (!extractedLogic) extractedLogic = [];
    if (!index) index = 1;
    let logicTemplate = getTemplate(logicToken, template);

    let mainProp = '';
    switch (logicToken) {
        case '%': {
            if (!hasLoopRegex.test(template)) {
                return { template, extractedLogic };
            }
            mainProp = loopListPropertyRegex.exec(logicTemplate)[2].trim();
            break;
        }
        case '#': {
            if (!partialRegex.test(template)) {
                return { template, extractedLogic };
            }
            mainProp = getInnerTemplate(logicTemplate);
            break;
        }
        case '~': {
            if (!hasConditionalRegex.test(template)) {
                return { template, extractedLogic };
            }
            mainProp = conditionalPropertyRegex.exec(logicTemplate)[1].trim();
            break;
        }
    }

    let newlogicTemplate = logicTemplate.replace(mainProp, `${nestedProp}.${mainProp}`);

    if (logicToken === '~') {
        newlogicTemplate = replacePropertyWithNestedPath(nestedProp, newlogicTemplate);
    }

    const id = `jet_${logicToken}${index}_placeholder`;

    const extractedLogicItem = {
        id,
        template: newlogicTemplate,
    };
    template = template.replace(logicTemplate, id);
    extractedLogic.push(extractedLogicItem);

    return extractLogic(logicToken, nestedProp, template, extractedLogic, index + 1);
}

function replacePropertyWithNestedPath(nestedProp, template) {
    let newTemplate = template;
    const properties = getInnerTemplate(template).match(propertyRegex);

    if (!properties || !properties.length) return newTemplate;

    for (const property of properties) {
        const templateProp = getPropertyName(property).trim();

        const replacement = replacePropWithTrail(
            newTemplate,
            property,
            `{{ ${nestedProp}.${templateProp} }}`
        );
        newTemplate = newTemplate.replace(newTemplate, replacement);
    }
    return newTemplate;
}