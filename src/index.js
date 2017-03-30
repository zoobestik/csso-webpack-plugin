import csso from 'csso';
import async from 'async';
import RawSource from 'webpack-sources/lib/RawSource';
import ConcatSource from 'webpack-sources/lib/ConcatSource';
import SourceMapSource from 'webpack-sources/lib/SourceMapSource';
import { SourceMapConsumer } from 'source-map';

const filterDefault = file => file.endsWith('.css');
const createRegexpFilter = regex => str => regex.test(str);
const isFilterType = inst => typeof inst === 'function' || inst instanceof RegExp;

const SOURCEMAP_INLINE_DEVTOOL = [];
const isInline = devtool => SOURCEMAP_INLINE_DEVTOOL.indexOf(devtool) !== -1;

const sourceMapURL = content => `\n/*# sourceMappingURL=${content} */`;

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

        this.options = this.options || {};
    }

    apply(compiler) {
        compiler.plugin('compilation', compilation => {
            const options = this.options;
            const optSourceMap = options.sourceMap;
            const devtool = compiler.options.devtool;

            if (optSourceMap) {
                compilation.plugin('build-module', module => {
                    module.useSourceMap = true;
                });
            }

            compilation.plugin('optimize-assets', (assets, callback) => {
                async.forEach(Object.keys(assets), file => {
                    try {
                        if (!this.filter(file)) {
                            return callback();
                        }

                        let source;
                        let sourceMap;

                        const asset = assets[file];

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

                        let { css, map } = csso.minify(source, { // eslint-disable-line prefer-const
                            ...options,
                            filename: file,
                            sourceMap: typeof optSourceMap !== 'undefined' ? optSourceMap : Boolean(sourceMap),
                        });

                        if (map && sourceMap) {
                            map.applySourceMap(new SourceMapConsumer(sourceMap), file);
                        }

                        if (!map) {
                            map = sourceMap;
                        }

                        let out = new RawSource(css);

                        if (map) {
                            let isInlineUrl = isInline(devtool);
                            const inputMapComment = source.match(/\/\*# sourceMappingURL=(\S+)\s*\*\/\s*$/);
                            const prevSourceMap = inputMapComment && inputMapComment[1];

                            if (prevSourceMap) {
                                isInlineUrl = prevSourceMap.startsWith('data:application/json;charset=utf-8;base64');
                            }

                            if (optSourceMap === 'inline') {
                                isInlineUrl = true;
                            }

                            if (isInlineUrl) {
                                const base64 = new Buffer(map.toString()).toString('base64');
                                out = new ConcatSource(out, sourceMapURL(`data:application/json;base64,${base64}`));
                            } else {
                                const srcMapUrl = prevSourceMap || `${file}.map`; // @ToDo: compilation.getPath
                                out = new SourceMapSource(css + sourceMapURL(srcMapUrl), file, map, source, sourceMap);
                            }
                        }

                        compilation.assets[file] = out;
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
                });
            });
        });
    }
}
