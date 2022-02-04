import {
    hasLoopRegex,
    cleanLoopRegex,
    loopPropertyRegex,
    loopListPropertyRegex,
    getPropertyValue,
    getTemplate,
    getInnerTemplate,
    replacePropWithTrail
} from './templating';

export function resolveLoop(template, object) {
    if (!hasLoopRegex.test(template)) return template;

    const loopTemplate = getTemplate('%', template);

    // Getting the complete regex, we need the 2nd part and trim whitespaces
    const mainProp = loopListPropertyRegex.exec(loopTemplate)[2].trim();
    const item = getPropertyValue(mainProp, object);

    const prop = loopPropertyRegex.exec(loopTemplate)[1].trim();
    const cleanedTemplate = getInnerTemplate(loopTemplate).replace(
        cleanLoopRegex,
        ''
    );

    let replacement = '';

    for (const index in item) {
        replacement += replacePropWithTrail(
            cleanedTemplate,
            prop,
            `${mainProp}.${index}`
        );
    }

    const newTemplate = template.replace(loopTemplate, replacement);

    return resolveLoop(newTemplate, object);
}
