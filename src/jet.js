/**
 * A simple templating engine, created by Jelmer Veen
 */
import { resolveTemplate } from './functions/resolveTemplate';
import { interpolate } from './functions/interpolation';
import { init, update, compile } from './functions/framework';

export const build = resolveTemplate;
export const render = interpolate;


/* Used for browser registration */
if (globalThis) {
    globalThis.jet = {
        init,
        update,
        build,
        render,
        compile
    };
}
else {
    module.exports = {
        init,
        update,
        build,
        render,
        compile
    };
}
