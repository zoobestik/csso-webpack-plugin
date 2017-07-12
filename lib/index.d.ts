declare module 'csso-webpack-plugin' {
    type PluginOptions = any;
    type PluginFilterFn = (file: string) => boolean;
    type PluginFilter = PluginFilterFn | RegExp;

    export default class CssoWebpackPlugin {
        private options: PluginOptions;
        private filter: PluginFilterFn;

        public constructor(options?: PluginOptions, filter?: PluginFilter);
    }

    type PluginPresets = {
        scopeByClass: (getModuleID: (className: string) => string) => (options?: PluginOptions) => PluginOptions
    };

    export const presets: PluginPresets;
}
