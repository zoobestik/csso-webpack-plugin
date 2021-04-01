const CssoWebpackPlugin = require('../../../../lib/index').default;

module.exports = {
    devtool: false,
    plugins: [
        new CssoWebpackPlugin(),
    ]
};
