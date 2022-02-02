const resolvePartials = require("./partial");
const resolveLoop = require('./loop');
const resolveConditional = require('./conditional');

function resolveTemplate(template, viewModel) {
    let newTemplate = resolvePartials(template, viewModel);
    newTemplate = resolveLoop(template, viewModel);
    newTemplate = resolveConditional(newTemplate, viewModel);

    return newTemplate;
}

module.exports = resolveTemplate;