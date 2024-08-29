import { Rule } from 'eslint';
import RuleContext = Rule.RuleContext;

/**
 * When using CR, the line number is always 0 and the column is the actual length.
 * Because of this, we need to calculate the real line number by counting the number of CRs before the tag start.
 */
export function getRealLineFromColumnWithCR(context: RuleContext, index: number): number {
    // CR must be added because excluded in column
    const crInCodeStart = context.sourceCode.text.substring(0, index).split('\r').length - 1;
    const codeToColumn = context.sourceCode.text.substring(0, index + crInCodeStart);

    // Minus 1 because split returns one more element than the number of separators
    return codeToColumn.split('\r').length - 1;
}
