export interface RunResult {
  ok: boolean;
  stdout: string;
  stderr: string;
}

export interface CompileOptions {
  curve?: 'bn128' | 'bls12_381' | 'bls12_377' | 'bw6_761' | 'pallas' | 'vesta';
}

export interface WitnessOptions {
  abi?: string;
  args?: any[];
  output?: string;
}

export interface SetupOptions {
  curve?: string;
  size?: number;
}

export interface MpcOptions {
  [key: string]: string;
}

export interface RawOptions {
  maxBuffer?: number;
  input?: string;
  env?: Record<string, string>;
  cwd?: string;
  timeout?: number;
}

export interface ZarathustraAPI {
  compile(input: string, options?: CompileOptions): RunResult;
  inspect(input: string): RunResult;
  check(input: string): RunResult;
  computeWitness(input: string, options?: WitnessOptions): RunResult;
  setup(input: string): RunResult;
  universalSetup(options?: SetupOptions): RunResult;
  generateProof(input: string, witness: string, provingKey: string): RunResult;
  verify(verificationKey: string, proof: string): RunResult;
  exportVerifier(verificationKey: string): RunResult;
  printProof(proof: string): RunResult;
  generateSmtlib2(input: string): RunResult;
  profile(input: string): RunResult;
  mpc(subcommand: string, options?: MpcOptions): RunResult;
  nova(subcommand: string, options?: MpcOptions): RunResult;
  raw(args: string[], options?: RawOptions): RunResult;
  readonly binaryPath: string;
}

declare const zarathustra: ZarathustraAPI;
export default zarathustra;
