import { SourceLocation } from 'estree';
import { Rule } from 'eslint';
import { isSourceCodeUsingCR } from './is-source-code-using-cr';
import { getCharCountToLoc } from './get-char-count-to-loc';
import RuleContext = Rule.RuleContext;

export type Location = {
    line: number;
    column: number;
};

type ShortenFormatLocation = {
    line: number;
    col: number;
};

export function unifyLocation(loc: Location | ShortenFormatLocation): Location {
    return {
        line: loc.line,
        column: 'col' in loc ? loc.col : loc.column,
    };
}

export function toOneBasedLocation(loc: Location): Location {
    return {
        line: loc.line + 1,
        column: loc.column + 1,
    };
}

export function sourceLocationFromLocation(startLocation: Location, subCodeSourceLocation: SourceLocation, context: RuleContext): SourceLocation {

    if (isSourceCodeUsingCR(context)) {
        let crCountBeforeTagStart = context.sourceCode.text
            .substring(0, getCharCountToLoc(context, startLocation))
            .split('\r').length - 1;

        // With CR parsing, will always be on the same line, subcode is always right on column location
        return {
            start: {
                line: crCountBeforeTagStart + subCodeSourceLocation.start.line,
                column: subCodeSourceLocation.start.column,
            },
            end: {
                line: crCountBeforeTagStart + subCodeSourceLocation.end.line,
                column: subCodeSourceLocation.end.column,
            },
        };
    }

    const startOnSameLine = startLocation.line === subCodeSourceLocation.start.line;
    const endOnSameLine = startLocation.line === subCodeSourceLocation.end.line;
    return {
        start: {
            line: startLocation.line + subCodeSourceLocation.start.line,
            column: startOnSameLine
                ? startLocation.column + subCodeSourceLocation.start.column
                : subCodeSourceLocation.start.column,
        },
        end: {
            line: startLocation.line + subCodeSourceLocation.end.line,
            column: endOnSameLine
                ? startLocation.column + subCodeSourceLocation.end.column
                : subCodeSourceLocation.end.column,
        },
    };
}


