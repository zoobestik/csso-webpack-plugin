const csso = require('csso');

const getScopes = (ast, getModuleID) => {
    const scopes = {};
    csso.syntax.walk(ast, node => {
        if (node.type === 'ClassSelector') {
            const className = node.name;
            const moduleId = getModuleID(className);
            if (moduleId) {
                if (!scopes[moduleId]) scopes[moduleId] = {};
                scopes[moduleId][className] = true;
            }
        }
    });
    return Object.values(scopes).map(classes => Object.keys(classes));
};

export const scopeByClass = getModuleId => options => { // eslint-disable-line import/prefer-default-export
    const opts = options || {};
    const beforeCompress = opts.beforeCompress;
    return {
        usage: {},
        ...opts,
        beforeCompress: (ast, cssoOptions) => {
            const scopes = cssoOptions.usage.scopes || [];
            cssoOptions.usage = {
                ...cssoOptions.usage,
                scopes: [...getScopes(ast, getModuleId), ...scopes],
            };
            if (beforeCompress) beforeCompress(ast, cssoOptions);
        },
    };
};
