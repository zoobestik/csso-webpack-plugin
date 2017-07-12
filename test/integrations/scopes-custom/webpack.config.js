const CssoWebpackPlugin = require('../../../lib').default;

module.exports = {
    devtool: 'inline-source-map',
    plugins: [
        new CssoWebpackPlugin({
            usage: {
                scopes: function (source) {
                    return [
                        ["local-module1-foo", "local-module1-bar"],
                        ["local-module2-baz", "local-module2-qux"]
                    ];
                }
            }
        }),
    ]
};
