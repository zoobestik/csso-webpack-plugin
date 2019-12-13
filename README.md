# CSSO Webpack Plugin
[![npm][npm]][npm-url]
[![node][node]][node-url]
[![dependencies](https://img.shields.io/david/zoobestik/csso-webpack-plugin.svg)](https://david-dm.org/zoobestik/csso-webpack-plugin)
[![status](https://travis-ci.org/zoobestik/csso-webpack-plugin.svg?branch=master)](https://travis-ci.org/zoobestik/csso-webpack-plugin)
[![downloads](https://img.shields.io/npm/dm/csso-webpack-plugin.svg)](http://npm-stats.com/~packages/csso-webpack-plugin)

<img src="https://rawgithub.com/zoobestik/csso-webpack-plugin/dev/docs/img/logo.jpg" width="195" alt="Logo">

 **Why is not [csso-loader](https://www.npmjs.com/package/csso-loader) or [postcss-csso](https://github.com/lahmatiy/postcss-csso)?**
 * **[Full restructuring](https://rawgithub.com/zoobestik/csso-webpack-plugin/dev/docs/img/better-full.svg)** in bundles:
 ![better](https://rawgithub.com/zoobestik/csso-webpack-plugin/dev/docs/img/better.svg)
 
 * No problems with custom syntax like **css-modules** – `:global(.c .d) .a { color: #fff; }`
   <img src="https://rawgithub.com/zoobestik/csso-webpack-plugin/dev/docs/img/css-modules.png" width="320" alt="syntax">
 
 * Possible to generate both **pure and minimized** versions [at the same time](#options).

## Install
```bash
npm i -D csso-webpack-plugin
```

For **`node` < 8.0.0** use [1.x](https://github.com/zoobestik/csso-webpack-plugin/tree/v1) version with `csso@^3`:
```bash
npm i -D csso-webpack-plugin@1
```

## Usage
Plugin good to use in pair with [ExtractTextPlugin](https://github.com/webpack-contrib/extract-text-webpack-plugin) or [MiniCssExtractPlugin](https://github.com/webpack-contrib/mini-css-extract-plugin).
```js
const CssoWebpackPlugin = require('csso-webpack-plugin').default;

module.exports = {
  module: { /* ... */ },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
    new CssoWebpackPlugin(),
  ]
}
```

## Options

```js
new CssoWebpackPlugin([options: CssoOptions], [filter: function | RegExp])
```

Arguments:
* `options` — [csso options](https://github.com/css/csso#minifysource-options).
* `options.pluginOutputPostfix` — *function(file)* or *string postfix*, if passed, plugin will create two assets vanilla and compressed.
   Example:
   ```javascript
   {
       plugins: [
           new ExtractTextPlugin('test.css'),
           new CssoWebpackPlugin({ pluginOutputPostfix: 'min' })
           /* Generated:
               test.css — uncompressed file
               test.min.css — minimized with csso file
           */
       ]
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
[![Develop By](https://img.shields.io/badge/develop%20by-zoobestik-blue.svg?style=flat)](https://ru.linkedin.com/in/kbchernenko) [![Logo By](https://img.shields.io/badge/logo%20by-@egorii-yellow.svg?style=flat)](https://www.linkedin.com/in/%D0%B5%D0%B3%D0%BE%D1%80-%D0%B0%D0%BB%D0%B5%D0%BA%D1%81%D0%B5%D0%B5%D0%B2-968a1265/) [![MIT license](https://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

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
