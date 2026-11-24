// Checks the catalog `modules/atrium-modules.json`: every module with an `atrium-module.json` is listed (and vice
// versa), paths match, ids are unique, hard dependencies are in this repo or have a `source` link.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const MODULES = join(resolve(dirname(fileURLToPath(import.meta.url)), '..'), 'modules');
const catalog = JSON.parse(readFileSync(join(MODULES, 'atrium-modules.json'), 'utf8'));
const problems = [];
const inCatalog = new Map();
for (const e of catalog.modules ?? []) {
	if (inCatalog.has(e.id)) problems.push(`duplicate in catalog: ${e.id}`);
	inCatalog.set(e.id, e.path);
}
const onDisk = readdirSync(MODULES, { withFileTypes: true })
	.filter((d) => d.isDirectory() && existsSync(join(MODULES, d.name, 'atrium-module.json')))
	.map((d) => d.name);
for (const id of onDisk) if (!inCatalog.has(id)) problems.push(`missing from catalog: ${id}`);
for (const [id, path] of inCatalog) {
	const file = join(MODULES, path, 'atrium-module.json');
	if (!existsSync(file)) {
		problems.push(`catalog path without module: ${id} → ${path}`);
		continue;
	}
	const pkg = JSON.parse(readFileSync(file, 'utf8'));
	if (pkg.id !== id) problems.push(`id ${pkg.id} ≠ catalog entry ${id}`);
	for (const [dep, spec] of Object.entries(pkg.dependencies ?? {})) {
		if (!inCatalog.has(dep) && !spec.source)
			problems.push(`${id}: dependency ${dep} is neither in this repo nor has a source link`);
	}
}
if (problems.length) {
	console.error(problems.map((p) => `✗ ${p}`).join('\n'));
	process.exit(1);
}
console.log(`Catalog OK (${inCatalog.size} modules).`);
