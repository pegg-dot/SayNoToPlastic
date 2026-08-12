#!/usr/bin/env node
import { spawn } from 'node:child_process';

const args = process.argv.slice(2);
let timeoutMs = 180000;
let killAfterMs = 10000;
let separator = args.indexOf('--');
if (separator === -1) {
  console.error('usage: run-with-timeout.mjs [--timeout-ms N] [--kill-after-ms N] -- command [args...]');
  process.exit(64);
}

for (let i = 0; i < separator; i += 1) {
  if (args[i] === '--timeout-ms') timeoutMs = Number(args[++i]);
  else if (args[i] === '--kill-after-ms') killAfterMs = Number(args[++i]);
  else {
    console.error(`unknown option: ${args[i]}`);
    process.exit(64);
  }
}

if (!Number.isFinite(timeoutMs) || timeoutMs <= 0 || !Number.isFinite(killAfterMs) || killAfterMs < 0) {
  console.error('timeout values must be positive finite numbers');
  process.exit(64);
}

const command = args[separator + 1];
const commandArgs = args.slice(separator + 2);
if (!command) {
  console.error('missing command after --');
  process.exit(64);
}

const detached = process.platform !== 'win32';
const child = spawn(command, commandArgs, {
  stdio: 'inherit',
  env: process.env,
  detached,
});

let timedOut = false;
let hardKillTimer;
const terminate = () => {
  if (child.exitCode !== null || child.signalCode !== null) return;
  timedOut = true;
  try {
    if (detached) process.kill(-child.pid, 'SIGTERM');
    else child.kill('SIGTERM');
  } catch {}
  hardKillTimer = setTimeout(() => {
    if (child.exitCode !== null || child.signalCode !== null) return;
    try {
      if (detached) process.kill(-child.pid, 'SIGKILL');
      else child.kill('SIGKILL');
    } catch {}
  }, killAfterMs);
  hardKillTimer.unref?.();
};

const timeoutTimer = setTimeout(terminate, timeoutMs);
timeoutTimer.unref?.();

child.on('error', (error) => {
  clearTimeout(timeoutTimer);
  if (hardKillTimer) clearTimeout(hardKillTimer);
  console.error(error.message);
  process.exit(69);
});

child.on('exit', (code, signal) => {
  clearTimeout(timeoutTimer);
  if (hardKillTimer) clearTimeout(hardKillTimer);
  if (timedOut) {
    console.error(`Command exceeded ${timeoutMs}ms and was terminated.`);
    process.exit(124);
  }
  if (signal) {
    console.error(`Command terminated by ${signal}.`);
    process.exit(128);
  }
  process.exit(code ?? 1);
});
