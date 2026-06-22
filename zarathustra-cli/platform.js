const os = require('os');

const PLATFORM_MAP = {
  'linux': 'unknown-linux-gnu',
  'darwin': 'apple-darwin',
  'win32': 'pc-windows-msvc',
};

const ARCH_MAP = {
  'x64': 'x86_64',
  'arm64': 'aarch64',
};

function getTarget() {
  const plat = PLATFORM_MAP[process.platform];
  const arch = ARCH_MAP[process.arch];

  if (!plat) throw new Error(`Unsupported platform: ${process.platform}`);
  if (!arch) throw new Error(`Unsupported architecture: ${process.arch}`);

  return `${arch}-${plat}`;
}

function getBinaryName() {
  return process.platform === 'win32' ? 'zarathustra.exe' : 'zarathustra';
}

module.exports = { getTarget, getBinaryName };
