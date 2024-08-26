import { Rule } from 'eslint';
import { CRLF, isSourceCodeUsingCRLF } from './is-source-code-using-crlf';
import { CR, isSourceCodeUsingCR } from './is-source-code-using-cr';
import RuleContext = Rule.RuleContext;

type NewLineChar = '\n' | typeof CR | typeof CRLF;

export function getSourceCodeNewLineChar(context: RuleContext): NewLineChar {
    if (isSourceCodeUsingCRLF(context)) {
        return CRLF;
    }
    if (isSourceCodeUsingCR(context)) {
        return CR;
    }
    return '\n';
}
