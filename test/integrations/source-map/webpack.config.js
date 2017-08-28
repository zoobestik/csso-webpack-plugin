const CssoWebpackPlugin = require('../../../lib').default;

module.exports = {
    devtool: 'source-map',
    plugins: [
        new CssoWebpackPlugin(),
    ]
};
