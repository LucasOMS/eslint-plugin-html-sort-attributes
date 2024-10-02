export type OrderRuleOptions = {
    alphabetical: boolean;
    order: OrderRuleRegex[];
}

export interface OrderRuleRegex {
    name: string;
    regex: string;
}
