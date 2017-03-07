import csso from 'csso';
import async from 'async';
import RawSource from 'webpack-sources/lib/RawSource';

const filterDefault = file => file.endsWith('.css');
const createRegexpFilter = regex => str => regex.test(str);
const isFilterType = inst => typeof inst === 'function' || inst instanceof RegExp;

export default class CssoWebpackPlugin {
    constructor(options, filter) {
        this.options = options;
        this.filter = filter;

        if (isFilterType(this.options) && typeof this.filter === 'undefined') {
            this.filter = options;
            this.options = undefined;
        }

        if (typeof this.filter === 'undefined') {
            this.filter = filterDefault;
        }

        if (typeof this.filter !== 'function') {
            this.filter = createRegexpFilter(filter);
        }
    }

    apply(compiler) {
        compiler.plugin('this-compilation', compilation => {
            compilation.plugin('optimize-assets', (assets, callback) => {
                async.forEach(Object.keys(assets), file => {
                    try {
                        if (!this.filter(file)) {
                            return callback();
                        }

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
                        const { message, parseError, stack } = err;

                        if (parseError) {
                            msg = `${message} [${file}:${parseError.line}:${parseError.column}]`;
                        } else {
                            msg = message || stack;
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
