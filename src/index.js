import csso from 'csso';
import async from 'async';
import RawSource from 'webpack-sources/lib/RawSource';
import ConcatSource from 'webpack-sources/lib/ConcatSource';
import SourceMapSource from 'webpack-sources/lib/SourceMapSource';
import { SourceMapConsumer } from 'source-map';

const filterDefault = file => file.endsWith('.css');
const createRegexpFilter = regex => str => regex.test(str);
const isFilterType = inst => typeof inst === 'function' || inst instanceof RegExp;

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

        this.options = this.options || {
            sourceMap: false,
        };
    }

    apply(compiler) {
        compiler.plugin('compilation', compilation => {
            const options = this.options;
            const optSourceMap = options.sourceMap;
            const withSourceMap = Boolean(optSourceMap);

            if (withSourceMap) {
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
                            sourceMap: withSourceMap,
                        });

                        if (map && sourceMap) {
                            map.applySourceMap(new SourceMapConsumer(sourceMap), file);
                        }

                        if (!map) {
                            map = sourceMap;
                        }

                        let out = new RawSource(css);

                        if (withSourceMap && map) {
                            let srcMapUrl;
                            let isInline = optSourceMap === 'inline';

                            if (optSourceMap === true) {
                                const inputMapComment = source.match(/\/\*# sourceMappingURL=(\S+)\s*\*\/\s*$/);
                                const prevSourceMap = (inputMapComment && inputMapComment[1]) || '';

                                if (prevSourceMap) {
                                    if (prevSourceMap.startsWith('data:application/json;charset=utf-8;base64')) {
                                        isInline = true;
                                    } else {
                                        srcMapUrl = prevSourceMap;
                                    }
                                }
                            }

                            if (isInline) {
                                const base64 = new Buffer(map.toString()).toString('base64');
                                out = new ConcatSource(out,
                                    sourceMapURL(`data:application/json;charset=utf-8;base64,${base64}`)
                                );
                            } else {
                                if (optSourceMap !== 'hidden') {
                                    css += sourceMapURL(srcMapUrl || `${file}.map`); // @ToDo: compilation.getPath
                                }

                                out = new SourceMapSource(css, file, map, source, sourceMap);
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
