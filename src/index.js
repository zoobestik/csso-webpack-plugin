import path from 'path';
import csso from 'csso';
import async from 'async';
import RawSource from 'webpack-sources/lib/RawSource';
import SourceMapSource from 'webpack-sources/lib/SourceMapSource';
import { SourceMapConsumer } from 'source-map';

const filterDefault = file => file.endsWith('.css');
const createRegexpFilter = regex => str => regex.test(str);
const isFilterType = inst => typeof inst === 'function' || inst instanceof RegExp;

const getOutputAssetFilename = postfix => file => {
    const parsed = path.parse(file);
    parsed.ext = `.${postfix}${parsed.ext}`;
    /* `base` for node <= 4 version required:
     *   https://travis-ci.org/zoobestik/csso-webpack-plugin/jobs/296380161#L525 */
    parsed.base = `${parsed.name}${parsed.ext}`;
    return path.format(parsed);
};


/*
    New webpack 4 API,
    for webpack 2-3 compatibility used .plugin('...', cb)
 */
const unCamelCase = str => str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);

const pluginCompatibility = (caller, hook, cb) => {
    if (caller.hooks) {
        caller.hooks[hook].tap('csso-webpack-plugin', cb);
    } else {
        caller.plugin(unCamelCase(hook), cb);
    }
};

export default class CssoWebpackPlugin {
    constructor(opts, filter) {
        this.options = opts;
        this.filter = filter;
        this.pluginOutputPostfix = null;

        if (isFilterType(opts) && filter === undefined) {
            this.filter = opts;
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

        const { pluginOutputPostfix, ...options } = this.options || {};

        if (pluginOutputPostfix) {
            this.pluginOutputPostfix = typeof pluginOutputPostfix === 'function'
                ? pluginOutputPostfix
                : getOutputAssetFilename(pluginOutputPostfix);
        }

        this.options = options;
    }

    apply(compiler) {
        pluginCompatibility(compiler, 'compilation', compilation => {
            const options = this.options;

            pluginCompatibility(compilation, 'optimizeChunkAssets', (chunks, done) => {
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
                                compilation.warnings.push(new Error('CssoWebpackPlugin: '
                                    + '“sourceMap” option is DEPRECATED. '
                                    + 'Use webpack “devtool” instead.\n\tFor more info about the usage see '
                                    + 'https://github.com/zoobestik/csso-webpack-plugin/releases/tag/v1.0.0-beta.8'));
                            }

                            let fileOutput = file;

                            if (this.pluginOutputPostfix) {
                                fileOutput = this.pluginOutputPostfix(file);
                            }

                            let { css, map } = csso.minify(source, { // eslint-disable-line prefer-const
                                ...options,
                                filename: fileOutput,
                                sourceMap: Boolean(compiler.options.devtool),
                            });

                            if (map && sourceMap) {
                                map.applySourceMap(new SourceMapConsumer(sourceMap), fileOutput);
                            }

                            if (!map) {
                                map = sourceMap;
                            }

                            compilation.assets[fileOutput] = map
                                ? new SourceMapSource(css, fileOutput, map.toJSON ? map.toJSON() : map)
                                : new RawSource(css);
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
