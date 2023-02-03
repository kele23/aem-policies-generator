const { ComponentPolicy } = require('../src/component-policy');
const { generateXML } = require('../src/generate-policy');
const { ComponentStyle } = require('../src/styles/component-style');
const { Style } = require('../src/styles/style');
const { StyleGroup } = require('../src/styles/style-group');

function runTest() {
    const styleGroup = new StyleGroup({
        label: 'Padding/Centering',
        allowMultiple: true,
        styles: [
            new Style({
                label: 'Centering',
                id: 'centering',
                classes: 'tw-mod-centering',
            }),
            new Style({
                label: 'X Padded',
                id: 'x-padded',
                classes: 'tw-mod-x-padded',
            }),
            new Style({
                label: 'Y Padded',
                id: 'y-padded',
                classes: 'tw-mod-y-padded',
            }),
            new Style({
                label: 'Y Padded 2x',
                id: 'y-padded-2x',
                classes: 'tw-mod-y-padded-2x',
            }),
            new Style({
                label: 'Y Padded 3x',
                id: 'y-padded-3x',
                classes: 'tw-mod-y-padded-3x',
            }),
        ],
    });

    const finalStyleGroups = new ComponentStyle([styleGroup]);
    const componentPolicy = new ComponentPolicy({
        component: 'wcm/test/component',
        description: 'Default Policy for Component',
        policy: 'policy_default',
        styles: finalStyleGroups,
        title: 'Default Policy',
    });

    console.log(generateXML([componentPolicy], true));
}

runTest();
