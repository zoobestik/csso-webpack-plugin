import csso from 'csso';
import async from 'async';
import RawSource from 'webpack-sources/lib/RawSource';
import SourceMapSource from 'webpack-sources/lib/SourceMapSource';
import { SourceMapConsumer } from 'source-map';

const filterDefault = file => file.endsWith('.css');
const createRegexpFilter = regex => str => regex.test(str);
const isFilterType = inst => typeof inst === 'function' || inst instanceof RegExp;

export default class CssoWebpackPlugin {
    constructor(options, filter) {
        this.options = options;
        this.filter = filter;

        if (isFilterType(options) && filter === undefined) {
            this.filter = options;
            this.options = undefined;
        }

        if (this.filter === undefined) {
            this.filter = filterDefault;
        }

        if (this.filter instanceof RegExp) {
            this.filter = createRegexpFilter(this.filter);
        }

        if (typeof this.filter !== 'function') {
            throw new Error('filter should be one of these types: function, regexp, undefined');
        }

        this.options = this.options || {};
    }

    apply(compiler) {
        compiler.plugin('compilation', compilation => {
            const options = this.options;

            compilation.plugin('optimize-chunk-assets', (chunks, done) => {
                async.forEach(chunks, (chunk, chunked) => {
                    async.forEach(chunk.files, (file, callback) => {
                        try {
                            if (!this.filter(file)) {
                                return callback();
                            }

                            let source;
                            let sourceMap;

                            const asset = compilation.assets[file];

                            if (asset.sourceAndMap) {
                                const sourceAndMap = asset.sourceAndMap();
                                sourceMap = sourceAndMap.map;
                                source = sourceAndMap.source;
                            } else {
                                sourceMap = asset.map();
                                source = asset.source();
                            }

                            if (Buffer.isBuffer(source)) {
                                source = source.toString('utf-8');
                            }

                            if (options.sourceMap !== undefined) {
                                compilation.warnings.push(new Error('CssoWebpackPlugin: ' +
                                    '“sourceMap” option is DEPRECATED. ' +
                                    'Use webpack “devtool” instead.\n\tFor more info about the usage see ' +
                                    'https://github.com/zoobestik/csso-webpack-plugin/releases/tag/v1.0.0-beta.8'
                                ));
                            }

                            let { css, map } = csso.minify(source, { // eslint-disable-line prefer-const
                                ...options,
                                filename: file,
                                sourceMap: Boolean(compiler.options.devtool),
                            });

                            if (map && sourceMap) {
                                map.applySourceMap(new SourceMapConsumer(sourceMap), file);
                            }

                            if (!map) {
                                map = sourceMap;
                            }

                            compilation.assets[file] = map ?
                                new SourceMapSource(css, file, map.toJSON ? map.toJSON() : map) :
                                new RawSource(css);
                        } catch (err) {
                            let error = err;
                            const prefix = `${file} from CssoWebpackPlugin\n`;
                            const { message, parseError, stack } = err;

                            if (parseError) {
                                error = `${message} [${file}:${parseError.line}:${parseError.column}]`;
                            } else {
                                error = `${message} ${stack}`;
                            }

                            compilation.errors.push(new Error(`${prefix}${error}`));
                        }

                        return callback();
                    }, chunked);
                }, done);
            });
        });
    }
}
