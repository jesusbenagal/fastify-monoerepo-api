module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.ts", "**/__tests__/**/*.test.ts"],
  moduleFileExtensions: ["ts", "js", "json"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  verbose: true,
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  maxWorkers: 1,
};
