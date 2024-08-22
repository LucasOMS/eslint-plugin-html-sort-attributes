import { RuleTester } from 'eslint';

import rule from './html-attributes-order';
import { valid } from '../tests/valid';
import { invalid } from '../tests/invalid';

const testWithAngularTemplateParser = new RuleTester({
    parser: require.resolve('@angular-eslint/template-parser'),
});

testWithAngularTemplateParser.run('html-attributes-order/order', rule, {
    valid,
    invalid,
});
