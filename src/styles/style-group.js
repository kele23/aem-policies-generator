class StyleGroup {
    constructor({ label, allowMultiple = false, styles = [] }) {
        this.label = label;
        this.allowMultiple = allowMultiple;
        this.styles = styles;
    }

    format(output = 'xml') {
        return {
            attributes: {
                ['jcr:primaryType']: 'nt:unstructured',
                ['cq:styleGroupLabel']: this.label,
                ['cq:styleGroupMultiple']: this.allowMultiple,
            },
            ['cq:styles']: {
                attributes: {
                    'jcr:primaryType': 'nt:unstructured',
                },
                ...this._formatStyles(output),
            },
        };
    }

    _formatStyles(output) {
        let formattedStyles = {};
        this.styles.forEach((style, i) => (formattedStyles[`item${i}`] = style.format(output)));
        return formattedStyles;
    }

    addStyle(style) {
        this.styles.push(style);
    }
}

module.exports = { StyleGroup };
