import { Rule } from 'eslint';
import RuleContext = Rule.RuleContext;

/**
 * Get the character count up to a given location in the source code.
 *
 * Line and column numbers are 0-based.
 */
export function getCharCountToLoc(context: RuleContext, loc: { line: number, column: number }): number {
    const lines = context.sourceCode.lines;

    let totalCharCount = 0;
    for (let i = 0; i <= loc.line; ++i) {
        if (i === loc.line) {
            totalCharCount += loc.column;
        } else {
            totalCharCount += lines[i].length + 1; // +1 for the newline character
        }
    }

    return totalCharCount;
}
