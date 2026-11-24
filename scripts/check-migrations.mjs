// Applied migrations are immutable: compares every `modules/<id>/migrations/*.sql` with the state at the
// latest tag (or `--base <ref>`). Changed or deleted files → error; new files are allowed.
// Line endings are ignored (CRLF/LF), like the core's checksum.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const git = (...args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();
const i = process.argv.indexOf('--base');
let base = i > 0 ? process.argv[i + 1] : '';
if (!base) {
	try {
		base = git('describe', '--tags', '--abbrev=0');
	} catch {
		console.log('No tag yet – nothing to compare.');
		process.exit(0);
	}
}
const norm = (s) => s.replace(/\r\n?/g, '\n');
const files = git('ls-tree', '-r', '--name-only', base, '--', 'modules')
	.split('\n')
	.filter((f) => /^modules\/[^/]+\/migrations\/[^/]+\.sql$/.test(f));
const problems = [];
for (const f of files) {
	const abs = join(ROOT, f);
	if (!existsSync(abs)) {
		problems.push(`deleted: ${f}`);
		continue;
	}
	const before = norm(git('show', `${base}:${f}`));
	if (before.trim() !== norm(readFileSync(abs, 'utf8')).trim()) problems.push(`changed: ${f}`);
}
if (problems.length) {
	console.error(
		`Applied migrations changed since ${base}:\n${problems.map((p) => `✗ ${p}`).join('\n')}`
	);
	process.exit(1);
}
console.log(`Migrations unchanged since ${base} (${files.length} files).`);
