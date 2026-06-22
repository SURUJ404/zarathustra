#!/usr/bin/env node

const { execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');

function getBinaryPath() {
  const binaryName = process.platform === 'win32' ? 'zarathustra.exe' : 'zarathustra';
  const paths = [
    path.join(__dirname, binaryName),
    path.join(__dirname, '..', 'bin', binaryName),
    path.join(__dirname, '..', '..', 'target', 'release', binaryName),
  ];
  for (const p of paths) {
    if (fs.existsSync(p)) return p;
  }
  throw new Error(
    'zarathustra binary not found. Run `npm install` or build manually with `cargo build --release --package zarathustra_cli`'
  );
}

function main() {
  const binary = getBinaryPath();
  const args = process.argv.slice(2);

  try {
    const result = execFileSync(binary, args, {
      stdio: 'inherit',
      env: { ...process.env },
    });
    process.exit(result.status ?? 0);
  } catch (err) {
    process.exit(err.status ?? 1);
  }
}

main();
