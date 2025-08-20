const CssoWebpackPlugin = require('../../../../lib/index').default;

module.exports = () => ({
    devtool: 'hidden-source-map',
    plugins: [
        new CssoWebpackPlugin(),
    ]
});
