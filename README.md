# eslint-plugin-html-sort-attributes

[![NPM version](https://img.shields.io/npm/v/eslint-plugin-html-sort-attributes.svg)](https://www.npmjs.com/package/eslint-plugin-html-sort-attributes)
[![Build Status](https://github.com/LucasOMS/eslint-plugin-html-sort-attributes/actions/workflows/test.yml/badge.svg)](https://github.com/LucasOMS/eslint-plugin-html-sort-attributes/actions/workflows/test.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An ESLint rule to enforce a consistent order of attributes in HTML elements based on regex patterns.

## Requirements

This plugins needs @angular-eslint/template-parser or @html-eslint/parser to work.
By default, none is configured, you might need to define it manually in your eslint configuration.

```json
{
  "parser": "@html-eslint/parser"
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

## Contributing

This is my first library, and I'm still learning how to make it better. If you have any suggestions, please let me know.
