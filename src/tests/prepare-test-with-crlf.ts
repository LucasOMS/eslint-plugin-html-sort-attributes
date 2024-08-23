import { RuleTester } from 'eslint';
import ValidTestCase = RuleTester.ValidTestCase;
import InvalidTestCase = RuleTester.InvalidTestCase;

function keepMulipleLinesTests<T extends ValidTestCase | InvalidTestCase>(test: T): boolean {
    return test.code.includes('\n');
}

export function prepareTestsWithCRLF<T extends ValidTestCase | InvalidTestCase>(tests: T[]): T[] {
    return tests
        .filter(keepMulipleLinesTests)
        .map<T>((test: T): T => {
            return ({
                ...test,
                code: test.code.replace(/\n/g, '\r\n'),
                output: 'output' in test ? test.output?.replace(/\n/g, '\r\n') : undefined,
            });
        });
}

export function prepareTestsWithCR<T extends ValidTestCase | InvalidTestCase>(tests: T[]): T[] {
    return tests
        .filter(keepMulipleLinesTests)
        .map<T>((test: T): T => {
            return ({
                ...test,
                code: test.code.replace(/\n/g, '\r'),
                output: 'output' in test ? test.output?.replace(/\n/g, '\r') : undefined,
            });
        });
}

