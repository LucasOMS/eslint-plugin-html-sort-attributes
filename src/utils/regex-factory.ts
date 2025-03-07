export class RegexFactory {
    private start?: string;
    private end?: string;
    private content?: string;

    // Error flags
    private isEqual = false;

    public startsWith(text: string | string[]): RegexFactory {
        this.throwErrorIfInEqualMode();
        if (this.start) {
            throw new Error('Cannot set start multiple times');
        }
        if (Array.isArray(text)) {
            this.start = `^(${text.map(escapeRegexCharacters).join('|')})`;
            return this;
        }
        this.start = `^${escapeRegexCharacters(text)}`;
        return this;
    }

    public doesntStartWith(text: string | string[], useWordBoundary = true): RegexFactory {
        this.throwErrorIfInEqualMode();
        if (this.start) {
            throw new Error('Cannot set start multiple times');
        }
        if (Array.isArray(text)) {
            this.start = `^(?!${text.map(escapeRegexCharacters).map(addWordBoundary(useWordBoundary, 'end')).join('|')})`;
            return this;
        }
        this.start = `^(?!${escapeRegexCharacters(text)})`;
        return this;
    }

    public endsWith(text: string | string[]): RegexFactory {
        this.throwErrorIfInEqualMode();
        if (this.end) {
            throw new Error('Cannot set end multiple times');
        }
        if (Array.isArray(text)) {
            this.end = `(${text.map(escapeRegexCharacters).join('|')})$`;
            return this;
        }
        this.end = `${escapeRegexCharacters(text)}$`;
        return this;
    }

    public doesntEndWith(text: string | string[], useWordBoundary = true): RegexFactory {
        this.throwErrorIfInEqualMode();
        if (this.end) {
            throw new Error('Cannot set end multiple times');
        }
        if (Array.isArray(text)) {
            this.end = `(?!${text.map(escapeRegexCharacters).map(addWordBoundary(useWordBoundary, 'start')).join('|')})$`;
            return this;
        }
        this.end = `(?!${escapeRegexCharacters(text)})$`;
        return this;
    }

    public contains(text: string | string[]): RegexFactory {
        this.throwErrorIfInEqualMode();
        if (this.content) {
            throw new Error('Cannot set content multiple times');
        }
        if (Array.isArray(text)) {
            this.content = `.*(${text.map(escapeRegexCharacters).join('|')}).*`;
            return this;
        }
        this.content = `.*${escapeRegexCharacters(text)}.*`;
        return this;
    }

    doesntContain(text: string | string[]): RegexFactory {
        this.throwErrorIfInEqualMode();
        if (this.content) {
            throw new Error('Cannot set content multiple times');
        }
        if (Array.isArray(text)) {
            this.content = `^(?!.*${text.map(escapeRegexCharacters).join('|')}).*$`;
            return this;
        }
        this.content = `^(?!.*${escapeRegexCharacters(text)}).*$`;
        return this;
    }

    public equals(text: string): RegexFactory {
        if (this.content) {
            throw new Error('Cannot set content multiple times');
        }
        this.isEqual = true;
        this.content = `^${escapeRegexCharacters(text)}$`;
        return this;
    }

    public hasRegexContent(regexContent: RegexFactory): RegexFactory {
        this.throwErrorIfInEqualMode();
        if (this.content) {
            throw new Error('Cannot set content multiple times');
        }
        this.content = regexContent.build();
        return this;
    }

    // Allows to chain multiple regex because is might be easier to build two regex separately
    public or(regexFactory: RegexFactory): RegexFactory {
        if (!this.start && !this.content && !this.end) {
            throw new Error('Cannot use or without any content');
        }
        this.content = `(${this.build()}|${regexFactory.build()})`;
        // After building the or, we reset the other values
        this.start = undefined;
        this.end = undefined;
        this.isEqual = false;
        return this;
    }

    public build(opts?: { forceStartAndEnd: boolean }): string {
        if (!this.start && !this.content && !this.end) {
            throw new Error('Cannot build regex without any content');
        }

        if (this.content) {
            if (this.start) {
                this.content = removeStart(this.content);
            }
            if (this.end) {
                this.content = removeEnd(this.content);
            }
        } else {
            this.content = '.*';
        }

        if (opts?.forceStartAndEnd) {
            if (!this.start) {
                this.start = '^';
            }
            if (!this.end) {
                this.end = '$';
            }
            this.content = removeStart(removeEnd(this.content));
        }

        return [this.start, this.content, this.end].filter(Boolean).join('');
    }

    private throwErrorIfInEqualMode(): void {
        if (this.isEqual) {
            throw new Error('Cannot change anything after setting equals');
        }
    }
}

function removeStart(text: string): string {
    return text.replace(/^\^/, '');
}

function removeEnd(text: string): string {
    return text.replace(/\$$/, '');
}

function addWordBoundary(useWordBoundary: boolean, position: 'start' | 'end' | 'both'): (word: string) => string {
    if (!useWordBoundary) {
        return (word: string) => word;
    }

    return (word: string) => {
        if (position === 'start') {
            return `\\b${word}`;
        }
        if (position === 'end') {
            return `${word}\\b`;
        }
        return `\\b${word}\\b`;
    };
}

function escapeRegexCharacters(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
