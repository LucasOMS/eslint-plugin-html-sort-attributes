import { OrderRuleOptions, OrderRuleRegex } from '../types/order-rule-options';

export function getOptions(context: any): OrderRuleOptions {
    const res = {
        alphabetical: false,
        order: [],
        ...(context.options[0] ?? {}),
    };

    return {
        ...res,
        order: res.order.map(regexOrNamedRegexToOrderRuleRegex),
    };
}

export function regexOrNamedRegexToOrderRuleRegex(item: string | OrderRuleRegex): OrderRuleRegex {
    if (typeof item === 'string') {
        return {
            name: item,
            regex: item,
        };
    }
    return item;
}
