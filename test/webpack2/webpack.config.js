const DefinePlugin = require('./node_modules/webpack').DefinePlugin;
const ExtractTextPlugin = require('./node_modules/extract-text-webpack-plugin');

const styleExtractPlugin = new ExtractTextPlugin({
    filename: '[name].css',
    allChunks: false,
});

module.exports = function (options) {
    return {
        entry: {
            test: './index.js'
        },
        cache: false,
        performance: false,
        context: options.testDirectory,
        output: {
            filename: '[name].js',
            path: options.outputDirectory,
        },
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: ExtractTextPlugin.extract({
                        use: {
                            loader: options.basePath + '/node_modules/css-loader',
                            options: {
                                modules: true,
                                localIdentName: 'local-[local]',
                                sourceMap: true
                            }
                        }
                    }),
                },
            ],
        },
        plugins: [
            new DefinePlugin({
                'process.env.NODE_ENV': '"production"',
            }),
            styleExtractPlugin,
        ],
    };
};
