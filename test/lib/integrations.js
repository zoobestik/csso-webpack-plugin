const fs = require('fs');
const join = require('path').join;
const rimraf = require('rimraf');
const assert = require('assert');

const root = join(__dirname, 'integrations');

function runIntegrations(basePath, version) {
    this.timeout(5000);

    const output = join(basePath, '_out');

    rimraf.sync(output);

    const nodeVersions = process.version.split('.');
    const nodeMajorVersion =  parseInt(nodeVersions[0].substring(1), 10);
    const nodeMinorVersion =  parseInt(nodeVersions[1], 10);

    const isEnvCorrect = !(
        (version === '4' && nodeMajorVersion === 8 && nodeMinorVersion === 0) ||
        (version === '5' && nodeMajorVersion < 10)
    );

    if (!isEnvCorrect) {
        it('webpack ' + version + ' unsuppported with node ' + process.version, function() {
           assert.ok(true);
        });
        return;
    }

    const cases = fs.readdirSync(root);
    const webpack = require(join(basePath, 'node_modules', 'webpack'));
    const getWebpackConfig = require(join(basePath, 'webpack.config.js'));

    cases.forEach(function(testCase) {
        it('with ' + testCase + ' test', function() {
            return new Promise(function(resolve, reject) {
                const outputDirectory = join(output, testCase);
                const testDirectory = join(root, testCase);
                const configFile = join(testDirectory, 'webpack.config.js');

                var options = getWebpackConfig({
                    basePath: basePath,
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

                    const expectedCssExt = 'expected-v' + version + '.css';

                    fs.readdir(testDirectory, function(err, files) {
                        if (err) return reject(err);

                        files = files.filter(name => name.endsWith(expectedCssExt));

                        assert.ok(files.length > 0, 'Integration test should be with css file');

                        files.forEach(name => {
                            const prefix = name.substring(0, name.length - expectedCssExt.length) || '';
                            const actualName = 'test.' + prefix + 'css';

                            const actual = fs.readFileSync(join(outputDirectory, actualName), 'utf-8')
                                .replace(/\n$/g, '');

                            const expected = fs.readFileSync(join(testDirectory, name), 'utf-8')
                                .replace(/\n$/g, '')
                                .replace(/%%unit-hash%%/g, stats.hash);

                            assert.strictEqual(actual, expected,
                                'Output ' + testCase + ' — ' + name + ' file isn\'t equals ' + actualName
                            );
                        });

                        resolve();
                    });
                });
            });
        });
    });
}

module.exports = runIntegrations;
