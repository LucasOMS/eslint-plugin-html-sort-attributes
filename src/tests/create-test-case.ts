import { RuleTester } from 'eslint';
import { alphabeticalErrorMessage, regexOrderErrorMessage } from '../utils/error-messages';
import { OrderRuleRegex } from '../types/order-rule-options';
import { regexOrNamedRegexToOrderRuleRegex } from '../utils/get-options';
import InvalidTestCase = RuleTester.InvalidTestCase;
import ValidTestCase = RuleTester.ValidTestCase;

export interface TestCaseOptions {
    regexOrder?: (string | OrderRuleRegex)[],
    alphabetical?: boolean,
}

export function createValidTestCase(options: TestCaseOptions, code: string): ValidTestCase {
    return {
        options: [{
            order: options.regexOrder ?? [],
            alphabetical: options.alphabetical ?? false,
        }],
        code: code,
    };
}

type InvalidTestCaseOptions = AlphabeticalErrorConfig | RegexOrderErrorConfig;

interface AlphabeticalErrorConfig {
    type: 'alphabetical',
    attributeInError: string,
    attributeInErrorMatchedRegex: string | undefined,
}

interface RegexOrderErrorConfig {
    type: 'order',
    attributeInError: string,
    attributeInErrorMatchedRegex: string | undefined,
    previousAttributeMatchedRegex: string | undefined,
}

export function createInvalidTestCase(
    options: TestCaseOptions,
    code: string,
    output: string,
    error: InvalidTestCaseOptions,
): InvalidTestCase {
    const order = options.regexOrder ?? [];
    let message: string;
    if (error.type === 'order') {
        message = regexOrderErrorMessage(
            getOrderRuleRegex(error.previousAttributeMatchedRegex),
            getOrderRuleRegex(error.attributeInErrorMatchedRegex),
        );
    } else {
        message = alphabeticalErrorMessage(
            order.length > 0,
            getOrderRuleRegex(error.attributeInErrorMatchedRegex),
        );
    }
    const codeLines = code.split('\n');
    const attributeInErrorLine = codeLines.findIndex((line) => line.includes(error.attributeInError)) + 1;
    if (attributeInErrorLine === 0) {
        throw new Error(`Attribute ${ error.attributeInError } not found in code`);
    }
    const attributeInErrorColumn = codeLines[attributeInErrorLine - 1].indexOf(error.attributeInError) + 1;

    return {
        options: [{
            order,
            alphabetical: options.alphabetical ?? false,
        }],
        code: code,
        output: output,
        errors: [
            {
                message,
                column: attributeInErrorColumn,
                line: attributeInErrorLine,
                endColumn: attributeInErrorColumn + error.attributeInError.length,
                endLine: attributeInErrorLine,
            },
        ],
    };

    function getOrderRuleRegex(regex: string | undefined): OrderRuleRegex | undefined {
        if (!regex) {
            return undefined;
        }
        return {
            name: options?.regexOrder?.map(regexOrNamedRegexToOrderRuleRegex)?.find(o => {
                if (typeof o === 'string') {
                    return o === regex;
                }
                return o.regex === regex;
            })?.name ?? regex,
            regex: regex,
        };
    }
}
