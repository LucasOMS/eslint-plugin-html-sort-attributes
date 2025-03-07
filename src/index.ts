import htmlAttributesOrder from './rules/html-attributes-order';
import recommended from './configs/recommended';
import { RegexFactory } from './utils/regex-factory';

// Export our ESLint rules
export = {
    rules: {
        'order': htmlAttributesOrder,
    },
    configs: {
        recommended: recommended,
    },
    RegexFactory,
};
