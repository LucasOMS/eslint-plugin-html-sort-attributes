import htmlAttributesOrder from './rules/html-attributes-order';
import recommended from './configs/recommended';

// Export our ESLint rules
export = {
    rules: {
        'order': htmlAttributesOrder,
    },
    configs: {
        recommended: recommended,
    },
};
