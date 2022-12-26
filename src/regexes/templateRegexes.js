export const propertyRegex = /\{\{([\s\S]+?)\}\}/gim;
export const cleanHtmlRegex = /[>](\s+)[<]/gim;
export const hasConditionalRegex = /\{\{~([\s\S]+?)~\}\}/im;
export const conditionalPropertyRegex = /if([\s\S]+?)\s|is|not/im;
export const cleanConditionalRegex =
    / ?if([\s\S]+?)[is|not]?([\s\S]+?)(?=<|{)/im;
export const conditionalStatementRegex = / (is|not) ([\s\S]+?)(\n|<|{)/im;
export const loopPropertyRegex = /for([\s\S]+?)(of|in)/im;
export const loopListPropertyRegex = /(of|in)([\s\S]+?)(?=<|{)/im;
export const viewmodelWrapperPropertyRegex = /(from)([\s\S]+?)(?=<|{)/im;
export const cleanViewmodelWrapperPropertyRegex = /(from)([\s\S]+?)(\n|<|{)/im;
export const hasLoopRegex = /\{\{%([\s\S]+?)%\}\}/im;
export const hasWrapperRegex = /\{\{\$([\s\S]+?)\$\}\}/im;
export const cleanLoopRegex = / ?for([\s\S]+?)(of|in)([\s\S]+?)(?=<|{)/im;
export const partialRegex = /\{\{#([\s\S]+?)\}\}/gim;
export const trailRegex = /\{\{(.+)\}\}/gm;
