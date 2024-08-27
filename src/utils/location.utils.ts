import { SourceLocation } from 'estree';
import { Rule } from 'eslint';
import { isSourceCodeUsingCR } from './is-source-code-using-cr';
import { getCharCountToLoc } from './get-char-count-to-loc';
import RuleContext = Rule.RuleContext;

/**
 * Can be 0-based or 1-based depending on the parser
 * See comments to know which one is used on each part of the code
 */
export type Location = {
    line: number;
    column: number;
};

type ShortenFormatLocation = {
    line: number;
    col: number;
};

/**
 * Return Location from different format from different parsers
 */
export function unifyLocation(loc: Location | ShortenFormatLocation): Location {
    return {
        line: loc.line,
        column: 'col' in loc ? loc.col : loc.column,
    };
}

/**
 * @param {Location} startLocation line should be 1-based and column should be 0-based
 * @param {SourceLocation} subCodeSourceLocation
 * @param {Rule.RuleContext} context
 * @returns {SourceLocation}
 */
export function sourceLocationFromLocation(startLocation: Location, subCodeSourceLocation: SourceLocation, context: RuleContext): SourceLocation {
    const startOnSameLine = subCodeSourceLocation.start.line === 1;
    const endOnSameLine = subCodeSourceLocation.end.line === 1;

    if (isSourceCodeUsingCR(context)) {
        let crCountBeforeTagStart = context.sourceCode.text
            .substring(0, getCharCountToLoc(context, {
                line: startLocation.line - 1, // Reduce by one because lines are 1-based
                column: startLocation.column,
            }))
            .split('\r').length - 1;

        // With CR parsing, will always be on the same line, subcode is always right on column location
        return {
            start: {
                line: crCountBeforeTagStart + subCodeSourceLocation.start.line,
                column: subCodeSourceLocation.start.column
                    + (startOnSameLine ? crCountBeforeTagStart : 0),
            },
            end: {
                line: crCountBeforeTagStart + subCodeSourceLocation.end.line,
                column: subCodeSourceLocation.end.column
                    + (endOnSameLine ? crCountBeforeTagStart : 0),
            },
        };
    }

    return {
        start: {
            line: startOnSameLine
                ? startLocation.line
                : startLocation.line - 1 + subCodeSourceLocation.start.line, // Minus one because bot lines are 1-based
            column: startOnSameLine
                ? startLocation.column + subCodeSourceLocation.start.column
                : subCodeSourceLocation.start.column,
        },
        end: {
            line: endOnSameLine
                ? startLocation.line
                : startLocation.line - 1 + subCodeSourceLocation.end.line, // Minus one because bot lines are 1-based
            column: endOnSameLine
                ? startLocation.column + subCodeSourceLocation.end.column
                : subCodeSourceLocation.end.column,
        },
    };
}

/**
 * Returns a new location with the line incremented by one.
 */
export function incrLine(loc: Location): Location {
    return {
        line: loc.line + 1,
        column: loc.column,
    };
}
