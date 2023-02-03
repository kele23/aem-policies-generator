const jcrPrimaryType = { 'jcr:primaryType': 'nt:unstructured' };

class ComponentPolicy {
    constructor({ policy, title, description, styles, component, attributes, configurations }) {
        this.policy = policy;
        this.title = title;
        this.description = description || null;
        this.styles = styles || null;
        this.component = component;
        this.attributes = attributes;
        this.configurations = configurations;
    }

    format(includeResourceType = true, theme) {
        const policy = {
            [this.policy]: {
                attributes: {
                    ...jcrPrimaryType,
                    'sling:resourceType': 'wcm/core/components/policy/policy',
                    'jcr:title': this.title,
                    'jcr:description': this.description,
                    ...this._formatAttributes(),
                },
                'jcr:content': {
                    attributes: jcrPrimaryType,
                },
                ...this._formatStyleGroups(theme),
                ...this._formatConfigurations(this.configurations),
            },
        };

        if (includeResourceType) return { [this.component]: policy };
        else return policy;
    }

    _formatAttributes() {
        for (let key in this.attributes) {
            let value = this.attributes[key];

            if (typeof this.attributes[key] == 'object') {
                if (Array.isArray(this.attributes[key])) this.attributes[key] = `[${value.join(',')}]`;
            } else {
                this.attributes[key] = value.toString();
            }
        }

        return this.attributes;
    }

    _formatStyleGroups(theme) {
        if (this.styles === null) return false;
        return {
            'cq:styleGroups': {
                attributes: jcrPrimaryType,
                ...this.styles.format('xml', theme),
            },
        };
    }

    _formatConfigurations(configuration) {
        for (let key in configuration) {
            if (typeof configuration[key] === 'object' && key !== 'attributes') {
                if (configuration[key].attributes) {
                    if (!configuration[key].attributes['jcr:primaryType']) {
                        configuration[key].attributes['jcr:primaryType'] = 'nt:unstructured';
                    }
                } else {
                    configuration[key].attributes = { 'jcr:primaryType': 'nt:unstructured' };
                }
                this._formatConfigurations(configuration[key]);
            }
        }
        return configuration;
    }
}

module.exports = { ComponentPolicy };
