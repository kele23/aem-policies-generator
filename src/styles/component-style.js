class ComponentStyle {
    constructor(items = []) {
        this.items = items;
    }

    addStyleGroup(styleGroup) {
        this.items.push(styleGroup);
    }

    format(output = 'xml', theme = {}) {
        if (output === 'xml') {
            return {
                attributes: { 'jcr:primaryType': 'nt:unstructured' },
                ...this._formatItems(output, theme),
            };
        } else if (output === 'json') {
            return {
                ['jcr:primaryType']: 'nt:unstructured',
                ...this._formatItems(output, theme),
            };
        }
    }

    _formatItems(output, theme) {
        let formattedItems = {};
        this.items.forEach((item, i) => {
            if (typeof item === 'function') {
                formattedItems[`item${i}`] = item(theme).format(output);
            } else if (typeof item.format === 'function') formattedItems[`item${i}`] = item.format(output);
        });
        return formattedItems;
    }
}

module.exports = { ComponentStyle };
