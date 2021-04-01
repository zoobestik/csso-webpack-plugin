const CssoWebpackPlugin = require('../../../../lib/index').default;

module.exports = {
    devtool: 'source-map',
    output: {
        sourceMapFilename: 'prefix-[file]-[id]-[hash].map[query]'
    },
    plugins: [
        new CssoWebpackPlugin(),
    ]
};
