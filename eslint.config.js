// ESLint of the module repo = the core's config (module boundaries, core internals, Svelte/TS rules),
// with patterns relative to this folder. Set the environment first, then load the core config.
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
process.env.ATRIUM_ESLINT_ROOT = root;
process.env.ATRIUM_MODULES_DIR ??= join(root, 'modules');

const core = (await import('./.core/eslint.config.js')).default;

export default [
	...core,
	{ ignores: ['.core/', 'modules/node_modules/', '.data/', 'test-results/', 'playwright-report/'] }
];
