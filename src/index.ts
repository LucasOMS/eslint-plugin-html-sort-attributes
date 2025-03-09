import htmlAttributesOrder from './rules/html-attributes-order';
import recommended from './configs/recommended';
import { RegexBuilder } from './utils/regex-builder';

// Export our ESLint rules
export = {
    rules: {
        'order': htmlAttributesOrder,
    },
    configs: {
        recommended: recommended,
    },
    RegexBuilder,
};
