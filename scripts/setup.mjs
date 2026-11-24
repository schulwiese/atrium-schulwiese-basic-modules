// Sets up the module repo: `npm run setup`
//
// 1. Fetch the core as git submodule `.core` (fixed tag, see .gitmodules) and install its dependencies
// 2. `node_modules` of this repo = link to `.core/node_modules` (junction on Windows), so module files
//    resolve the core's packages (Svelte, Zod, bits-ui …)
// 3. Install module-specific npm packages (field `npm` in `atrium-module.json`) into `modules/node_modules` –
//    exactly like the supervisor does when rebuilding on the server
import { execFileSync } from 'node:child_process';
import {
	existsSync,
	lstatSync,
	readFileSync,
	readdirSync,
	rmSync,
	symlinkSync,
	writeFileSync
} from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CORE = join(ROOT, '.core');
const MODULES = join(ROOT, 'modules');
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const run = (cmd, args, cwd) =>
	execFileSync(cmd, args, { cwd, stdio: 'inherit', shell: process.platform === 'win32' });

if (!existsSync(join(CORE, 'package.json'))) {
	console.log('== Fetching core submodule');
	run('git', ['submodule', 'update', '--init', '--recursive'], ROOT);
}

const corePkg = JSON.parse(readFileSync(join(CORE, 'package.json'), 'utf8'));
console.log(`== Core ${corePkg.name}@${corePkg.version}: dependencies`);
if (!existsSync(join(CORE, 'node_modules')) || process.argv.includes('--force'))
	run(npm, ['ci'], CORE);

console.log('== node_modules → .core/node_modules');
const link = join(ROOT, 'node_modules');
let stat = null;
try {
	stat = lstatSync(link);
} catch {
	// does not exist yet
}
if (stat && !stat.isSymbolicLink()) {
	console.error('node_modules is a real folder – please delete it and run setup again.');
	process.exit(1);
}
if (stat) rmSync(link, { force: true });
symlinkSync(join(CORE, 'node_modules'), link, 'junction');

console.log('== Module packages');
const known = new Set([
	...Object.keys(corePkg.dependencies ?? {}),
	...Object.keys(corePkg.devDependencies ?? {})
]);
const packages = {};
for (const id of readdirSync(MODULES).sort()) {
	const file = join(MODULES, id, 'atrium-module.json');
	if (!existsSync(file)) continue;
	const pkg = JSON.parse(readFileSync(file, 'utf8'));
	for (const [name, version] of Object.entries(pkg.npm ?? {})) {
		if (known.has(name)) continue;
		if (packages[name] && packages[name] !== version) {
			console.error(`Conflict: ${name} ${packages[name]} ≠ ${version} (${id})`);
			process.exit(1);
		}
		packages[name] = version;
	}
}
if (Object.keys(packages).length) {
	writeFileSync(
		join(MODULES, 'package.json'),
		JSON.stringify({ private: true, dependencies: packages }, null, '\t') + '\n'
	);
	run(
		npm,
		['install', '--ignore-scripts', '--no-audit', '--no-fund', '--legacy-peer-deps', '--omit=dev'],
		MODULES
	);
	// same rule as the supervisor on the server: remove copies of packages the core already has
	const { dedupeModulePackages } = await import(
		pathToFileURL(join(CORE, 'scripts', 'supervisor', 'lib.mjs')).href
	);
	const removed = dedupeModulePackages(MODULES, CORE, packages);
	if (removed.length) console.log(`taken from core: ${removed.join(', ')}`);
} else console.log('no module packages');

console.log('\nDone. Next steps: npm run check · npm test · npm run build · npm run demo');
