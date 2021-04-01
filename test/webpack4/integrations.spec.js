const runIntegrations = require('../lib/integrations.js');

describe('Integrations with webpack 4', function() {
    runIntegrations.call(this, __dirname, '4');
});
