import { Rule } from 'eslint';
import { isTagIgnored } from '../utils/is-tag-ignored';
import { incrLine, sourceLocationFromLocation, unifyLocation } from '../utils/location.utils';
import * as htmlParser from '@html-eslint/parser';
import { getSourceCodeFromLocs } from '../utils/get-source-code-from-locs';
import { getRegexOrder } from '../utils/get-regex-order';
import { OrderRuleOptions } from '../types/order-rule-options';
import { getOptions } from '../utils/get-options';
import { alphabeticalErrorMessage, regexOrderErrorMessage } from '../utils/error-messages';
import { getSourceCodeNewLineChar } from '../utils/get-source-code-new-line-char';
import { getCharCountToLoc } from '../utils/get-char-count-to-loc';
import { isSourceCodeUsingCR } from '../utils/is-source-code-using-cr';
import { getRealLineFromColumnWithCR } from '../utils/get-real-line-from-column-with-cr';
import RuleContext = Rule.RuleContext;

type AttributeMetadata = {
    name: string;
    value: string | undefined;
};

function getRearrangeAttributesFixer(
    context: Rule.RuleContext,
    attributesWithValue: Map<any, AttributeMetadata>,
    rangeToReplace: [number, number],
    options: OrderRuleOptions,
    wholeTagIndentation: number): (fixer: Rule.RuleFixer) => Rule.Fix {
    return (fixer: Rule.RuleFixer): Rule.Fix => {
        const attributes = Array.from(attributesWithValue.keys());

        const attributesAreOnMultipleLines =
            attributes[0].loc.start.line !== attributes[attributes.length - 1].loc.start.line;

        const sortedAttributes = [...attributes].sort((a: any, b: any) => {
            const aRank = getRegexOrder(attributesWithValue.get(a)?.name!, options.order);
            const bRank = getRegexOrder(attributesWithValue.get(b)?.name!, options.order);

            if (options.alphabetical && aRank === bRank) {
                return attributesWithValue.get(a)!.name.localeCompare(attributesWithValue.get(b)!.name);
            }

            return aRank - bRank;
        });

        const code = sortedAttributes
            .map(attribute => {
                const metadata = attributesWithValue.get(attribute)!;
                if (metadata.value !== null && metadata.value !== undefined) {
                    return `${metadata.name}="${metadata.value}"`;
                }
                return metadata.name;
            })
            .map((attributeCode: string, index: number) => {
                // If attributes are on same line, we don't need to add any indentation
                if (!attributesAreOnMultipleLines) {
                    return attributeCode;
                }
                // Always skip first because first attribute is always properly indented because we start replacing from it
                if (index === 0) {
                    return attributeCode;
                }

                let mostLeftAttributeOffset = attributes.reduce((min, curr) => min < curr.loc.start.column ? min : curr.loc.start.column, Number.MAX_SAFE_INTEGER);

                if (isSourceCodeUsingCR(context)) {
                    const attributesCode = context.sourceCode.text.slice(rangeToReplace[0], rangeToReplace[1]);
                    const attributesLines = attributesCode.split('\r');
                    const indentationSearch = attributesLines
                        .slice(1)
                        .map(attributeLine => {
                            const match = attributeLine.match(/^\s+/);
                            return match ? match[0].length : Number.MAX_SAFE_INTEGER;
                        });

                    const indentationCount = Math.min(...indentationSearch);

                    return ' '.repeat(indentationCount) + attributeCode;
                }

                // If first attribute is on the same line as tag open, columns don't include whole tag indentation
                // so we need to add it manually
                const firstAttributeIsOnTagOpenLine = attributes[0].loc.start.line === 1;
                const indentOffset = firstAttributeIsOnTagOpenLine ? wholeTagIndentation : 0;

                return ' '.repeat(indentOffset + mostLeftAttributeOffset) + attributeCode;
            })
            .join(attributesAreOnMultipleLines ? getSourceCodeNewLineChar(context) : ' ');

        return fixer.replaceTextRange(rangeToReplace, code);
    };
}

/**
 * Rule for Angular template parser
 */
export function htmlAttributesOrderRuleForAngularTemplateParser(context: RuleContext) {
    return {
        // Because structural directive usage generates Template having Element$1 as only child,
        // we exclude this specific case from selector otherwise the rule will be applied twice :
        // once on the Template and once on the Element$1
        ':not(Template) > Element$1, Template': (elementOrTemplate: any) => {
            // Skip excluded tags
            const tagName = elementOrTemplate.tagName ?? elementOrTemplate.name;
            if (isTagIgnored(tagName)) {
                return;
            }

            const tagStartZeroBased = unifyLocation(elementOrTemplate.sourceSpan.start);
            const tagEndZeroBased = unifyLocation(elementOrTemplate.sourceSpan.end);
            const tagCode = getSourceCodeFromLocs(context, tagStartZeroBased, tagEndZeroBased);

            let wholeTagIndentation = tagStartZeroBased.column;
            if (isSourceCodeUsingCR(context)) {
                const realLine = getRealLineFromColumnWithCR(context, tagStartZeroBased.column);
                const originalFirstLineOfTag = context.sourceCode.lines[realLine];
                const indentationMatch = originalFirstLineOfTag.match(/^\s+/);
                wholeTagIndentation = indentationMatch ? indentationMatch[0].length : 0;
            }

            const htmlParsed = htmlParser.parseForESLint(tagCode);
            const directChildrenTokens = htmlParsed.ast.tokens;
            const tagEnd = directChildrenTokens.findIndex((token: any) => token.type === 'OpenTagEnd');
            const tokensInTagOpening = directChildrenTokens.slice(0, tagEnd);
            const attributesKeyValue = tokensInTagOpening.filter((token: any) => token.type === 'AttributeKey' || token.type === 'AttributeValue');

            const metadataByAttribute = new Map<any, AttributeMetadata>();
            for (const keyOrValueToken of attributesKeyValue) {
                if (keyOrValueToken.type === 'AttributeKey') {
                    metadataByAttribute.set(keyOrValueToken, { name: keyOrValueToken.value, value: undefined });
                } else {
                    const previousAttribute = Array.from(metadataByAttribute.keys()).pop();
                    const metadata = metadataByAttribute.get(previousAttribute)!;
                    metadataByAttribute.set(previousAttribute, { ...metadata, value: keyOrValueToken.value });
                }
            }

            const attributes = Array.from(metadataByAttribute.keys());

            if (attributes.length < 2) {
                return;
            }

            const options: OrderRuleOptions = getOptions(context);

            const lastTokenIsValue = attributesKeyValue[attributesKeyValue.length - 1].type === 'AttributeValue';

            const offsetInFile = getCharCountToLoc(context, tagStartZeroBased);

            const rangeToReplace: [number, number] = [
                offsetInFile
                + attributesKeyValue[0].range[0],
                offsetInFile
                + attributesKeyValue[attributesKeyValue.length - 1].range[1]
                + (lastTokenIsValue ? 1 : 0), // If last token is value, we need to add 1 to the range to include the last quote
            ];

            let previousAttribute = attributes[0];
            let previousAttributeName = metadataByAttribute.get(previousAttribute)?.name!;
            let previousAttributeRegexRank: number = getRegexOrder(previousAttributeName, options.order);

            for (const attribute of attributes.slice(1)) {
                const currentAttributeName = metadataByAttribute.get(attribute)?.name!;

                // Compute rank for each attribute based on the order option
                const attributeRegexRank = getRegexOrder(currentAttributeName, options.order);

                if (previousAttributeRegexRank > attributeRegexRank) {
                    context.report({
                        message: regexOrderErrorMessage(
                            options.order[previousAttributeRegexRank],
                            options.order[attributeRegexRank],
                        ),
                        fix: getRearrangeAttributesFixer(
                            context,
                            metadataByAttribute,
                            rangeToReplace,
                            options,
                            wholeTagIndentation,
                        ),
                        loc: sourceLocationFromLocation(
                            incrLine(tagStartZeroBased),
                            attribute.loc,
                            context,
                        ),
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
                            fix: getRearrangeAttributesFixer(
                                context,
                                metadataByAttribute,
                                rangeToReplace,
                                options,
                                wholeTagIndentation,
                            ),
                            loc: sourceLocationFromLocation(
                                incrLine(tagStartZeroBased),
                                attribute.loc,
                                context,
                            ),
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
