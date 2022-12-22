import { init } from './src/functions/framework';

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
