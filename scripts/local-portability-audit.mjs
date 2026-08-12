import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const install = read('scripts/install-ci.sh');
const build = read('scripts/build-verified.sh');
const helper = read('scripts/run-with-timeout.mjs');

const checks = [];
const expect = (condition, label) => checks.push({ ok: Boolean(condition), label });

expect(install.includes('"$(uname -s)" == "Darwin"'), 'install:ci has an explicit macOS path.');
expect(install.includes('npm ci --cache'), 'macOS install still uses locked npm ci rather than npm install.');
expect(install.includes('install.lock.d') && install.includes('mkdir "${lock_dir}"'), 'macOS install uses an atomic local lock instead of overlapping installs.');
expect(install.includes('run-with-timeout.mjs'), 'macOS install remains bounded by the cross-platform timeout helper.');
expect(install.includes('command -v flock') && install.includes('/proc/[0-9]*'), 'Sites/Linux defensive install path remains intact.');
expect(build.includes('if command -v timeout >/dev/null'), 'Build keeps the proven GNU timeout path when available.');
expect(build.includes('run-with-timeout.mjs'), 'Build falls back to the cross-platform timeout helper when GNU timeout is absent.');
expect(helper.includes("spawn(command, commandArgs") && helper.includes('SIGTERM') && helper.includes('SIGKILL'), 'Timeout helper implements bounded termination and hard-kill fallback.');
expect(helper.includes("process.platform !== 'win32'"), 'Timeout helper handles Unix process groups without assuming them on Windows.');

let failed = 0;
for (const check of checks) {
  console.log(`[${check.ok ? 'PASS' : 'FAIL'}] ${check.label}`);
  if (!check.ok) failed += 1;
}
console.log(`[SUMMARY] ${checks.length - failed} passed, ${failed} failed.`);
if (failed) process.exit(1);
