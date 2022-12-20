import { resolveTemplate } from './resolveTemplate';
import { interpolate } from './interpolation';
import { getPropertyName } from './templating';

function createPennionsModel(object, onUpdated) {
    var handler = {
        get: function (target, property, receiver) {
            try {
                return new Proxy(target[property], handler);
            }
            catch (err) {
                return Reflect.get(target, property, receiver);
            }
        },
        defineProperty: function (target, property, descriptor) {
            var updateRef = Reflect.defineProperty(target, property, descriptor);
            onUpdated();
            return updateRef;
        },
        deleteProperty: function (target, property) {
            var updateRef = Reflect.deleteProperty(target, property);
            onUpdated();
            return updateRef;
        }
    };
    return new Proxy(object, handler);
}

function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

function setValue(object, propertyTrail, newValue) {
    if (propertyTrail.length === 1) {
        object[propertyTrail[0]] = newValue;
        return;
    }
    else {
        const nextKey = propertyTrail[0];
        const nextTrail = propertyTrail.slice(1);

        return setValue(object[nextKey], nextTrail, newValue);
    }
}

function rerender() {
    const elementsToUpdate = window._jetElements[window._updatedProperty];

    const elementsToRemove = [];
    for (const htmlElement of elementsToUpdate) {
        const elementToUpdate = document.getElementById(htmlElement.id);

        if (elementToUpdate !== null) {
            const isPartial = htmlElement.template.includes('{{#');

            if (isPartial) {
                elementToUpdate.innerHTML = resolveTemplate(htmlElement.template, window._jetViewmodel);
                init(htmlElement.id);
            }
            else {
                elementToUpdate.innerHTML = compile(htmlElement.template, window._jetViewmodel);
            }
        }
        else {
            elementsToRemove.push(htmlElement.id);
        }
    }

    if (elementsToRemove.length) {
        /** cleanup previous template */
        for (const elementId of elementsToRemove) {
            const index = elementsToUpdate.findIndex(el => el.id === elementId);
            if (index > -1) {
                window._jetElements[window._updatedProperty].splice(index, 1);
            }
        }
    }
}

/** Elements found */
window._jetElements = {};

window._updatedProperty = '';

/** global scoped viewmodel */
window._jetViewmodel = {};

/**
 * Initializes JET as a lightweight framework
 * @param {string} elementId id of the element that you want to render
 * @param {object} viewmodel the viewmodel to use to render
 */
export const init = function (elementId, viewmodel) {
    /** Needs to be initialized only once. but the function can be used to render partials. */
    if (viewmodel) {
        window._jetViewmodel = createPennionsModel(Object.assign({}, viewmodel), rerender);
    }

    const rootElement = document.getElementById(elementId);

    const { children } = rootElement;

    for (const child of children) {
        if (child.nodeName.toLowerCase() !== 'script' && child.innerText.includes('{')) {
            const indentifier = uuidv4();
            const template = child.innerHTML;
            const propertyName = getPropertyName(template);
            if (propertyName) {
                if (window._jetElements[propertyName]) {
                    window._jetElements[propertyName].push({ id: indentifier, template });
                }
                else {
                    window._jetElements[propertyName] = [{ id: indentifier, template }];
                }
                child.id = indentifier;

                const isPartial = template.includes('{{#');

                if (isPartial) {
                    /** We want the partials to trigger rerender on their prop change as well */
                    child.innerHTML = resolveTemplate(template, window._jetViewmodel);
                    init(indentifier);
                }
                else {
                    child.innerHTML = compile(template, window._jetViewmodel);
                }
            }
        }
    }
};

/**
 * 
 * @param {string} property complete path of the property inside the object. EG 'a' for { a: 1 } or 'a.b' for { a: { b: 1 } }
 * @param {*} newValue the complete new value to set. like 2, or [ 1, 2, 3 ] if it is an array or { a: 1, b: 2} if it is an object
 */
export const update = function (property, newValue) {

    const propertyTrail = property.split('.');
    window._updatedProperty = propertyTrail[propertyTrail.length - 1];
    setValue(window._jetViewmodel, propertyTrail, newValue);
};

export const compile = function (template, viewmodel) {
    let compiledTemplate = resolveTemplate(template, viewmodel);
    return interpolate(compiledTemplate, viewmodel);
};


// todo: loop over textnodes, if textnodes and partial, mark it in the elements array and then filter out the part of the html of the partial. 
// then replace that node.
// https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_node_replacechild

