declare module 'csso-webpack-plugin' {
    type PluginOptions = {
        [key: string]: any,
        usage: {
            [key: string]: any,
            scopes: (css: string, filename: string) => string[] | string[][];
        }
    };
    type PluginFilterFn = (file: string) => boolean;
    type PluginFilter = PluginFilterFn | RegExp;

    export default class CssoWebpackPlugin {
        private options: PluginOptions;
        private filter: PluginFilterFn;

        public constructor(options?: PluginOptions, filter?: PluginFilter);
    }
}
