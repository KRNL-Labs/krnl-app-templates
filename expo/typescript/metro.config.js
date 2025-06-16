// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add additional exclusions to prevent MetaMask SDK issues
config.resolver.blacklistRE = [
  // Exclude problematic MetaMask SDK files
  /node_modules\/@metamask\/sdk\/dist\/browser\/es\/metamask-sdk\.js/,
];

module.exports = config;
