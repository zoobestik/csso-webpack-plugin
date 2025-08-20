const CssoWebpackPlugin = require('../../../../lib/index').default;

module.exports = ({version}) => ({
    devtool: 'source-map',
    output: {
        sourceMapFilename: `prefix-[file]-[id]-[${version < 5 ? 'hash' : 'fullhash'}].map[query]`
    },
    plugins: [
        new CssoWebpackPlugin(),
    ]
});
