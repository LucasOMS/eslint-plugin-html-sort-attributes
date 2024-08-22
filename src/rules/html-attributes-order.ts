import { Rule } from 'eslint';
import { htmlAttributesOrderRuleForAngularTemplateParser } from './html-attributes-order.angular-template-parser';
import { htmlAttributesOrderRuleForHtmlParser } from './html-attributes-order.html-parser';

const rule: Rule.RuleModule = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Force attributes to be in a certain order base on regex and/or alphabetical order',
            category: 'Best Practices',
            recommended: true,
        },
        fixable: 'code',
        schema: [
            {
                'type': 'object',
                'properties': {
                    'alphabetical': {
                        'type': 'boolean',
                        'default': false,
                    },
                    'order': {
                        'type': 'array',
                        'items': {
                            'type': 'string',
                        },
                        'default': [],
                    },
                },
                'additionalProperties': false,
            },
        ],
    },
    create: context => {
        // Check which parser is being used
        const parser = context.parserPath ?? '';

        // Exemple de vérification du parser utilisé
        if (parser.includes('@angular-eslint')) {
            // Logique spécifique au parser Angular
            return htmlAttributesOrderRuleForAngularTemplateParser(context);
        } else if (parser.includes('@html-eslint')) {
            // Logique spécifique au parser HTML
            return htmlAttributesOrderRuleForHtmlParser(context);
        } else {
            // Pour d'autres parsers, vous pourriez lever une exception ou fournir un fallback
            return {};
        }
    },
};

export = rule;
