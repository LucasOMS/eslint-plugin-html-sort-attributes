import { OrderRuleRegex } from '../types/order-rule-options';

export function alphabeticalErrorMessage(
    orderIsActive: boolean,
    matchedRegex: OrderRuleRegex | undefined,
): string {
    if (!orderIsActive) {
        return 'Attributes should be in alphabetical order';
    }

    const messageStart = `Attributes with same order rank should be in alphabetical order.`;
    if (matchedRegex) {
        `${ messageStart }\nMatched RegExp for previous and current attribute is \`${ matchedRegex.name }\``;
    }
    return messageStart + '\nBoth previous and current attribute did not match any regex.';
}

export function regexOrderErrorMessage(
    matchedRegexForFirstAttribute: OrderRuleRegex | undefined,
    matchedRegexForSecondAttribute: OrderRuleRegex | undefined,
): string {
    const messageStart = 'Attributes should follow given regex orders.';
    return `${ messageStart }\nPrevious attribute matched RegExp \`${ matchedRegexForFirstAttribute?.name ?? 'NONE' }\` and current attribute matched \`${ matchedRegexForSecondAttribute?.name ?? 'NONE' }\``;
}
