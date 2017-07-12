const CssoWebpackPlugin = require('../../../lib').default;
const scopeByClass = require('../../../lib').presets.scopeByClass;

function getId(className) {
    const matches = className.match(/^local-module\d+-/);
    if (matches) return matches[0];
}

module.exports = {
    plugins: [
        new CssoWebpackPlugin(scopeByClass(getId)({
            sourceMap: true
        })),
    ]
};
