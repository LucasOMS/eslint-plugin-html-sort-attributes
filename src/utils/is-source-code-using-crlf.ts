import { Rule } from 'eslint';
import RuleContext = Rule.RuleContext;

export const CRLF = '\r\n';

export function isSourceCodeUsingCRLF(context: RuleContext): boolean {
    return context.sourceCode.text.includes(CRLF);
}
