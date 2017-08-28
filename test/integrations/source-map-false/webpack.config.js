const CssoWebpackPlugin = require('../../../lib').default;

module.exports = {
    devtool: false,
    plugins: [
        new CssoWebpackPlugin(),
    ]
};
