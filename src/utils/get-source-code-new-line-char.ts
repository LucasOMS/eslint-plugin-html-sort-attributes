import { Rule } from 'eslint';
import { isSourceCodeUsingCRLF } from './is-source-code-using-crlf';
import RuleContext = Rule.RuleContext;

type NewLineChar = '\n' | '\r' | '\r\n';

export function getSourceCodeNewLineChar(context: RuleContext): NewLineChar {
    if (isSourceCodeUsingCRLF(context)) {
        return '\r\n';
    }
    if (context.sourceCode.text.includes('\r')) {
        return '\r';
    }
    return '\n';
}
