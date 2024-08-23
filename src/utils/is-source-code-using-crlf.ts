import { Rule } from 'eslint';
import RuleContext = Rule.RuleContext;

export function isSourceCodeUsingCRLF(context: RuleContext): boolean {
    return context.sourceCode.text.includes('\r\n');
}
