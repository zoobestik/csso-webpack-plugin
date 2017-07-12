const assert = require('assert');
const csso = require('csso');
const presets = require('../lib').presets;

describe('Presets', function() {
    describe('scopes by class', function() {
        function ast() {
            return csso.syntax.parse('.foo, .foo .bar { color: red }');
        }

        it('default', function () {
            function getId(className) { return className; }
            const options = presets.scopeByClass(getId)();
            const cssoOptions = Object.assign({}, options);
            options.beforeCompress(ast(), cssoOptions);

            assert.deepEqual(cssoOptions.usage, { scopes: [ ['foo'], ['bar'] ] }, 'incorrect scopes');
            assert.equal(options.usage.scopes, void 0, 'scopes is clean');
        });

        it('with config', function () {
            function getId(className) { return className; }
            const options = presets.scopeByClass(getId)({ sourceMap: true });
            const cssoOptions = Object.assign({}, options);
            options.beforeCompress(ast(), cssoOptions);

            assert.ok(cssoOptions.sourceMap, 'keep user config');
            assert.deepEqual(cssoOptions.usage, { scopes: [ ['foo'], ['bar'] ] }, 'incorrect scopes');
            assert.equal(options.usage.scopes, void 0, 'scopes is clean');
        });

        it('with scopes', function () {
            function getId(className) { return className; }
            const options = presets.scopeByClass(getId)({ usage: { scopes: [[ 'cls' ]] }});
            const cssoOptions = Object.assign({}, options);
            options.beforeCompress(ast(), cssoOptions);

            assert.deepEqual(options.usage, { scopes: [[ 'cls' ]] }, 'keep user usage');
            assert.deepEqual(cssoOptions.usage, { scopes: [ ['foo'], ['bar'], [ 'cls' ] ] }, 'incorrect scopes');
        });

        it('with usage', function () {
            function getId(className) { return className; }
            const options = presets.scopeByClass(getId)({ usage: { foo: 'bar' } });
            const cssoOptions = Object.assign({}, options);
            options.beforeCompress(ast(), cssoOptions);

            assert.deepEqual(options.usage, { foo: 'bar' }, 'keep user usage');
            assert.deepEqual(cssoOptions.usage, { foo: 'bar', scopes: [ ['foo'], ['bar'] ] }, 'incorrect scopes');
        });

        it('with beforeCompress', function () {
            var callAst, callOptions;

            function getId() { return 'foo'; }

            const originalAst = ast()
            const options = presets.scopeByClass(getId)({
                beforeCompress: function(ast, options) {
                    callAst = ast;
                    callOptions = options;
                }
            });

            const cssoOptions = Object.assign({}, options);
            options.beforeCompress(originalAst, cssoOptions);

            assert.deepEqual(cssoOptions.usage, { scopes: [ ['foo', 'bar'] ] }, 'incorrect scopes');
            assert.equal(options.usage.scopes, void 0, 'scopes is clean');
            assert.equal(originalAst, callAst, 'user beforeCompress called with ast');
            assert.equal(cssoOptions, callOptions, 'user beforeCompress called with cssoOptions');
        });
    });
});
