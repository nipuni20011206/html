module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'], // Make sure path is correct
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest', // Add this line for Babel transformation
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // For CSS modules if needed
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js', // For image mocks
  },
};
