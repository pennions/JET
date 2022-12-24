import { init } from './src/functions/framework';
import { update } from './src/functions/framework';

window.jet = {};
window.jet.update = update;

const vm = {
    shoppingList: {
        groceryStore: ['Carrot', 'Melon', 'Potato']
    },
    a: {
        b: {
            c: 1337
        }
    },
    message: 'Hello world!',
    hello_world: `<div>{{ message }}</div>`
};

const pennionsVM = init('app', vm);


update('a.b.c', 42);