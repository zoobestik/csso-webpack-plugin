const existsSync = require('fs').existsSync;
const lstatSync = require('fs').lstatSync;
const rmdirSync = require('fs').rmdirSync;
const readdirSync = require('fs').readdirSync;
const unlinkSync = require('fs').unlinkSync;
const join = require('path').join;

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

/**
 * Recursively and forcefully removes a directory or file.
 * @param {string} targetPath - The path to the file or directory to delete.
 */
function deleteRecursiveSync(targetPath) {
    // Check if the path exists
    if (!existsSync(targetPath)) {
        return; // Nothing to delete
    }

    // We'll do an iterative post-order traversal to avoid deep recursion.
    // Use a stack for directories to process; each entry: { path, visited }
    const stack = [{ path: targetPath, visited: false }];

    while (stack.length) {
        const current = stack.pop();
        const curPath = current.path;

        // If path was removed during earlier ops, skip safely
        if (!existsSync(curPath)) continue;

        const stats = lstatSync(curPath); // lstat: don't follow symlinks

        if (!stats.isDirectory()) {
            // File or symlink — delete immediately
            unlinkSync(curPath);
            continue;
        }

        if (!current.visited) {
            // First time we see this directory: push back as visited,
            // then push its children to ensure children are removed first
            stack.push({ path: curPath, visited: true });

            // Read children and schedule them for deletion
            const files = readdirSync(curPath);
            for (let i = 0; i < files.length; i++) {
                stack.push({ path: join(curPath, files[i]), visited: false });
            }
        } else {
            // All children should be deleted by now — remove the directory itself
            rmdirSync(curPath);
        }
    }
}

module.exports = {
    setTestTimeout,
    deleteRecursiveSync,
};
