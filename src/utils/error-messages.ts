export function alphabeticalErrorMessage(
    orderIsActive: boolean,
    matchedRegex: string | undefined,
): string {
    if (!orderIsActive) {
        return 'Attributes should be in alphabetical order';
    }

    const messageStart = `Attributes with same order rank should be in alphabetical order.`;
    if (matchedRegex) {
        `${messageStart}\nMatched RegExp for previous and current attribute is \`${matchedRegex}\``;
    }
    return messageStart + '\nBoth previous and current attribute did not match any regex.';
}

export function regexOrderErrorMessage(
    matchedRegexForFirstAttribute: string | undefined,
    matchedRegexForSecondAttribute: string | undefined,
): string {
    const messageStart = 'Attributes should follow given regex orders.';
    return `${messageStart}\nPrevious attribute matched RegExp \`${matchedRegexForFirstAttribute ?? 'NONE'}\` and current attribute matched \`${matchedRegexForSecondAttribute ?? 'NONE'}\``;
}
