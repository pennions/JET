export const propertyRegex = /\{\{([\s\S]+?)\}\}/gim;
export const cleanHtmlRegex = /[>](\s+)[<]/gim;
export const hasConditionalRegex = /\{\{~([\s\S]+?)~\}\}/im;
export const conditionalPropertyRegex = /if([\s\S]+?)\s|is|not/im;
export const cleanConditionalRegex =
    / ?if([\s\S]+?)[is|not]?([\s\S]+?)(?=<|{)/im;
export const conditionalStatementRegex = /(is|not)([\s\S]+?)(\n|<|{)/im;
export const loopPropertyRegex = /for([\s\S]+?)of/im;
export const loopListPropertyRegex = /of([\s\S]+?)(?=<|{)/im;
export const hasLoopRegex = /\{\{%([\s\S]+?)%\}\}/im;
export const cleanLoopRegex = / ?for([\s\S]+?)of([\s\S]+?)(?=<|{)/im;
export const partialRegex = /\{\{#([\s\S]+?)\}\}/gim;
export const trailRegex = /\{\{(.+)\}\}/gm;
