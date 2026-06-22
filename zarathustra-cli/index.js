const { execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');

function getBinaryPath() {
  const binaryName = process.platform === 'win32' ? 'zarathustra.exe' : 'zarathustra';
  const paths = [
    path.join(__dirname, 'bin', binaryName),
    path.join(__dirname, '..', 'target', 'release', binaryName),
  ];
  for (const p of paths) {
    if (fs.existsSync(p)) return p;
  }
  const which = require('child_process').execSync('which zarathustra 2>/dev/null || true', { encoding: 'utf8' }).trim();
  if (which) return which;
  throw new Error('zarathustra binary not found. Run `npm install` first.');
}

function run(args, options = {}) {
  const binary = getBinaryPath();
  try {
    const stdout = execFileSync(binary, args, {
      encoding: 'utf8',
      maxBuffer: options.maxBuffer || 100 * 1024 * 1024,
      input: options.input,
      env: { ...process.env, ...options.env },
      cwd: options.cwd,
      timeout: options.timeout,
    });
    return { ok: true, stdout: stdout.trim(), stderr: '' };
  } catch (err) {
    return {
      ok: false,
      stdout: err.stdout?.trim() || '',
      stderr: err.stderr?.trim() || err.message,
    };
  }
}

const zarathustra = {
  compile(input, { curve = 'bn128' } = {}) {
    return run(['compile', '-i', input, '--curve', curve]);
  },

  inspect(input) {
    return run(['inspect', '-i', input]);
  },

  check(input) {
    return run(['check', '-i', input]);
  },

  computeWitness(input, { abi, args, output } = {}) {
    const cmd = ['compute-witness', '-i', input];
    if (abi) cmd.push('--abi', '-s', abi);
    if (output) cmd.push('--output', output);
    return run(cmd, { input: args ? JSON.stringify(args) : undefined });
  },

  setup(input) {
    return run(['setup', '-i', input]);
  },

  universalSetup({ curve = 'bn128', size = 16 } = {}) {
    return run(['universal-setup', '--curve', curve, '--size', String(size)]);
  },

  generateProof(input, witness, provingKey) {
    return run(['generate-proof', '-i', input, '-w', witness, '-p', provingKey]);
  },

  verify(verificationKey, proof) {
    return run(['verify', '-v', verificationKey, '-j', proof]);
  },

  exportVerifier(verificationKey) {
    return run(['export-verifier', '-i', verificationKey]);
  },

  printProof(proof) {
    return run(['print-proof', '-j', proof]);
  },

  generateSmtlib2(input) {
    return run(['generate-smtlib2', '-i', input]);
  },

  profile(input) {
    return run(['profile', '-i', input]);
  },

  mpc(subcommand, options = {}) {
    return run(['mpc', subcommand, ...Object.entries(options).flatMap(([k, v]) => [`--${k}`, String(v)])]);
  },

  nova(subcommand, options = {}) {
    return run(['nova', subcommand, ...Object.entries(options).flatMap(([k, v]) => [`--${k}`, String(v)])]);
  },

  raw(args, options = {}) {
    return run(args, options);
  },

  get binaryPath() {
    return getBinaryPath();
  },
};

module.exports = zarathustra;
