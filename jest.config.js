export default {
    transform: {
        "^.+\\.js$": "babel-jest"
    },
    testEnvironment: "node",
    setupFilesAfterEnv: ["<rootDir>/tests/setupTests.js"],
};
