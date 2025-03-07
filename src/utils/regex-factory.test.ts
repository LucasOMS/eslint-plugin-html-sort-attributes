// RegexFactory.test.js

import { RegexFactory } from './regex-factory';

describe('RegexFactory Tests', () => {
    test('Build', () => {
        const result = new RegexFactory().equals('equals');
        expect(result.build()).toBe('^equals$');
        expect(result.build({ forceStartAndEnd: true })).toBe('^equals$');

        const result2 = new RegexFactory().startsWith('start');
        expect(result2.build()).toBe('^start.*');
        // Force start and end boundaries
        expect(result2.build({ forceStartAndEnd: true })).toBe('^start.*$');
    });

    test('Use or to chain two regex', () => {
        let startWithA = new RegexFactory().startsWith('a');
        let endsWithB = new RegexFactory().endsWith('b');
        let containsC = new RegexFactory().contains('c');
        const fullChainSyntax = startWithA.or(endsWithB).or(containsC).build();

        expect(fullChainSyntax).toBe('((^a.*|.*b$)|.*c.*)');

        // Redefine everything because previous test changed the objects and or is not idempotent
        startWithA = new RegexFactory().startsWith('a');
        endsWithB = new RegexFactory().endsWith('b');
        containsC = new RegexFactory().contains('c');
        const innerOrSyntax = startWithA.or(endsWithB.or(containsC)).build();
        expect(innerOrSyntax).toBe('(^a.*|(.*b$|.*c.*))');
    });

    test('Equals', () => {
        const result = new RegexFactory().equals('a').build();
        expect(result).toBe('^a$');
    });

    test('Starts with', () => {
        const result = new RegexFactory().startsWith('a').build();
        expect(result).toBe('^a.*');

        const result2 = new RegexFactory().startsWith(['a', 'b']).build();
        expect(result2).toBe('^(a|b).*');
    });

    test('Ends with', () => {
        const result = new RegexFactory().endsWith('a').build();
        expect(result).toBe('.*a$');

        const result2 = new RegexFactory().endsWith(['a', 'b']).build();
        expect(result2).toBe('.*(a|b)$');
    });


    describe('Contains', () => {
        test('Without start nor end', () => {
            const result = new RegexFactory().contains('a').build();
            expect(result).toBe('.*a.*');
        });
        test('With start', () => {
            const result = new RegexFactory().contains('a').startsWith('start').build();
            expect(result).toBe('^start.*a.*');

            const result2 = new RegexFactory().contains('a').startsWith(['start', 'start2']).build();
            expect(result2).toBe('^(start|start2).*a.*');
        });
        test('With end', () => {
            const result = new RegexFactory().contains('a').endsWith('end').build();
            expect(result).toBe('.*a.*end$');

            const result2 = new RegexFactory().contains('a').endsWith(['end', 'end2']).build();
            expect(result2).toBe('.*a.*(end|end2)$');
        });
        test('With start and end', () => {
            const result = new RegexFactory().contains('a').startsWith('start').endsWith('end').build();
            expect(result).toBe('^start.*a.*end$');

            const result2 = new RegexFactory().contains('a').startsWith(['start', 'start2']).endsWith(['end', 'end2']).build();
            expect(result2).toBe('^(start|start2).*a.*(end|end2)$');
        });
    });

    test('Doesnt start with', () => {
        const result = new RegexFactory().doesntStartWith('notStart').build();
        expect(result).toBe('^(?!notStart).*');

        const result2 = new RegexFactory().doesntStartWith(['notStart', 'notStart2']).build();
        expect(result2).toBe('^(?!notStart\\b|notStart2\\b).*');

        const result3 = new RegexFactory().doesntStartWith(['notStart', 'notStart2'], false).build();
        expect(result3).toBe('^(?!notStart|notStart2).*');
    });

    test('Doesnt end with', () => {
        const result = new RegexFactory().doesntEndWith('notEnd').build();
        expect(result).toBe('.*(?!notEnd)$');

        const result2 = new RegexFactory().doesntEndWith(['notEnd', 'notEnd2']).build();
        expect(result2).toBe('.*(?!\\bnotEnd|\\bnotEnd2)$');

        const result3 = new RegexFactory().doesntEndWith(['notEnd', 'notEnd2'], false).build();
        expect(result3).toBe('.*(?!notEnd|notEnd2)$');
    });

    test('Has regex content', () => {
        const result = new RegexFactory().hasRegexContent(new RegexFactory().startsWith('a')).build();
        expect(result).toBe('^a.*');

        const result2 = new RegexFactory().hasRegexContent(new RegexFactory().startsWith('a').endsWith('b')).build();
        expect(result2).toBe('^a.*b$');

        const innerRegex = new RegexFactory().startsWith('a').contains('b').endsWith('c');
        const result3 = new RegexFactory().hasRegexContent(innerRegex).startsWith('start').build();
        expect(innerRegex.build()).toBe('^a.*b.*c$');
        expect(result3).toBe('^starta.*b.*c$');
    });

    describe('Error cases', () => {
        test('should throw an error if trying to build without starting with anything', () => {
            expect(() => new RegexFactory().build()).toThrow('Cannot build regex without any content');
        });

        test('should throw an error if defining start twice', () => {
            expect(() => new RegexFactory().startsWith('a').startsWith('b').build()).toThrow('Cannot set start multiple times');
            expect(() => new RegexFactory().doesntStartWith('a').startsWith('b').build()).toThrow('Cannot set start multiple times');
            expect(() => new RegexFactory().startsWith('a').doesntStartWith('b').build()).toThrow('Cannot set start multiple times');
            expect(() => new RegexFactory().doesntStartWith('a').doesntStartWith('b').build()).toThrow('Cannot set start multiple times');
        });

        test('should throw an error if defining end twice', () => {
            expect(() => new RegexFactory().endsWith('a').endsWith('b').build()).toThrow('Cannot set end multiple times');
            expect(() => new RegexFactory().doesntEndWith('a').endsWith('b').build()).toThrow('Cannot set end multiple times');
            expect(() => new RegexFactory().endsWith('a').doesntEndWith('b').build()).toThrow('Cannot set end multiple times');
            expect(() => new RegexFactory().doesntEndWith('a').doesntEndWith('b').build()).toThrow('Cannot set end multiple times');
        });

        test('Cannot set content multiple times', () => {
            expect(() => new RegexFactory().contains('a').contains('b').build()).toThrow('Cannot set content multiple times');
            expect(() => new RegexFactory().contains('a').hasRegexContent(new RegexFactory().startsWith('a')).build()).toThrow('Cannot set content multiple times');
            expect(() => new RegexFactory().contains('a').equals('b').build()).toThrow('Cannot set content multiple times');
        });

        test('Using equals should block all rewrite except or', () => {
            expect(() => new RegexFactory().equals('a').startsWith('b')).toThrow('Cannot change anything after setting equals');
            expect(() => new RegexFactory().equals('a').endsWith('b')).toThrow('Cannot change anything after setting equals');
            expect(() => new RegexFactory().equals('a').contains('b')).toThrow('Cannot change anything after setting equals');
            expect(() => new RegexFactory().equals('a').hasRegexContent(new RegexFactory().endsWith('a'))).toThrow('Cannot change anything after setting equals');

            expect(() => new RegexFactory().equals('a').or(new RegexFactory().startsWith('b'))).not.toThrow();
        });
    });
});
