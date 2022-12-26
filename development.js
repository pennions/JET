import { init, watch } from './src/functions/framework';
import { update, get } from './src/functions/framework';

window.jet = {};
window.jet.update = update;
window.jet.get = get;
window.jet.watch = watch;

const x2 = async function () {
    const lazy = await import('./importMe.js');
    lazy.test();

};

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
    hello_world: `<div>
    {{ message }}
    </div>`
};

init('app', vm,);

const x = watch('a.b.c', (newValue) => {
    console.log(newValue, ' From: ' + x);
});

const y = watch('message', (newValue) => {
    console.log(newValue, ' From: ' + y);
    x2();
});

update('a.b.c', 42);