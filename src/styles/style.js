class Style {
    constructor({ id, label, classes, element }) {
        this.id = id;
        this.label = label;
        this.classes = classes;
        this.element = element;
    }

    format(output = 'xml') {
        let attributes = {
            'jcr:primaryType': 'nt:unstructured',
            'cq:styleId': this.id,
            'cq:styleLabel': this.label,
            'cq:styleClasses': this.classes,
        };
        if (this.element) attributes.element = this.element;
        if (output === 'xml') attributes = { attributes: attributes };
        return attributes;
    }
}

module.exports = { Style };
