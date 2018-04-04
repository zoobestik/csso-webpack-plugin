# Change Log

## 1.0.0-beta.12 (April 4, 2018)

Release candidate N9:

* Fix warning with webpack 4.x (thanks for [@the-spyke](https://github.com/the-spyke)):
```
DeprecationWarning: Tapable.plugin is deprecated. Use new API on `.hooks` instead
```

## 1.0.0-beta.11 (April 4, 2018)

* No changes

## 1.0.0-beta.10 (November 4, 2017)

Release candidate N8:

* Add new option for two different files — [`pluginOutputPostfix`](https://github.com/zoobestik/csso-webpack-plugin/commit/7da22c9c34c2172148049912589b507d7309a852#diff-04c6e90faac2675aa89e2176d2eec7d8R42)
* **csso** 3.3.0 -> 3.4.0 by default
* Update-to-date dev-dependencies versions

## 1.0.0-beta.9 (October 17, 2017)

Release candidate N7:

* **csso** 3.2.0 -> 3.3.0 by default
* Update-to-date dev-dependencies versions

## 1.0.0-beta.8 (August 28, 2017)

Release candidate N6:

* Update-to-date dependencies versions
* **BREAKING**: `options.sourceMap` is deprecate and should be removed from config.
  For getting source map just use any value [`devtool`](https://webpack.js.org/configuration/devtool/#devtool).

## 1.0.0-beta.7 (June 3, 2017)

Release candidate N5:

* Trivial; strict 0.10 node version
* Update-to-date dependencies versions

## 1.0-beta.6 (April 17, 2017)

Release candidate N4

* **trivial**. Provide typings for Flow and Typescript

## 1.0-beta.5 (April 15, 2017)

Release candidate N3

* Fix issue with regexp filters

## 1.0-beta.4 (April 10, 2017)

Release candidate N2

* Add `output.sourceMapFilename` options support

## 1.0-beta.3 (April 9, 2017)

Release candidate N1

* **Bugfix**: simple compilation config triggered success callback twice

### Breaking changes
* The `sourceMap:true` used `devtool` option if chunk detection unexpected
* nodejs is **less than version 4** still can be used but **isn't tested now**.

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
