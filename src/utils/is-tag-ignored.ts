export function isTagIgnored(tagName: string): boolean {
    // Ignore svg is mandatory because it's a special tag that can have unhandled attributes name format such as xml:space
    return ['script', 'style', 'meta', 'head', ':svg:svg'].includes(tagName);
}
