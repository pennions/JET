(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.jet = {}));
})(this, (function (exports) { 'use strict';

    const propertyRegex = /\{\{([\s\S]+?)\}\}/gim;
    const hasConditionalRegex = /\{\{~([\s\S]+?)~\}\}/im;
    const conditionalPropertyRegex = /if([\s\S]+?)\s|is|not/im;
    const cleanConditionalRegex =
        / ?if([\s\S]+?)[is|not]?([\s\S]+?)(?=<|{)/im;
    const conditionalStatementRegex = / (is|not) ([\s\S]+?)(\n|<|{)/im;
    const loopPropertyRegex = /for([\s\S]+?)(of|in)/im;
    const loopListPropertyRegex = /(of|in)([\s\S]+?)(?=<|{)/im;
    const viewmodelWrapperPropertyRegex = /(from)([\s\S]+?)(?=<|{)/im;
    const cleanViewmodelWrapperPropertyRegex = /from([\s\S]+?)(?=\n|<|{)/gim;
    const hasLoopRegex = /\{\{%([\s\S]+?)%\}\}/im;
    const hasWrapperRegex = /\{\{\$([\s\S]+?)\$\}\}/im;
    const cleanLoopRegex = / ?for([\s\S]+?)(of|in)([\s\S]+?)(?=<|{)/im;
    const partialRegex = /\{\{#([\s\S]+?)\}\}/gim;
    const trailRegex = /\{\{(.+)\}\}/gm;

    function escapeHtml(value) {
        return value
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function getPropertyValue(property, object) {
        const propertyTrail = property.split('.');

        let templateItem = '';

        for (let prop of propertyTrail) {
            prop = prop.trim();
            if (!templateItem) templateItem = object[prop];
            else templateItem = templateItem[prop];
        }
        return templateItem;
    }

    // Create a property trail that can be interpolated
    function replacePropWithTrail(template, prop, trail) {
        let replacedTemplate = template.replace(trailRegex, (match) => {
            return match.replace(prop, trail);
        });

        // also replace the properties of an if within a loop, to match up correctly
        replacedTemplate = replacedTemplate.replace(
            conditionalPropertyRegex,
            (match) => {
                return match.replace(prop, trail);
            }
        );

        // do the same for nested loops
        return replacedTemplate.replace(loopListPropertyRegex, (match) => {
            return match.replace(prop, trail);
        });
    }

    function getTemplate(templatingToken, template) {
        const beginTemplate = `{{${templatingToken}`;
        const endTemplate = `${templatingToken}}}`;

        const start = template.indexOf(beginTemplate);
        const nextStart = template.indexOf(beginTemplate, start + 3);
        const firstEnd = template.indexOf(endTemplate);

        // check for nested
        const nested = nextStart !== -1 && nextStart < firstEnd;

        const end = nested ? template.lastIndexOf(endTemplate) : firstEnd;
        // +3 to include the last part of the templating structure
        return template.substring(start, end + 3);
    }

    function getInnerTemplate(template) {
        // template length minus the three template tokens, e.g. ~}} and a space before
        return template.substring(4, template.length - 4);
    }

    function getPropertyName(template) {
        /** roughly get the first bit */
        const templateStartIndex = template.indexOf('{{');
        const templateEndIndex = template.indexOf('}}');
        const roughTemplate = template.substring(templateStartIndex + 2, templateEndIndex);

        const token = roughTemplate[0];

        let property = '';

        switch (token) {
            /** template is just a simple interpolation, we are done. */
            case ' ': {
                property = roughTemplate;
                break;
            }
            case '!': {
                property = roughTemplate.substring(1);
                break;
            }
            case '%': {
                const regexParts = roughTemplate.match(loopListPropertyRegex);
                property = regexParts.pop();
                break;
            }
            case '#': {
                property = roughTemplate.replace(/#/g, '');
                break;
            }
            case '~': {
                const regexParts = roughTemplate.match(conditionalPropertyRegex);
                property = regexParts[1];
                break;
            }
            case '$': {
                const regexParts = roughTemplate.match(viewmodelWrapperPropertyRegex);
                property = regexParts[2];
                break;
            }
            default: {
                property = roughTemplate;
            }
        }

        if (property.includes('.')) {
            const propertyParts = property.split('.');
            property = propertyParts.pop();

            /** check if it is an array index */
            if (!isNaN(property)) {
                do {
                    property = propertyParts.pop();
                }
                while (!isNaN(property));
            }
        }

        return property.replace(/\s+/g, '');
    }

    function resolvePartials(template, object) {
        return template.replace(partialRegex, (match) => {
            let replacement = '';

            const property = getInnerTemplate(match);

            let templateItem = getPropertyValue(property, object);

            if (templateItem) {
                replacement = templateItem;
            }

            replacement = replacement.trim();

            return replacement;
        });
    }

    function resolveLoop(template, object) {
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

    function resolveConditional(template, object) {
        if (!hasConditionalRegex.test(template)) return template;

        // return null if user did not provide an is or not
        const conditionalStatement = conditionalStatementRegex.exec(template);

        let truthyCheck = false;
        let falsyCheck = false;
        let comparisonValue = '';

        if (conditionalStatement) {
            const statementCheck = conditionalStatement[1].substring(0, 4).trim();

            truthyCheck = statementCheck === 'is';
            falsyCheck = statementCheck === 'not';
            comparisonValue = conditionalStatement[2].toString().trim().toLowerCase();
        }

        let propToValidate = conditionalPropertyRegex.exec(template);

        propToValidate = propToValidate[1].toString().trim();
        let propertyValue = getPropertyValue(propToValidate, object);

        if (propertyValue) {
            propertyValue = propertyValue.toString().trim().toLowerCase();
        }

        const conditionalTemplate = getTemplate('~', template);
        const cleanedTemplate = getInnerTemplate(conditionalTemplate).replace(
            cleanConditionalRegex,
            ''
        );

        let replacement = '';

        if (truthyCheck) {
            replacement = propertyValue === comparisonValue ? cleanedTemplate : '';
        }

        if (falsyCheck) {
            replacement = propertyValue !== comparisonValue ? cleanedTemplate : '';
        }

        if (!conditionalStatement) {
            if (propertyValue === 'false') replacement = '';
            else {
                replacement = propertyValue ? cleanedTemplate : '';
            }
        }

        const newTemplate = template.replace(conditionalTemplate, replacement);

        return resolveConditional(newTemplate, object);
    }

    function resolveTemplateWrapper(template) {
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

    /** Constructs the template and makes it ready for interpolation */
    function buildTemplate(template, viewmodel) {
        let newTemplate = resolvePartials(template, viewmodel);
        newTemplate = resolveTemplateWrapper(newTemplate);
        newTemplate = resolveLoop(newTemplate, viewmodel);
        newTemplate = resolveConditional(newTemplate, viewmodel);

        return newTemplate;
    }

    /** Fills in all the property values */
    function interpolateTemplate(template, object) {
        return template.replace(propertyRegex, (_, p1) => {
            let replacement = '';

            p1 = p1.trim();

            const encode = p1[0] === '!';

            if (encode) {
                p1 = p1.substring(1).trim();
            }

            let templateItem = getPropertyValue(p1, object);

            if (templateItem) {
                replacement = templateItem;
            }

            replacement = Array.isArray(replacement) ? replacement.join(', ') : replacement.toString().trim();

            return encode ? escapeHtml(replacement) : replacement;
        });
    }

    function render(template, viewmodel) {
        let compiledTemplate = buildTemplate(template, viewmodel);
        return interpolateTemplate(compiledTemplate, viewmodel);
    }

    exports.buildTemplate = buildTemplate;
    exports.interpolateTemplate = interpolateTemplate;
    exports.render = render;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
