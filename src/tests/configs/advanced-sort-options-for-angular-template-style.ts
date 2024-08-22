import { TestCaseOptions } from '../create-test-case';

/**
 * Complex regex order for Angular template style for advanced cases
 */
export const advancedSortOptionsForAngularTemplateStyle: TestCaseOptions = {
    alphabetical: true,
    regexOrder: [
        // Template name
        '^\\#.*$',
        // Structural directive
        '^\\*.*$',
        // Output
        '^\\(.*\\)$',
        // Input other than class and style
        '^\\[(?!@|class|ngClass|style|ngStyle)[^\\]]+\\]$',
        // Animations with state
        '^\\[\\@.*\\]$',
        // Animations without state
        '^\\@.*$',
        // Attributes other than class and style
        '^(?!class|style|\\[class|\\[style|\\[ngClass|\\[ngStyle).*$',
        // Classes
        '^class$',
        '^\\[class.*\\]$',
        '^\\[ngClass\\]$',
        // Inline styles
        '^style$',
        '^\\[style.*\\]$',
        '^\\[ngStyle\\]$',
    ],
};
