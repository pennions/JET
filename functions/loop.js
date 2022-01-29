const interpolate = require('./interpolation');

const detectLogic = /\{\{%([\s\S]+?)%\}\}/gmi;
const cleanLoopRegex = / ?for([\s\S]+?)of([\s\S]+?)(?=<|{)/gmi;
const popertyOfLoopedObjectRegex = /for([\s\S]+?)of/gmi;
const propertyOfMainObjectRegex = /of([\s\S]+?)(?=<|{)/gmi;

function interpolateLoop(template, object) {

    if (!detectLogic.test(template)) return template;

    return template.replace(detectLogic, (_, p1) => {
        // Getting the complete regex, we need the 2nd part and trim whitespaces
        const mainProp = propertyOfMainObjectRegex.exec(p1)[1].trim();
        const item = object[mainProp];
        const prop = popertyOfLoopedObjectRegex.exec(p1)[1].trim();

        let replacement = '';
        let template = p1.replace(cleanLoopRegex, '').trim();

        const isObject = typeof item[0] === 'object';

        // use object interpolation
        if (isObject) {
            for (const object of item) {
                replacement += interpolate(template, object);
            }
        } else {
            for (const value of item) {
                replacement += interpolate(template, { [prop]: value });
            }
        }
        return replacement;
    });
}

module.exports = interpolateLoop;