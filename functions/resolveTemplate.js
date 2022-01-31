const resolveLoop = require('../functions/loop');
const resolveConditional = require('../functions/conditional');

function resolveTemplate(template, viewModel) {
    let newTemplate = resolveLoop(template, viewModel);
    newTemplate = resolveConditional(newTemplate, viewModel);

    return newTemplate;
}

module.exports = resolveTemplate;