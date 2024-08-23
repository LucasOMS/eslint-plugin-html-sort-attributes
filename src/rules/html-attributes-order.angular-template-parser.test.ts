import { RuleTester } from 'eslint';

import rule from './html-attributes-order';
import { valid } from '../tests/valid';
import { invalid } from '../tests/invalid';
import { prepareTestsWithCR, prepareTestsWithCRLF } from '../tests/prepare-test-with-crlf';

const testWithAngularTemplateParser = new RuleTester({
    parser: require.resolve('@angular-eslint/template-parser'),
});

testWithAngularTemplateParser.run('html-attributes-order/order with LF', rule, {
    valid,
    invalid,
});

testWithAngularTemplateParser.run('html-attributes-order/order with LF', rule, {
    valid,
    invalid,
});

testWithAngularTemplateParser.run('html-attributes-order/order with CRLF', rule, {
    valid: prepareTestsWithCRLF(valid),
    invalid: prepareTestsWithCRLF(invalid),
});

// TODO Support CR
// TODO Try to support mixed CR and LF
xdescribe('cr new line char', () => {
    testWithAngularTemplateParser.run('html-attributes-order/order with CR', rule, {
        valid: prepareTestsWithCR(valid),
        invalid: prepareTestsWithCR(invalid),
    });
});
