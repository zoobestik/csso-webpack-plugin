import csso from 'csso';
import async from 'async';
import RawSource from 'webpack-sources/lib/RawSource';

const filterDefault = file => file.endsWith('.css');
const createRegexpFilter = regex => str => regex.test(str);

export default class CSSOCompressPlugin {

    constructor(options, filter) {
        this.options = options;
        this.filter = filter;

        if (!filter) {
            this.filter = filterDefault;
        }

        if (typeof filter !== 'function') {
            this.filter = createRegexpFilter(filter);
        }
    }

    apply(compiler) {
        compiler.plugin('this-compilation', compilation => {
            compilation.plugin('optimize-assets', (assets, callback) => {
                async.forEach(Object.keys(assets), file => {
                    if (!file.endsWith('.css')) {
                        return callback();
                    }

                    try {
                        const asset = assets[file];
                        let source = asset.source();

                        if (Buffer.isBuffer(source)) {
                            source = source.toString('utf-8');
                        }

                        const { css } = csso.minify(source, this.options);

                        compilation.assets[file] = new RawSource(css);
                    } catch (e) {
                        compilation.errors.push(e);
                    }

                    return callback();
                });
            });
        });
    }
}
