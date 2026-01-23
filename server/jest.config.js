module.exports = {
    testEnvironment: "node",
    testMatch: ["**/__tests__/**/*.test.js"],
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
    collectCoverage: true,
    collectCoverageFrom: [
        "server.js",
        "db/**/*.js",
        "!**/node_modules/**"
    ],
    coverageThreshold: {
        global: {
            branches: 40,
            functions: 50,
            lines: 60,
            statements: 60,
        },
    },
};