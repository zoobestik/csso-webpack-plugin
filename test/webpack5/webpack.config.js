const DefinePlugin = require('webpack').DefinePlugin;
const ExtractTextPlugin = require('mini-css-extract-plugin');

const styleExtractPlugin = new ExtractTextPlugin({
    filename: '[name].css',
});

module.exports = function (options, basePath) {
    return {
        mode: 'none',
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
                    use: [
                        ExtractTextPlugin.loader,
                        {
                            loader: options.basePath + '/node_modules/css-loader',
                            options: {
                                modules: {
                                    localIdentName: 'local-[local]',
                                },
                                sourceMap: true
                            }
                        },
                    ],
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
