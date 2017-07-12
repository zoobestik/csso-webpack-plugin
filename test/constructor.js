const assert = require('assert');
const CssoWebpackPlugin = require('../lib').default;

describe('Constructor', function() {
    const getDefaultOptions = function() {
        return { sourceMap: false };
    };

    function testDefaultOptions(plugin) {
        assert.deepEqual(plugin.options, getDefaultOptions(), 'default options inited');
    }

    function testDefaultFilter(plugin) {
        assert.equal(plugin.filter('files.css'), true, 'files.css should be true');
        assert.equal(plugin.filter('files.js'), false, 'files.js should be false');
        assert.equal(plugin.filter('/.css/file'), false, '/.css/file should be false');
    }

    it('default', function() {
        const plugin = new CssoWebpackPlugin();
        testDefaultOptions(plugin);
        testDefaultFilter(plugin);
    });

    it('with options', function() {
        const options = { test: 1 };
        const plugin = new CssoWebpackPlugin(options);
        assert.notEqual(plugin.options, options);
        assert.deepEqual(plugin.options, Object.assign({}, getDefaultOptions(), options), 'single argument with options');
        testDefaultFilter(plugin);
    });

    it('with regexp filter', function() {
        const plugin = new CssoWebpackPlugin(/^text/gi);

        testDefaultOptions(plugin);
        assert.equal(plugin.filter('text-file.pcss'), true, 'text-file.pcss should be true');
        assert.equal(plugin.filter('files.js'), false, 'files.js should be false');
        assert.equal(plugin.filter('/.css/text'), false, '/.css/text should be false');

        assert.doesNotThrow(
            function() { new CssoWebpackPlugin({}, /^text/gi); },
            'second argument should be approved'
        );
    });

    it('with function filter', function() {
        const filter = function() { return true; };

        const oneArgPlugin = new CssoWebpackPlugin(filter);
        testDefaultOptions(oneArgPlugin);
        assert.equal(oneArgPlugin.filter, filter, 'single `filter` should be set to this.filter');

        const twoArgPlugin = new CssoWebpackPlugin({}, filter);
        assert.equal(twoArgPlugin.filter, filter, 'second argument `filter` should be set to this.filter');
    });

    it('unexpected type for filter', function() {
        const expectedMessage = 'Error: filter should be one of these types: function, regexp, undefined';

        function isExpectedError(err) {
            return (err instanceof Error) && err.toString() === expectedMessage;
        }

        function createPlugin() {
            new CssoWebpackPlugin({}, 'some text');
        }

        assert.throws(createPlugin, isExpectedError, 'throw error rise unexpected type');
    });
});
