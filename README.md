# eslint-plugin-html-sort-attributes

[![NPM version](https://img.shields.io/npm/v/eslint-plugin-html-sort-attributes.svg)](https://www.npmjs.com/package/eslint-plugin-html-sort-attributes)
[![Build Status](https://github.com/LucasOMS/eslint-plugin-html-sort-attributes/actions/workflows/test.yml/badge.svg)](https://github.com/LucasOMS/eslint-plugin-html-sort-attributes/actions/workflows/test.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An ESLint rule to enforce a consistent order of attributes in HTML elements based on regex patterns.

## Requirements

This plugins needs @angular-eslint/template-parser or @html-eslint/parser to work.
By default, none is configured, you might need to define it manually in your eslint configuration.

### ESLint >= 9

```javascript
// Import plugin
import htmlSortAttributesPlugin from 'eslint-plugin-html-sort-attributes';
// Choose parser that is compatible with the plugin and your project
import angularTemplateParser from '@angular-eslint/template-parser';
// Or 
import eslintHtmlParser from '@html-eslint/parser';

export default [{
  // ...
  files: ['**/*.html'],
  languageOptions: {
    parser: eslintHtmlParser,
  },
  plugins: {
    'html-sort-attributes': htmlSortAttributesPlugin,
  },
  // ...
}];
```

### ESLint < 9

#### HTML Eslint parser
```json
{
  "parser": "@html-eslint/parser"
}
```

#### Angular template parser

```json
{
  "parser": "@angular-eslint/template-parser"
}
```

## Installation

You can install the plugin using npm:

```sh
npm install eslint-plugin-html-sort-attributes --save-dev
```

Or using yarn:

```sh
yarn add eslint-plugin-html-sort-attributes --dev
```

## Usage

Add html-sort-attributes to the plugins section of your ESLint configuration file. You can then configure the rule under
the rules section.

````json
{
  "plugins": [
    "html-sort-attributes"
  ],
  "rules": {
    "html-sort-attributes/sort-attributes": "error"
  }
}
````

### Rule Details

This rule enforces a consistent order of attributes in HTML elements based on regex patterns.

### Options

The rule accepts an object with the following properties:

- `order`: An array of regex patterns that define the order of attributes. The rule will enforce that attributes are
  sorted in the order defined by the patterns. The default value is an empty array, which means that the rule will not
  enforce any specific order. Strings are passed as is in a Javascript RegExp object, you should escape special
  characters if needed.
- `alphabetical`: Does same regex patterns should be sorted alphabetically? The default value is `false`.

## Examples

### Alphabetical

Incorrect code

```html

<div id="main" class="container" data-role="page"></div>
```

Correct code

```html

<div class="container" data-role="page" id="main"></div>
```

### Regex order

Following example consider the configuration :

```json
{
  "plugins": [
    "html-sort-attributes"
  ],
  "rules": {
    "html-sort-attributes/sort-attributes": [
      "error",
      {
        "order": [
          "^id$",
          "^data-.*$",
          "^class$"
        ]
      }
    ]
  }
}
```

Incorrect code

```html

<div class="container" data-role="page" id="main"></div>
```

Correct code

```html

<div id="main" data-role="page" class="container"></div>
```

## RegexFactory, create regex simply that are easy to read

The library exposes a RegexFactory that can be used to create regex patterns easily to be used in the eslint.config.js
file.

Everything used in the factory escapes special characters, if you have complex pattern to create, consider using a
pattern with comments instead of using the factory.

Here are some examples of how to use it:

### Get the RegexFactory constructor

#### Typescript import

```typescript
import htmlSortAttributesPlugin from 'eslint-plugin-html-sort-attributes';

const { RegexFactory } = htmlSortAttributesPlugin;
```

#### Javascript

```javascript
const htmlSortAttributesPlugin = require('eslint-plugin-html-sort-attributes');

const {RegexFactory} = htmlSortAttributesPlugin;
```

### Attribute is

```javascript
// Will generate /^id$/
new RegexFactory().equals('id').build();
```

### Attribute starts with

```javascript
// Will generate /^data-.*/
new RegexFactory().startsWith('data-').build();
```

### Attribute doesn't start with

```javascript
// Will generate /^(?!data-\b|tracker-\b).*/ and negate it
new RegexFactory().doesntStartWith(['data-', 'tracker-']).build();
```

### Attribute contains

```javascript
// Will generate /.*data-.*/
new RegexFactory().contains('data-').build();
```

### Compose multiple regex

This example show how to create a regex that match an attribute starting with '[' but not followed by a list of specific
patterns such as style or class.

_This can be used to select an angular input that doesn't match another inner pattern._

```javascript
// Will generate /^\[(?!style\b|class\b).*\]$/
new RegexFactory()
        .startsWith('[')
        .hasRegexContent(
                new RegexFactory()
                        .doesntStartWith([
                          'style',
                          'class'
                        ])
        )
        .endsWith(']')
        .build();
```

### Force start and end boundaries

You can force the regex to start with `^` and end with `$` by using the `forceStartAndEnd` option in `build()` function.

```javascript
const regex = new RegexFactory().startsWith('start').contains('content');

// Will generate /^start.*content.*/
regex.build();

// Will generate /^start.*content.*$/
regex.build({forceStartAndEnd: true});
```

## Contributing

This is my first library, and I'm still learning how to make it better. If you have any suggestions, please let me know.
