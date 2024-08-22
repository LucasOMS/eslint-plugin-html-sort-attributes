import { OrderRuleOptions } from '../types/order-rule-options';

export function getOptions(context: any): OrderRuleOptions {
    return {
        alphabetical: false,
        order: [],
        ...(context.options[0] ?? {}),
    };
}
