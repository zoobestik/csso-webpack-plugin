const CssoWebpackPlugin = require('../../../../lib/index').default;

module.exports = () => ({
    devtool: 'source-map',
    plugins: [
        new CssoWebpackPlugin(),
    ]
});
