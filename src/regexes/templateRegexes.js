module.exports = {
    propertyRegex: /\{\{([\s\S]+?)\}\}/gmi,
    cleanHtmlRegex: /[>](\s+)[<]/gmi,
    hasConditionalRegex: /\{\{~([\s\S]+?)~\}\}/mi,
    conditionalPropertyRegex: /if([\s\S]+?)\s|is|not/mi,
    cleanConditionalRegex: / ?if([\s\S]+?)[is|not]?([\s\S]+?)(?=<|{)/mi,
    conditionalStatementRegex: /(is|not)([\s\S]+?)(\n|<|{)/mi,
    loopPropertyRegex: /for([\s\S]+?)of/mi,
    loopListPropertyRegex: /of([\s\S]+?)(?=<|{)/mi,
    hasLoopRegex: /\{\{%([\s\S]+?)%\}\}/mi,
    cleanLoopRegex: / ?for([\s\S]+?)of([\s\S]+?)(?=<|{)/mi,
    partialRegex: /\{\{#([\s\S]+?)\}\}/gmi,
    trailRegex: /\{\{(.+)\}\}/gmi
};
