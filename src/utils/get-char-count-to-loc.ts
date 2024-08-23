import { Rule } from 'eslint';
import { getSourceCodeNewLineChar } from './get-source-code-new-line-char';
import RuleContext = Rule.RuleContext;

/**
 * Get the character count up to a given location in the source code.
 *
 * Line and column numbers are 0-based.
 */
export function getCharCountToLoc(context: RuleContext, loc: { line: number, column: number }): number {
    const lines = context.sourceCode.lines;

    // FIXME Consider a fix checking endline for each line instead of considering everything is CRLF or not
    // Determine the newline character length depending on the source code encoding (Windows or Unix like OS)
    const newLineLength = getSourceCodeNewLineChar(context).length;

    let totalCharCount = 0;
    for (let i = 0; i <= loc.line; ++i) {
        if (i === loc.line) {
            totalCharCount += loc.column;
        } else {
            totalCharCount += lines[i].length + newLineLength;
        }
    }

    return totalCharCount;
}
