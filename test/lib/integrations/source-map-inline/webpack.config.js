const CssoWebpackPlugin = require('../../../../lib/index').default;

module.exports = () => ({
    devtool: 'inline-source-map',
    plugins: [
        new CssoWebpackPlugin(),
    ]
});
