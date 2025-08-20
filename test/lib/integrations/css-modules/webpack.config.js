const CssoWebpackPlugin = require('../../../../lib/index').default;

module.exports = () => ({
    plugins: [
        new CssoWebpackPlugin(),
    ]
});
