# Presets

Package with plugin has additional presets for bootstrap configure plugin:

<!-- MarkdownTOC -->

- [scopes](#scopes)

<!-- /MarkdownTOC -->

## Scopes

**WARNING:** *It's not safety optimization, but good for css immutable components with [css-modules](https://github.com/css-modules/css-modules).*

Scopes is designed for CSS scope isolation solutions such as css-modules.
And **CSSO** has [special optimizations](https://github.com/css/csso#scopes) with this scopes for restructure mode. 
If your are using good isolation pattern for [localIdentName](https://github.com/webpack-contrib/css-loader#scope), you can generate scopes by class name an reduce css file size:

```css
.module1-foo { color: red; }
.module1-foo.module1-bar { font-size: 1.5em; background: yellow; }

.module2-baz { color: red; }
.module2-qux { font-size: 1.5em; background: yellow; width: 50px; }
```

```js
const CssoWebpackPlugin = require('csso-webpack-plugin').default;
const scopeByClass = require('csso-webpack-plugin').presets.scopeByClass;

function getId(className) { // YOUR FUNCTION FOR SCOPE NAME GENERATOR
    const matches = className.match(/^module\d+-/)
    if (matches) return matches[0];
}

module.exports = {
    /* ... */
    plugins: [
        new CssoWebpackPlugin(scopeByClass(getId)({
            sourceMap: true
        })),
    ]
};
```
Will be optimized to:
```css
.local-module1-foo,.local-module2-baz{color:red}
.local-module1-foo.local-module1-bar,.local-module2-qux{font-size:1.5em;background:#ff0}
.local-module2-qux{width:50px}
```

