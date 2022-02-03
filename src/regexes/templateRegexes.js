
export const propertyRegex = /\{\{([\s\S]+?)\}\}/gmi;
export const cleanHtmlRegex = /[>](\s+)[<]/gmi;
export const hasConditionalRegex = /\{\{~([\s\S]+?)~\}\}/mi;
export const conditionalPropertyRegex = /if([\s\S]+?)\s|is|not/mi;
export const cleanConditionalRegex = / ?if([\s\S]+?)[is|not]?([\s\S]+?)(?=<|{)/mi;
export const conditionalStatementRegex = /(is|not)([\s\S]+?)(\n|<|{)/mi;
export const loopPropertyRegex = /for([\s\S]+?)of/mi;
export const loopListPropertyRegex = /of([\s\S]+?)(?=<|{)/mi;
export const hasLoopRegex = /\{\{%([\s\S]+?)%\}\}/mi;
export const cleanLoopRegex = / ?for([\s\S]+?)of([\s\S]+?)(?=<|{)/mi;
export const partialRegex = /\{\{#([\s\S]+?)\}\}/gmi;
export const trailRegex = /\{\{(.+)\}\}/gm;
