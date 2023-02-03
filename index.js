const { ComponentPolicy } = require('./src/component-policy');
const { generateXML, generate, exportXML, addPoliciesToTemplate } = require('./src/generate-policy');
const { ComponentStyle } = require('./src/styles/component-style');
const { Style } = require('./src/styles/style');
const { StyleGroup } = require('./src/styles/style-group');

module.exports = {
    ComponentPolicy,
    generateXML,
    ComponentStyle,
    Style,
    StyleGroup,
    generate,
    exportXML,
    addPoliciesToTemplate,
};
