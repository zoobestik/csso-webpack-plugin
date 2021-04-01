const runIntegrations = require('../lib/integrations.js');

describe('Integrations with webpack 5', function() {
    runIntegrations.call(this, __dirname, '5');
});
