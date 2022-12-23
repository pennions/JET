import { resolveTemplate } from './resolveTemplate';
import { interpolate } from './interpolation';
import { getPropertyName, getPropertyNames } from './templating';

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
    const guid = ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
    /** This will be unique enough */
    const newGuid = guid.split('-')[0];

    /** verify to be absolutely sure ;) */
    if (window._jetGuidStore.some(guid => guid === newGuid)) {
        return uuidv4();
    }
    else {
        window._jetGuidStore.push(newGuid);
        return newGuid;
    }
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

    if (!elementsToUpdate) return;

    const elementsToRemove = [];
    for (const htmlElement of elementsToUpdate) {
        const elementToUpdate = document.querySelector(`[data-jet-${htmlElement.id}]`);

        if (elementToUpdate !== null) {
            _renderTemplate(elementToUpdate, htmlElement.id, htmlElement.template);
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

window._jetGuidStore = [];

/** Elements found */
window._jetElements = {};

/** To get all elements listening to this update */
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
    let rootElement = document.querySelector(`[data-jet-${elementId}]`);

    /** The first initialization is actually an ID */
    if (rootElement === null) {
        rootElement = document.getElementById(elementId);
    }

    /** Check for partials that have no root element */
    const { childNodes } = rootElement;

    const parser = new DOMParser();

    childNodes.forEach((child) => {
        if (child.nodeName === '#text' && child.textContent.includes('{{#')) {

            const cleanedTemplate = child.textContent.trim();
            const identifier = _retrieveAndStorePropertyData(cleanedTemplate);
            const innerTemplate = resolveTemplate(cleanedTemplate, window._jetViewmodel);
            const html = parser.parseFromString(innerTemplate, 'text/html');

            const partialElement = html.body.firstChild;
            partialElement.setAttribute(`data-jet-${identifier}`, '');

            /** if we just pulled out the container and there is no element inside
             * treat is as text and add that to a span for reactiveness
             */
            if (partialElement.innerText?.length && partialElement.innerText[0] === '{') {
                const spanEl = document.createElement('span');
                spanEl.innerText = partialElement.innerText;
                partialElement.innerText = '';
                partialElement.appendChild(spanEl);
            }

            child.parentNode.replaceChild(partialElement, child);
        }

        /** now compile everything */
        const { children } = rootElement;

        _recursiveInitialization(children);
    });
};

function _recursiveInitialization(children) {

    for (const child of children) {

        /** So if we have child elements and it is NOT a loop and NOT a conditional we go ahead */
        if (child.children.length > 0 && !child.innerText.includes('{{%') && !child.innerText.includes('{{~')) {
            _recursiveInitialization(child.children);
        }

        if (child.nodeName.toLowerCase() !== 'script' && child.innerText.includes('{')) {
            const template = child.innerHTML;
            const identifier = _retrieveAndStorePropertyData(template);
            _renderTemplate(child, identifier, template);
        }
    }
}

function _renderTemplate(node, identifier, template) {

    if (identifier) {
        node.setAttribute(`data-jet-${identifier}`, '');
        const isPartial = template.includes('{{#');

        if (isPartial) {
            /** We want the partials to trigger rerender on their prop change as well */
            node.innerHTML = resolveTemplate(template, window._jetViewmodel);
            init(identifier);
        }
        else {
            node.innerHTML = compile(template, window._jetViewmodel);
        }
    }
}
/**
 * Handles the reactivity of a JET template
 * @param {string} template an innerHTML or text string with JET syntax
 * @returns an uuidv4
 */
function _retrieveAndStorePropertyData(template) {
    const identifier = uuidv4();
    const propertyNames = getPropertyNames(template);
    if (propertyNames.length) {

        for (const propertyName of propertyNames) {

            if (window._jetElements[propertyName]) {
                window._jetElements[propertyName].push({ id: identifier, template });
            }
            else {
                window._jetElements[propertyName] = [{ id: identifier, template }];
            }
        }
        return identifier;
    }
    else {
        return null;
    }
}

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
