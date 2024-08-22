import { Rule } from 'eslint';

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
        return lines[startLine].substring(start.column, end.column);
    }

    const startLineText = lines[startLine].substring(start.column);
    const endLineText = lines[endLine].substring(0, end.column);

    return [startLineText, ...lines.slice(startLine + 1, endLine), endLineText].join('\n');
}
