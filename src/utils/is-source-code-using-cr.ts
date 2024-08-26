import { Rule } from 'eslint';
import { CRLF } from './is-source-code-using-crlf';
import RuleContext = Rule.RuleContext;

export const CR = '\r';

export function isSourceCodeUsingCR(context: RuleContext): boolean {
    return context.sourceCode.text
        .replace(new RegExp(CRLF, 'g'), '__CRLF__')
        .includes(CR);
}
