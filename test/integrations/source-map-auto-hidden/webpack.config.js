const CssoWebpackPlugin = require('../../../lib').default;

module.exports = {
    devtool: 'hidden-source-map',
    plugins: [
        new CssoWebpackPlugin({ sourceMap: true }),
    ]
};
