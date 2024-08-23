import { RuleTester } from 'eslint';
import rule from './html-attributes-order';
import { valid } from '../tests/valid';
import { invalid } from '../tests/invalid';
import { prepareTestsWithCRLF } from '../tests/prepare-test-with-crlf';

const testWithHtmlParser = new RuleTester({
    parser: require.resolve('@html-eslint/parser'),
});

testWithHtmlParser.run('html-attributes-order/order', rule, {
    valid,
    invalid,
});

testWithHtmlParser.run('html-attributes-order/order with CRLF', rule, {
    valid: prepareTestsWithCRLF(valid),
    invalid: prepareTestsWithCRLF(invalid),
});
