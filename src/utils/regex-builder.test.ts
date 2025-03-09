import { RegexBuilder } from './regex-builder';

describe('RegexBuilder Tests', () => {
    test('Build', () => {
        const result = new RegexBuilder().equals('equals');
        expect(result.build()).toBe('^equals$');
        expect(result.build({ forceStartAndEnd: true })).toBe('^equals$');

        const result2 = new RegexBuilder().startsWith('start');
        expect(result2.build()).toBe('^start.*');
        // Force start and end boundaries
        expect(result2.build({ forceStartAndEnd: true })).toBe('^start.*$');
    });

    test('Use or to chain two regex', () => {
        let startWithA = new RegexBuilder().startsWith('a');
        let endsWithB = new RegexBuilder().endsWith('b');
        let containsC = new RegexBuilder().contains('c');
        const fullChainSyntax = startWithA.or(endsWithB).or(containsC).build();

        expect(fullChainSyntax).toBe('((^a.*|.*b$)|.*c.*)');

        // Redefine everything because previous test changed the objects and or is not idempotent
        startWithA = new RegexBuilder().startsWith('a');
        endsWithB = new RegexBuilder().endsWith('b');
        containsC = new RegexBuilder().contains('c');
        const innerOrSyntax = startWithA.or(endsWithB.or(containsC)).build();
        expect(innerOrSyntax).toBe('(^a.*|(.*b$|.*c.*))');
    });

    test('Equals', () => {
        const result = new RegexBuilder().equals('a').build();
        expect(result).toBe('^a$');
    });

    test('Starts with', () => {
        const result = new RegexBuilder().startsWith('a').build();
        expect(result).toBe('^a.*');

        const result2 = new RegexBuilder().startsWith(['a', 'b']).build();
        expect(result2).toBe('^(a|b).*');
    });

    test('Ends with', () => {
        const result = new RegexBuilder().endsWith('a').build();
        expect(result).toBe('.*a$');

        const result2 = new RegexBuilder().endsWith(['a', 'b']).build();
        expect(result2).toBe('.*(a|b)$');
    });


    describe('Contains', () => {
        test('Without start nor end', () => {
            const result = new RegexBuilder().contains('a').build();
            expect(result).toBe('.*a.*');
        });
        test('With start', () => {
            const result = new RegexBuilder().contains('a').startsWith('start').build();
            expect(result).toBe('^start.*a.*');

            const result2 = new RegexBuilder().contains('a').startsWith(['start', 'start2']).build();
            expect(result2).toBe('^(start|start2).*a.*');
        });
        test('With end', () => {
            const result = new RegexBuilder().contains('a').endsWith('end').build();
            expect(result).toBe('.*a.*end$');

            const result2 = new RegexBuilder().contains('a').endsWith(['end', 'end2']).build();
            expect(result2).toBe('.*a.*(end|end2)$');
        });
        test('With start and end', () => {
            const result = new RegexBuilder().contains('a').startsWith('start').endsWith('end').build();
            expect(result).toBe('^start.*a.*end$');

            const result2 = new RegexBuilder().contains('a').startsWith(['start', 'start2']).endsWith(['end', 'end2']).build();
            expect(result2).toBe('^(start|start2).*a.*(end|end2)$');
        });
    });
    describe('Doesnt Contains', () => {
        test('Without start nor end', () => {
            const result = new RegexBuilder().doesntContain('a').build();
            expect(result).toBe('^(?!.*a).*$');
        });
        test('With start', () => {
            const result = new RegexBuilder().doesntContain('a').startsWith('start').build();
            expect(result).toBe('^start(?!.*a).*$');

            const result2 = new RegexBuilder().doesntContain('a').startsWith(['start', 'start2']).build();
            expect(result2).toBe('^(start|start2)(?!.*a).*$');
        });
        test('With end', () => {
            const result = new RegexBuilder().doesntContain('a').endsWith('end').build();
            expect(result).toBe('^(?!.*a).*end$');

            const result2 = new RegexBuilder().doesntContain('a').endsWith(['end', 'end2']).build();
            expect(result2).toBe('^(?!.*a).*(end|end2)$');
        });
        test('With start and end', () => {
            const result = new RegexBuilder().doesntContain('a').startsWith('start').endsWith('end').build();
            expect(result).toBe('^start(?!.*a).*end$');

            const result2 = new RegexBuilder().doesntContain('a').startsWith(['start', 'start2']).endsWith(['end', 'end2']).build();
            expect(result2).toBe('^(start|start2)(?!.*a).*(end|end2)$');
        });
    });

    test('Doesnt start with', () => {
        const result = new RegexBuilder().doesntStartWith('notStart').build();
        expect(result).toBe('^(?!notStart).*');

        const result2 = new RegexBuilder().doesntStartWith(['notStart', 'notStart2']).build();
        expect(result2).toBe('^(?!notStart\\b|notStart2\\b).*');

        const result3 = new RegexBuilder().doesntStartWith(['notStart', 'notStart2'], false).build();
        expect(result3).toBe('^(?!notStart|notStart2).*');
    });

    test('Doesnt end with', () => {
        const result = new RegexBuilder().doesntEndWith('notEnd').build();
        expect(result).toBe('.*(?<!notEnd)$');

        const result2 = new RegexBuilder().doesntEndWith(['notEnd', 'notEnd2']).build();
        expect(result2).toBe('.*(?<!\\bnotEnd|\\bnotEnd2)$');

        const result3 = new RegexBuilder().doesntEndWith(['notEnd', 'notEnd2'], false).build();
        expect(result3).toBe('.*(?<!notEnd|notEnd2)$');
    });

    test('Has regex content', () => {
        const result = new RegexBuilder().hasRegexContent(new RegexBuilder().startsWith('a')).build();
        expect(result).toBe('^a.*');

        const result2 = new RegexBuilder().hasRegexContent(new RegexBuilder().startsWith('a').endsWith('b')).build();
        expect(result2).toBe('^a.*b$');

        const innerRegex = new RegexBuilder().startsWith('a').contains('b').endsWith('c');
        const result3 = new RegexBuilder().hasRegexContent(innerRegex).startsWith('start').build();
        expect(innerRegex.build()).toBe('^a.*b.*c$');
        expect(result3).toBe('^starta.*b.*c$');
    });

    describe('Error cases', () => {
        test('should throw an error if trying to build without starting with anything', () => {
            expect(() => new RegexBuilder().build()).toThrow('Cannot build regex without any content');
        });

        test('should throw an error if defining start twice', () => {
            expect(() => new RegexBuilder().startsWith('a').startsWith('b').build()).toThrow('Cannot set start multiple times');
            expect(() => new RegexBuilder().doesntStartWith('a').startsWith('b').build()).toThrow('Cannot set start multiple times');
            expect(() => new RegexBuilder().startsWith('a').doesntStartWith('b').build()).toThrow('Cannot set start multiple times');
            expect(() => new RegexBuilder().doesntStartWith('a').doesntStartWith('b').build()).toThrow('Cannot set start multiple times');
        });

        test('should throw an error if defining end twice', () => {
            expect(() => new RegexBuilder().endsWith('a').endsWith('b').build()).toThrow('Cannot set end multiple times');
            expect(() => new RegexBuilder().doesntEndWith('a').endsWith('b').build()).toThrow('Cannot set end multiple times');
            expect(() => new RegexBuilder().endsWith('a').doesntEndWith('b').build()).toThrow('Cannot set end multiple times');
            expect(() => new RegexBuilder().doesntEndWith('a').doesntEndWith('b').build()).toThrow('Cannot set end multiple times');
        });

        test('Cannot set content multiple times', () => {
            expect(() => new RegexBuilder().contains('a').contains('b').build()).toThrow('Cannot set content multiple times');
            expect(() => new RegexBuilder().contains('a').hasRegexContent(new RegexBuilder().startsWith('a')).build()).toThrow('Cannot set content multiple times');
            expect(() => new RegexBuilder().contains('a').equals('b').build()).toThrow('Cannot set content multiple times');
        });

        test('Using equals should block all rewrite except or', () => {
            expect(() => new RegexBuilder().equals('a').startsWith('b')).toThrow('Cannot change anything after setting equals');
            expect(() => new RegexBuilder().equals('a').endsWith('b')).toThrow('Cannot change anything after setting equals');
            expect(() => new RegexBuilder().equals('a').contains('b')).toThrow('Cannot change anything after setting equals');
            expect(() => new RegexBuilder().equals('a').hasRegexContent(new RegexBuilder().endsWith('a'))).toThrow('Cannot change anything after setting equals');

            expect(() => new RegexBuilder().equals('a').or(new RegexBuilder().startsWith('b'))).not.toThrow();
        });
    });
});
