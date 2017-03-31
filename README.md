# CSSO Compression Plugin (for webpack 2)
[![npm][npm]][npm-url]
[![node][node]][node-url]
[![deps][deps]][deps-url]
 
 **Why is not [csso-loader](https://www.npmjs.com/package/csso-loader) or [postcss-csso](https://github.com/lahmatiy/postcss-csso)?**
 * **[Full restructuring](https://rawgithub.com/zoobestik/csso-webpack-plugin/dev/docs/img/better-full.svg)** in bundles:
 ![better](https://rawgithub.com/zoobestik/csso-webpack-plugin/dev/docs/img/better.svg)
 
 * No problems with custom syntax like **css-modules** – `:global(.c .d) .a { color: #fff; }`
 <img src="https://rawgithub.com/zoobestik/csso-webpack-plugin/dev/docs/img/css-modules.png" width="320" alt="syntax">

## Install

**Attention! This is only alpha version!**

```bash
npm i -D csso-webpack-plugin
```

## Usage
Plugin good to use in pair with [ExtractTextPlugin](https://github.com/webpack-contrib/extract-text-webpack-plugin).
```js
const CssoWebpackPlugin = require('csso-webpack-plugin');

module.exports = {
  module: { /* ... */ },
  plugins: [
    new ExtractTextPlugin('[name].css'),
    new CssoWebpackPlugin({ sourceMap: true }),
  ]
}
```

## Options

```js
new CSSOCompressPlugin([options: CssoOptions], [filter: function | RegExp])
```

Arguments:
* `options` — [csso options](https://github.com/css/csso#minifysource-options).
* `options.sourceMap` – type of source map *"inline"*, *"hidden"*, *"source-map"* or *true* (detect automatically). Default: *false*.
* `filter` — Detect should be file processed. Defaults: *to ends with `.css`*.

## Acknowledgements
[![Develop By](https://img.shields.io/badge/develop%20by-zoobestik-blue.svg?style=flat)](https://ru.linkedin.com/in/kbchernenko) [![MIT license](https://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

[npm]: https://img.shields.io/npm/v/csso-webpack-plugin.svg
[npm-url]: https://npmjs.com/package/csso-webpack-plugin

[node]: https://img.shields.io/node/v/csso-webpack-plugin.svg
[node-url]: https://nodejs.org

[deps]: https://david-dm.org/zoobestik/csso-webpack-plugin.svg
[deps-url]: https://david-dm.org/zoobestik/csso-webpack-plugin

[tests]: http://img.shields.io/travis/zoobestik/csso-webpack-plugin.svg
[tests-url]: https://travis-ci.org/zoobestik/csso-webpack-plugin

[cover]: https://coveralls.io/repos/github/zoobestik/csso-webpack-plugin/badge.svg
[cover-url]: https://coveralls.io/github/zoobestik/csso-webpack-plugin
