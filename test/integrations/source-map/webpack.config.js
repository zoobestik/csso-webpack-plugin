const CssoWebpackPlugin = require('../../../lib').default;

module.exports = {
    devtool: 'inline-source-map',
    plugins: [
        new CssoWebpackPlugin({ sourceMap: 'source-map' }),
    ]
};
