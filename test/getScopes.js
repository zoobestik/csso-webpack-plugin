const assert = require('assert');
const CssoWebpackPlugin = require('../lib').default;

describe('getScope', function() {
    function getScope(plugin) {
        return plugin.getScopes('aaaa', 'filename');
    }

    it('default', function() {
        const plugin = new CssoWebpackPlugin();
        const scopes = getScope(plugin);

        assert.ok(Array.isArray(scopes), 'is array');
        assert.deepEqual(scopes, [], 'is empty');
    });

    it('with array', function() {
        const plugin = new CssoWebpackPlugin({
            usage: { scopes: [ 1, 2 ] }
        });
        const scopes = getScope(plugin);
        assert.deepEqual(scopes, [ 1, 2 ], 'is equal array');
    });

    it('with function', function() {
        var args;
        const plugin = new CssoWebpackPlugin({
            usage: { scopes: function() {
                args = Array.prototype.slice.call(arguments);
                return [ 5, 6 ];
            } }
        });
        const scopes = getScope(plugin);
        assert.deepEqual(args, [ 'aaaa', 'filename' ], 'is correct args');
        assert.deepEqual(scopes, [ 5, 6 ], 'is equal array');
    });
});
