const { XMLBuilder, XMLParser } = require('fast-xml-parser');
const { mergeDeep } = require('./utils/object-utils');

const fs = require('fs');
const path = require('path');

const Builder = (tabWidth = 4) =>
    new XMLBuilder({
        format: true,
        ignoreAttributes: false,
        indentBy: ' '.repeat(tabWidth),
        attributeNamePrefix: '@',
        attributesGroupName: 'attributes',
        suppressBooleanAttributes: false,
    });

const generate = (policies, onlyComponents = false) => {
    if (!policies.length === '') {
        throw new Error('No policies to generate');
    }

    let componentPolicies = {};
    const jcrPrimary = { 'jcr:primaryType': 'nt:unstructured' };

    policies.forEach((policy) => {
        let policyNodes = {};
        const resourceType = policy.component;
        resourceType
            .split('/')
            .reverse()
            .forEach((node, index) => {
                if (index === 0) policyNodes[node] = { attributes: jcrPrimary, ...policy.format(false) };
                else policyNodes = { [node]: { attributes: jcrPrimary, ...policyNodes } };
            });
        componentPolicies = mergeDeep({}, componentPolicies, policyNodes);
    });

    if (onlyComponents) return componentPolicies;

    return {
        '?xml': {
            attributes: {
                version: '1.0',
                encoding: 'UTF-8',
            },
        },
        'jcr:root': {
            attributes: {
                'xmlns:sling': 'http://sling.apache.org/jcr/sling/1.0',
                'xmlns:cq': 'http://www.day.com/jcr/cq/1.0',
                'xmlns:jcr': 'http://www.jcp.org/jcr/1.0',
                'xmlns:nt': 'http://www.jcp.org/jcr/nt/1.0',
                'xmlns:rep': 'internal',
                'jcr:mixinTypes': '[rep:AccessControllable]',
                'jcr:primaryType': 'cq:Page',
            },
            'rep:policy': '',
            ...componentPolicies,
        },
    };
};

const generateXML = (policies, onlyComponents = false, tabWidth = 4) => {
    if (!policies.length === '') {
        throw new Error('No policies to generate');
    }

    const xmlBuilder = Builder(tabWidth);
    return xmlBuilder.build(generate(policies, onlyComponents));
};

const exportXML = (policies, policyPath, tabWidth = 4) => {
    const filePath = path.resolve(policyPath, '.content.xml');
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, generateXML(policies, false, tabWidth));
        return;
    }

    const newXmlObj = generate(policies, false, tabWidth);

    const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '',
        attributesGroupName: 'attributes',
        suppressBooleanAttributes: false,
    });
    const oldXmlObj = parser.parse(fs.readFileSync(filePath));

    const mergedXmlObj = mergeDeep(oldXmlObj, newXmlObj);
    const xmlBuilder = Builder(tabWidth);
    const xmlStr = xmlBuilder.build(mergedXmlObj);
    fs.writeFileSync(filePath, xmlStr);
};

module.exports = { generate, generateXML, exportXML };
