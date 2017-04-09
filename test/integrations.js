const fs = require('fs');
const join = require('path').join;
const rimraf = require('rimraf');
const assert = require('assert');
const webpack = require('webpack');
const getWebpackConfig = require('./webpack.config.js');

const root = join(__dirname, 'integrations');
const output = join(__dirname, '_out');

describe('Integrations with webpack 2', function() {
    this.timeout(5000);

    const cases = fs.readdirSync(root);

    rimraf.sync(output);

    cases.forEach(function(testCase) {
        it('with ' + testCase + ' test', function() {
            return new Promise(function(resolve, reject) {
                const outputDirectory = join(output, testCase);
                const testDirectory = join(root, testCase);
                const configFile = join(testDirectory, 'webpack.config.js');

                var options = getWebpackConfig({
                    outputDirectory: outputDirectory,
                    testDirectory: testDirectory
                });

                if (fs.existsSync(configFile)) {
                    const testConfig = require(configFile);
                    options = Object.assign({}, options, testConfig, {
                        output: Object.assign({}, options.output, testConfig.output),
                        plugins: options.plugins.concat(testConfig.plugins)
                    });
                }

                webpack(options, function (err, stats) {
                    if (err) return reject(err);
                    if (stats.hasErrors()) return reject(new Error(stats.toString()));

                    const actual = fs.readFileSync(join(outputDirectory, 'test.css'), 'utf-8');
                    const expected = fs.readFileSync(join(testDirectory, 'expected.css'), 'utf-8')
                        .replace(/\n$/g, '')
                        .replace(/%%unit-hash%%/g, stats.hash);

                    assert.equal(actual, expected,
                        'Output ' + testCase + '/test.css file isn\'t equals ' + testCase + '/expected.css'
                    );

                    resolve();
                });
            });
        });
    });
});
