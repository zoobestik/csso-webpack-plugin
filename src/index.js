import path from 'path';
import csso from 'csso';
import RawSource from 'webpack-sources/lib/RawSource';
import SourceMapSource from 'webpack-sources/lib/SourceMapSource';
import { SourceMapConsumer } from 'source-map';

const filterDefault = file => file.endsWith('.css');
const createRegexpFilter = regex => str => regex.test(str);
const isFilterType = inst => typeof inst === 'function' || inst instanceof RegExp;

const getOutputAssetFilename = postfix => file => {
    const parsed = path.parse(file);
    parsed.ext = `.${postfix}${parsed.ext}`;
    parsed.base = `${parsed.name}${parsed.ext}`;
    return path.format(parsed);
};

const pluginName = 'csso-webpack-plugin';

const unCamelCase = str => str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);

/*
    New webpack 4 API,
    for webpack 2-3 compatibility used .plugin('...', cb)
 */
const pluginCompatibility = (caller, hook, tapAction, cb) => {
    if (caller.hooks) {
        caller.hooks[hook][tapAction](pluginName, cb);
        return;
    }

    caller.plugin(unCamelCase(hook), cb);
};

const tapOptimizeChunkAssets = (compiler, compilation, cb) => {
    /*
     New webpack 5 API,
     for webpack 4 are using optimizeChunkAssets
   */
    if (compilation.hooks && compilation.hooks.processAssets) {
        compilation.hooks.processAssets.tapPromise(
            {
                name: pluginName,
                stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_SIZE,
                additionalAssets: true,
            },
            assets => cb(Object.keys(assets)),
        );
        return;
    }

    pluginCompatibility(compilation, 'optimizeChunkAssets', 'tapAsync', (chunks, done) => {
        Promise.all(
            chunks.map(chunk => cb(chunk.files)),
        )
            /*  it's important not to pass any args inside `done`
                        NOT: .then(done), ONLY: .then(() => done()) */
            .then(() => done());
    });
};

const getAsset = (compilation, name) => {
    if (compilation.getAsset) {
        const { source } = compilation.getAsset(name);
        return source;
    }

    return compilation.assets[name];
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
        pluginCompatibility(compiler, 'compilation', 'tap', compilation => {
            const options = this.options;
            const { pluginOutputPostfix } = this;

            const compress = assets => Promise.all(assets.map(async name => {
                try {
                    if (!this.filter(name)) { return; }

                    let source;
                    let sourceMap;

                    const asset = getAsset(compilation, name);

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

                    let fileOutput = name;

                    if (pluginOutputPostfix) {
                        fileOutput = pluginOutputPostfix(name);
                    }

                    let { css, map } = csso.minify(source, { // eslint-disable-line prefer-const
                        ...options,
                        filename: fileOutput,
                        sourceMap: Boolean(compiler.options.devtool),
                    });

                    if (map && sourceMap) {
                        const consumerMap = await new SourceMapConsumer(sourceMap);
                        map.applySourceMap(consumerMap, fileOutput);
                    }

                    if (!map) {
                        map = sourceMap;
                    }

                    compilation.assets[fileOutput] = map
                        ? new SourceMapSource(css, fileOutput, map.toJSON ? map.toJSON() : map)
                        : new RawSource(css);
                } catch (err) {
                    const prefix = `${name} from CssoWebpackPlugin\n`;
                    const { message, parseError, stack } = err;
                    let error = `${message} ${stack}`;

                    if (parseError) {
                        error = `${message} [${name}:${parseError.line}:${parseError.column}]`;
                    }

                    compilation.errors.push(new Error(`${prefix}${error}`));
                }
            }));

            tapOptimizeChunkAssets(compiler, compilation, compress);
        });
    }
}
