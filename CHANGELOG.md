## [1.4.1](https://github.com/LucasOMS/eslint-plugin-html-sort-attributes/compare/v1.4.0...v1.4.1) (2025-03-09)


### Bug Fixes

* doesntEndWith regex was broken because of .*, use negative lookbehind to fix ([ae10c69](https://github.com/LucasOMS/eslint-plugin-html-sort-attributes/commit/ae10c69db29e8929ab15eea0654db37ecfc4179c))

# [1.4.0](https://github.com/LucasOMS/eslint-plugin-html-sort-attributes/compare/v1.3.0...v1.4.0) (2025-03-07)


### Features

* provide RegexFactory to help construct config regex when using js ([fb136b2](https://github.com/LucasOMS/eslint-plugin-html-sort-attributes/commit/fb136b232b6a0e5919fac7177055a8bdf2253a8c))

# [1.3.0](https://github.com/LucasOMS/eslint-plugin-html-sort-attributes/compare/v1.2.0...v1.3.0) (2025-03-07)


### Features

* change way to get parser to support ESLint 9 configs ([ddc59f2](https://github.com/LucasOMS/eslint-plugin-html-sort-attributes/commit/ddc59f230b801f6cacf111750bb9b32090c6c3eb))

# [1.2.0](https://github.com/LucasOMS/eslint-plugin-html-sort-attributes/compare/v1.1.0...v1.2.0) (2024-12-09)


### Features

* add support for angular 19 template parser ([58e907c](https://github.com/LucasOMS/eslint-plugin-html-sort-attributes/commit/58e907c0638b28dbe25215663da1a4967295290b))

# [1.1.0](https://github.com/LucasOMS/eslint-plugin-html-sort-attributes/compare/v1.0.3...v1.1.0) (2024-10-02)


### Features

* **named regex:** name regex for error messages easier to read ([3ec2c5a](https://github.com/LucasOMS/eslint-plugin-html-sort-attributes/commit/3ec2c5ae3d9ec4d9d3026e565435ef8a31341ede))

## [1.0.3](https://github.com/LucasOMS/eslint-plugin-html-sort-attributes/compare/v1.0.2...v1.0.3) (2024-09-06)


### Bug Fixes

* handle attribute with falsy value but defined ([92fbee3](https://github.com/LucasOMS/eslint-plugin-html-sort-attributes/commit/92fbee36bbfe553a2eab49eabab606469f7f89b3))

## [1.0.2](https://github.com/LucasOMS/eslint-plugin-html-sort-attributes/compare/v1.0.1...v1.0.2) (2024-08-29)


### Bug Fixes

* fixer now indent correctly when multiline and first attribute on tag open line ([e6550c8](https://github.com/LucasOMS/eslint-plugin-html-sort-attributes/commit/e6550c859c330eb9c45c85b8394f88239ff916ce))

## [1.0.1](https://github.com/LucasOMS/eslint-plugin-html-sort-attributes/compare/v1.0.0...v1.0.1) (2024-08-29)


### Bug Fixes

* add angular-eslint 17 support ([c341d0b](https://github.com/LucasOMS/eslint-plugin-html-sort-attributes/commit/c341d0b7b5ef3ffd246c1033620881e59371d162))

# 1.0.0 (2024-08-29)


### Bug Fixes

* starts to handle CRLF ([7c4a9da](https://github.com/LucasOMS/eslint-plugin-html-sort-attributes/commit/7c4a9dae9d25d70ee02197f47c69eb21e9b063b1))
* support CRLF and implement tests for it ([c756cf0](https://github.com/LucasOMS/eslint-plugin-html-sort-attributes/commit/c756cf03a57c16432d0c27799d7168225040331c))


### Features

* add CR files support ([e721134](https://github.com/LucasOMS/eslint-plugin-html-sort-attributes/commit/e7211342985c989fbe1b01758f6cecdeb19b1729))
