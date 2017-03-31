# Change Log

## 1.0-beta.2 (March 31, 2017)

Strict source map type from options

* `options.sourceMap` is enum and **required** for generate source maps.
* Add strong dependencies for *[yarn](https://yarnpkg.com/en/) package manager*.

## 1.0-beta.1 (March 30, 2017)

Source Maps feature supported 

* Initial **source map** feature implementation
* Update-to-date dependencies versions

## 1.0-alpha.4 (March 7, 2017)

Acknowledgements and regex filter

* Add “Acknowledgements” section to README.md
* Single argument regex typed should be filter

## 1.0-alpha.3 (March 6, 2017)

Documentation and draft filter API improves

* Add more additional information about motivation
* Filter function may be single now: `new CSSOCompressPlugin(file => file.startsWith('foo'))`

## 1.0-alpha (March 6, 2017)

Simple draft for minify css bundles with full restructing rules by [csso](https://github.com/csso/csso).

**No source maps**
**No exception pretty print**
**No anything else except basic minify**
