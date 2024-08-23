import { AST, Rule } from 'eslint';
import { getRegexOrder } from '../utils/get-regex-order';
import { getOptions } from '../utils/get-options';
import { isTagIgnored } from '../utils/is-tag-ignored';
import { OrderRuleOptions } from '../types/order-rule-options';
import { alphabeticalErrorMessage, regexOrderErrorMessage } from '../utils/error-messages';
import { getSourceCodeNewLineChar } from '../utils/get-source-code-new-line-char';
import Fix = Rule.Fix;
import RuleFixer = Rule.RuleFixer;

function getCodeForAttribute(context: Rule.RuleContext, node: any): string {
    return context.sourceCode.getText(node).trim();
}

function fixNode(context: Rule.RuleContext, rootNode: any, options: OrderRuleOptions) {
    return (fixer: RuleFixer): Fix => {
        const attributes = rootNode.attributes;
        const sortedAttributes = [...attributes].sort((a: any, b: any) => {
            const aRank = getRegexOrder(a.key.value, options.order);
            const bRank = getRegexOrder(b.key.value, options.order);

            if (options.alphabetical && aRank === bRank) {
                return a.key.value.localeCompare(b.key.value);
            }

            return aRank - bRank;
        });

        const wasMultiline = rootNode.openStart.loc.start.line !== rootNode.openEnd.loc.start.line;

        const lastAttribute = attributes[attributes.length - 1];
        const lastAttributeRangeEnd = lastAttribute.range[1];
        const range: AST.Range = [
            // Replace from the tag name opening
            rootNode.openStart.range[1],
            // To last attribute end (prevents from removing whitespace after the last attribute)
            lastAttributeRangeEnd,
        ];

        if (wasMultiline) {
            const firstAttributeWasOnNewLine =
                attributes[0].loc.start.line !== rootNode.openStart.loc.start.line;

            return fixer.replaceTextRange(
                range,
                (firstAttributeWasOnNewLine ? getSourceCodeNewLineChar(context) : ' ') +
                sortedAttributes
                    .map((a: any) => getCodeForAttribute(context, a))

                    // Restore the indentation of the attributes
                    .map((attributeCode: string, index: number) => {
                        if (index === 0 && !firstAttributeWasOnNewLine) {
                            return attributeCode;
                        }

                        const secondAttributeLoc = attributes[1].loc;
                        const secondAttributeLine = context.sourceCode.lines[secondAttributeLoc.start.line - 1];
                        const secondAttributeLineStart = secondAttributeLine.slice(0, secondAttributeLoc.start.column);

                        return secondAttributeLineStart + attributeCode;
                    })
                    .join(getSourceCodeNewLineChar(context)),
            );
        }

        return fixer.replaceTextRange(
            range,
            ' ' + sortedAttributes
                .map((a: any) => getCodeForAttribute(context, a))
                .join(' '),
        );
    };
}

export function htmlAttributesOrderRuleForHtmlParser(context: any) {
    return {
        Tag: (node: any) => {
            // Skip excluded tags
            if (isTagIgnored(node.name)) {
                return;
            }

            const attributes = node.attributes;
            if (attributes.length < 2) {
                return;
            }

            const options: OrderRuleOptions = getOptions(context);

            let previousAttribute = attributes[0];
            let previousAttributeName = previousAttribute.key.value;
            let previousAttributeRegexRank: number = getRegexOrder(previousAttribute.key.value, options.order);

            for (const attribute of attributes.slice(1)) {
                const currentAttributeName = attribute.key.value;

                // Compute rank for each attribute based on the order option
                let attributeRegexRank = getRegexOrder(currentAttributeName, options.order);

                if (previousAttributeRegexRank > attributeRegexRank) {
                    context.report({
                        message: regexOrderErrorMessage(
                            options.order[previousAttributeRegexRank],
                            options.order[attributeRegexRank],
                        ),
                        fix: fixNode(context, node, options),
                        loc: {
                            start: attribute.loc.start,
                            end: {
                                line: attribute.loc.start.line,
                                column: attribute.loc.start.column + currentAttributeName.length,
                            },
                        },
                    });
                    return;
                }

                if (options.alphabetical && previousAttributeRegexRank === attributeRegexRank) {
                    // Compare current attribute with previous attribute
                    if (previousAttributeName.localeCompare(currentAttributeName) === 1) {
                        context.report({
                            message: alphabeticalErrorMessage(
                                options.order.length > 0,
                                options.order[attributeRegexRank],
                            ),
                            fix: fixNode(context, node, options),
                            loc: {
                                start: attribute.loc.start,
                                end: {
                                    line: attribute.loc.start.line,
                                    column: attribute.loc.start.column + currentAttributeName.length,
                                },
                            },
                        });
                        return;
                    }
                }

                previousAttribute = attribute;
                previousAttributeName = currentAttributeName;
                previousAttributeRegexRank = attributeRegexRank;
            }
        },
    };
}
