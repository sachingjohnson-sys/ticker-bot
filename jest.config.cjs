module.exports = {
  preset: 'ts-jest/presets/default-esm', // <-- ESM-compatible preset
  testEnvironment: 'node',
  testMatch: [
    '**/tests/**/*.test.ts',
    '**/__tests__/**/*.test.ts',
    '**/?(*.)+(spec|test).ts',
  ],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testTimeout: 30000,
  extensionsToTreatAsEsm: ['.ts'], // critical for ESM TS files
};
