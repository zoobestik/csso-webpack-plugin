/**
 * Set test timeout in a way that works for both Jest and Mocha.
 *
 * @param {any} ctx - The test context (e.g., `this` inside describe/it for Mocha). Optional for Jest.
 * @param {number} ms - Timeout in milliseconds. Defaults to 5000.
 */
function setTestTimeout(ctx, ms = 5000) {
    // Jest: global `jest` with `setTimeout` function
    if (typeof jest !== 'undefined' && jest && typeof jest.setTimeout === 'function') {
        jest.setTimeout(ms);
        return;
    }

    const context = ctx || (typeof this !== 'undefined' ? this : undefined);

    if (context && typeof context.timeout === 'function') {
        context.timeout(ms);
        return;
    }

    throw Error('Unable to set test timeout');
}

module.exports = {
    setTestTimeout,
};
