import { OrderRuleRegex } from '../types/order-rule-options';

export function getRegexOrder(attributeName: string, order: OrderRuleRegex[]): number {
    const res = order.findIndex((orderRuleRegex) => new RegExp(orderRuleRegex.regex).test(attributeName));
    return res === -1 ? order.length : res;
}
