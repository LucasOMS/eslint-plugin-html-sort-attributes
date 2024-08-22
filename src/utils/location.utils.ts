import { SourceLocation } from 'estree';

export type Location = {
    line: number;
    column: number;
};

type ShortenFormatLocation = {
    line: number;
    col: number;
};

// TODO Use this to simplify code in the angular template rule implementation
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

export function sourceLocationFromLocation(startLocation: Location, subCodeSourceLocation: SourceLocation): SourceLocation {
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


