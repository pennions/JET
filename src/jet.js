/**
 * A simple templating engine, created by Jelmer Veen 2022
 */
import { resolveTemplate } from './functions/resolveTemplate';
import { interpolate } from './functions/interpolation';
import { init, update, get, compile, addEvent, removeEvent, watch, removeWatch } from './functions/framework';

export const build = resolveTemplate;
export const render = interpolate;


/* Used for browser registration */
if (globalThis) {
    globalThis.jet = {
        init,
        get,
        update,
        addEvent,
        removeEvent,
        watch,
        removeWatch,
        build,
        render,
        compile
    };
}
else {
    module.exports = {
        build,
        render,
        compile
    };
}
