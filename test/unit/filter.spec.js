const assert = require('assert');
const CssoWebpackPlugin = require('../../lib/index').default;

describe('Constructor', function() {
    function testDefaultOptions(plugin) {
        assert.deepStrictEqual(plugin.options, {}, 'default options inited');
    }

    function testDefaultFilter(plugin) {
        assert.strictEqual(plugin.filter('files.css'), true, 'files.css should be true');
        assert.strictEqual(plugin.filter('files.js'), false, 'files.js should be false');
        assert.strictEqual(plugin.filter('/.css/file'), false, '/.css/file should be false');
    }

    it('default', function() {
        const plugin = new CssoWebpackPlugin();
        testDefaultOptions(plugin);
        testDefaultFilter(plugin);
    });

    it('with options', function() {
        const options = { test: 1 };
        const plugin = new CssoWebpackPlugin(options);
        assert.deepStrictEqual(plugin.options, { test: 1 }, 'single argument with options');
        assert.deepStrictEqual(options, { test: 1 }, 'single argument with options immutable');
        testDefaultFilter(plugin);
    });

    it('with regexp filter', function() {
        const plugin = new CssoWebpackPlugin(/^text/gi);

        testDefaultOptions(plugin);
        assert.strictEqual(plugin.filter('text-file.pcss'), true, 'text-file.pcss should be true');
        assert.strictEqual(plugin.filter('files.js'), false, 'files.js should be false');
        assert.strictEqual(plugin.filter('/.css/text'), false, '/.css/text should be false');

        assert.doesNotThrow(
            function() { new CssoWebpackPlugin({}, /^text/gi); },
            'second argument should be approved'
        );
    });

    it('with function filter', function() {
        const filter = function() { return true; };

        const oneArgPlugin = new CssoWebpackPlugin(filter);
        testDefaultOptions(oneArgPlugin);
        assert.strictEqual(oneArgPlugin.filter, filter, 'single `filter` should be set to this.filter');

        const twoArgPlugin = new CssoWebpackPlugin({}, filter);
        assert.strictEqual(twoArgPlugin.filter, filter, 'second argument `filter` should be set to this.filter');
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
