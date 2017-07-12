# CSSO Compression Plugin
[![npm][npm]][npm-url]
[![node][node]][node-url]
[![dependencies](https://img.shields.io/david/zoobestik/csso-webpack-plugin.svg)](https://david-dm.org/zoobestik/csso-webpack-plugin)
[![status](https://travis-ci.org/zoobestik/csso-webpack-plugin.svg?branch=master)](https://travis-ci.org/zoobestik/csso-webpack-plugin)
![downloads](https://img.shields.io/npm/dm/csso-webpack-plugin.svg)

 **Why is not [csso-loader](https://www.npmjs.com/package/csso-loader) or [postcss-csso](https://github.com/lahmatiy/postcss-csso)?**
 * **[Full restructuring](https://rawgithub.com/zoobestik/csso-webpack-plugin/dev/docs/img/better-full.svg)** in bundles:
 ![better](https://rawgithub.com/zoobestik/csso-webpack-plugin/dev/docs/img/better.svg)
 
 * No problems with custom syntax like **css-modules** – `:global(.c .d) .a { color: #fff; }`
 <img src="https://rawgithub.com/zoobestik/csso-webpack-plugin/dev/docs/img/css-modules.png" width="320" alt="syntax">

## Install
```bash
npm i -D csso-webpack-plugin
```

## Usage
Plugin good to use in pair with [ExtractTextPlugin](https://github.com/webpack-contrib/extract-text-webpack-plugin).
```js
const CssoWebpackPlugin = require('csso-webpack-plugin').default;

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
new CssoWebpackPlugin([options: CssoOptions], [filter: function | RegExp])
```

Arguments:
* `options` — [csso options](https://github.com/css/csso#minifysource-options).
* `options.sourceMap` – type of source map *"inline"*, *"hidden"*, *"source-map"* or *true* (detect automatically). Default: *false*.
* `options.usage.scopes` – array or function for generate custom scopes. Default: *[]*.
Example for use with [babel-plugin-react-css-modules](https://github.com/gajus/babel-plugin-react-css-modules):
```javascript
(inputCss: string, filename: string) => {
    const scopes = {};

    inputCss.match(/\.(.*?)___(.*?)___[a-zA-Z0-9]+/g).forEach((className) => {
        const moduleId = className.split('___').slice(0, 2).join('___');

        if (!scopes[moduleId]) {
            scopes[moduleId] = [];
        }

        scopes[moduleId].push(className);
    });

    return Object.values(scopes);
}
```

* `filter` — Detect should be file processed. Defaults: *to ends with `.css`*.

## Flow support
I don't now why, but plugin ships with flow typings (*typedef too*). To use them in your project, add this to the `[libs]` section of your `.flowconfig`:
```
[libs]
node_modules/csso-webpack-plugin/lib/index.js.flow
```

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
