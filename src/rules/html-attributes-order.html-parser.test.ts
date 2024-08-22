import { RuleTester } from 'eslint';
import rule from './html-attributes-order';
import { valid } from '../tests/valid';
import { invalid } from '../tests/invalid';

const testWithHtmlParser = new RuleTester({
    parser: require.resolve('@html-eslint/parser'),
});

testWithHtmlParser.run('html-attributes-order/order', rule, {
    valid,
    invalid,
});
