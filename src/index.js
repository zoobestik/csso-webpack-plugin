import csso from 'csso';
import async from 'async';
import RawSource from 'webpack-sources/lib/RawSource';

const filterDefault = file => file.endsWith('.css');
const createRegexpFilter = regex => str => regex.test(str);

export default class CssoWebpackPlugin {
    constructor(options, filter) {
        this.options = options;
        this.filter = filter;

        if (typeof this.options === 'function' && typeof this.filter === 'undefined') {
            this.filter = options;
            this.options = undefined;
        }

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
                    } catch (err) {
                        let msg;
                        const prefix = `${file} from CssoWebpackPlugin\n`;
                        const { message, parseError } = err;

                        if (parseError) {
                            msg = `${message} [${file}:${parseError.line}:${parseError.column}]`;
                        } else {
                            msg = message || err.stack;
                        }

                        if (msg) {
                            compilation.errors.push(new Error(`${prefix}${msg}`));
                        }
                    }

                    return callback();
                });
            });
        });
    }
}
