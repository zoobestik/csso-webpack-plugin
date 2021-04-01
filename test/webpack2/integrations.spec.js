const runIntegrations = require('../lib/integrations.js');

describe('Integrations with webpack 2', function() {
    runIntegrations.call(this, __dirname, '2');
});
