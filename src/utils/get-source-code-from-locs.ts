import { Rule } from 'eslint';
import { getSourceCodeNewLineChar } from './get-source-code-new-line-char';
import { isSourceCodeUsingCR } from './is-source-code-using-cr';

type Loc = {
    line: number;
    column: number;
}

/**
 * Get the source code from the given locs. (locs are 0-based)
 */
export function getSourceCodeFromLocs(
    context: Rule.RuleContext,
    start: Loc,
    end: Loc,
): string {
    const lines = context.sourceCode.lines;
    const startLine = start.line;
    const endLine = end.line;

    if (startLine === endLine) {
        // Special case for CR where line always return 0 and column is the actual length
        if (isSourceCodeUsingCR(context)) {
            const codeWithLF = context.sourceCode.lines.join('\r');
            const newLinesInTagCode = codeWithLF.substring(0, end.column).split('\r').length;
            return codeWithLF.substring(start.column, end.column + newLinesInTagCode);
        }

        return lines[startLine].substring(start.column, end.column);
    }

    const startLineText = lines[startLine].substring(start.column);
    const endLineText = lines[endLine].substring(0, end.column);

    return [startLineText, ...lines.slice(startLine + 1, endLine), endLineText].join(getSourceCodeNewLineChar(context));
}
