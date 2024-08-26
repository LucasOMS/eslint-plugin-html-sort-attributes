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

        if (parser.includes('@angular-eslint')) {       // @angular-eslint/template-parser
            return htmlAttributesOrderRuleForAngularTemplateParser(context);
        } else if (parser.includes('@html-eslint')) {   // @html-eslint/parser
            // Logique spécifique au parser HTML
            return htmlAttributesOrderRuleForHtmlParser(context);
        } else {
            // If the parser is not supported, return an empty object to avoid any errors, no rule will be applied
            return {};
        }
    },
};

export = rule;
