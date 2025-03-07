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
                            'oneOf': [
                                {
                                    'type': 'string',
                                },
                                {
                                    'type': 'object',
                                    'properties': {
                                        'name': {
                                            'type': 'string',
                                        },
                                        'regex': {
                                            'type': 'string',
                                        },
                                    },
                                    'required': ['name', 'regex'],
                                    'additionalProperties': false,
                                },
                            ],
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
        const parser =
            context.parserPath // ESLint 8 way to get it
            ?? context.languageOptions?.parser?.meta?.name; // ESLint 9 way to get it

        if (!parser) {
            throw new Error('Parser is undefined');
        }

        if (parser.includes('angular-eslint')) {       // @angular-eslint/template-parser
            return htmlAttributesOrderRuleForAngularTemplateParser(context);
        } else if (parser.includes('html-eslint')) {   // @html-eslint/parser
            // Logique spécifique au parser HTML
            return htmlAttributesOrderRuleForHtmlParser(context);
        }
        throw new Error(`Unsupported parser, please use @angular-eslint/template-parser or @html-eslint/parser, current is ${parser}`);
    },
};

export = rule;
