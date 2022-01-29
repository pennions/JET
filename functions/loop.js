const detectLogic = /\{\{%([\s\S]+?)%\}\}/mi;
const cleanLoopRegex = / ?for([\s\S]+?)of([\s\S]+?)(?=<|{)/mi;
const popertyOfLoopedObjectRegex = /for([\s\S]+?)of/mi;
const propertyOfMainObjectRegex = /of([\s\S]+?)(?=<|{)/mi;

// Create a property trail that can be interpolated
function replacePropWithTrail(template, prop, trail) {
    return template.replace(prop, trail);
}

function resolveLoop(template, object) {

    if (!detectLogic.test(template)) return template;

    return template.replace(detectLogic, (_, p1) => {
        // Getting the complete regex, we need the 2nd part and trim whitespaces
        const mainProp = propertyOfMainObjectRegex.exec(p1)[1].trim();
        const item = object[mainProp];
        const prop = popertyOfLoopedObjectRegex.exec(p1)[1].trim();

        let replacement = '';
        let template = p1.replace(cleanLoopRegex, '').trim();

        for (const index in item) {
            replacement += replacePropWithTrail(template, prop, `${mainProp}.${index}`);
        }

        return replacement;
    });
}


module.exports = resolveLoop;;