#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { getTarget, getBinaryName } = require('./platform');

const BIN_DIR = path.join(__dirname, 'bin');
const BINARY_PATH = path.join(BIN_DIR, getBinaryName());

function getVersion() {
  try {
    const pkg = require('./package.json');
    return pkg.version;
  } catch {
    return 'latest';
  }
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        file.close();
        fs.unlinkSync(dest);
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        file.close();
        fs.unlinkSync(dest);
        reject(new Error(`Download failed with status ${res.statusCode}`));
        return;
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', (err) => {
      file.close();
      fs.unlinkSync(dest, () => {});
      reject(err);
    });
  });
}

async function install() {
  if (fs.existsSync(BINARY_PATH)) {
    console.log('zarathustra binary already installed');
    return;
  }

  fs.mkdirSync(BIN_DIR, { recursive: true });

  const target = getTarget();
  const version = getVersion();

  const url = `https://github.com/SURUJ404/Zarathustra/releases/download/v${version}/zarathustra-${target}.tgz`;

  console.log(`Downloading zarathustra ${version} for ${target}...`);
  console.log(`  ${url}`);

  const tarball = path.join(BIN_DIR, `zarathustra-${target}.tgz`);

  try {
    await download(url, tarball);
    execSync(`tar xzf "${tarball}" -C "${BIN_DIR}"`, { stdio: 'inherit' });
    fs.unlinkSync(tarball);
    fs.chmodSync(BINARY_PATH, 0o755);
    console.log(`Installed zarathustra binary at ${BINARY_PATH}`);
  } catch (err) {
    console.error('Failed to download prebuilt binary:', err.message);
    console.error('Falling back to building from source...');
    buildFromSource();
  }
}

function buildFromSource() {
  const repoRoot = path.resolve(__dirname, '..');
  console.log(`Building zarathustra from source in ${repoRoot}...`);
  execSync('cargo build --release --package zarathustra_cli', {
    cwd: repoRoot,
    stdio: 'inherit',
  });
  const src = path.join(repoRoot, 'target', 'release', getBinaryName());
  fs.copyFileSync(src, BINARY_PATH);
  fs.chmodSync(BINARY_PATH, 0o755);
  console.log(`Built and installed zarathustra binary at ${BINARY_PATH}`);
}

install().catch((err) => {
  console.error('Installation failed:', err.message);
  process.exit(1);
});
