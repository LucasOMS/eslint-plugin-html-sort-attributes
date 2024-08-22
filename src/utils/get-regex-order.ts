export function getRegexOrder(attributeName: string, order: string[]): number {
    const res = order.findIndex((regex) => new RegExp(regex).test(attributeName));
    return res === -1 ? order.length : res;
}
