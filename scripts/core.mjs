// Runs a command in the core (`.core`) with this repo's modules: `node scripts/core.mjs <command> [args…]`
//
// Examples (see package.json): check · test · build · e2e · demo · lint
// The core finds the modules via ATRIUM_MODULES_DIR (absolute path to ./modules).
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CORE = join(ROOT, '.core');
const MODULES = join(ROOT, 'modules').replace(/\\/g, '/');

if (!existsSync(join(CORE, 'node_modules'))) {
	console.error('Core not set up – run `npm run setup` first.');
	process.exit(1);
}

const [cmd, ...rest] = process.argv.slice(2);
const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';

/** @type {Record<string, [string, string[]]>} */
const COMMANDS = {
	check: [npm, ['run', 'check']],
	// only the module tests (core tests run in the core repo); passes while there are no modules yet
	test: [npx, ['vitest', 'run', MODULES, '--passWithNoTests', ...rest]],
	build: [npm, ['run', 'build']],
	// lint/format from this repo's root (own eslint.config.js loads the core's, own .prettierrc)
	lint: [npx, ['eslint', '--no-error-on-unmatched-pattern', 'modules', 'scripts', ...rest]],
	format: [npx, ['prettier', '--check', 'modules', 'scripts', ...rest]],
	e2e: [npx, ['playwright', 'test', '--project', 'modules', '--project', 'integration', ...rest]],
	demo: ['node', ['scripts/demo-server.mjs', ...rest]]
};

/** Commands that run in the module repo itself (not in `.core`) */
const IN_REPO = new Set(['lint', 'format']);

const entry = COMMANDS[cmd ?? ''];
if (!entry) {
	console.error(`Unknown command "${cmd ?? ''}". Available: ${Object.keys(COMMANDS).join(', ')}`);
	process.exit(2);
}
const [bin, args] = entry;
const r = spawnSync(bin, args, {
	cwd: IN_REPO.has(cmd) ? ROOT : CORE,
	stdio: 'inherit',
	shell: process.platform === 'win32',
	env: { ...process.env, ATRIUM_MODULES_DIR: MODULES }
});
process.exit(r.status ?? 1);
