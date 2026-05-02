const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('expo/metro-config').MetroConfig}
 */
const config = getDefaultConfig(__dirname);

// Exclude directories that Metro shouldn't watch or bundle
// This prevents crashes when Replit's skill directories have stale/missing paths
config.resolver.blockList = [
  new RegExp(`${path.resolve(__dirname, '.local').replace(/\\/g, '/')}.*`),
  new RegExp(`${path.resolve(__dirname, 'replit').replace(/\\/g, '/')}.*`),
  new RegExp(`${path.resolve(__dirname, 'android').replace(/\\/g, '/')}.*`),
  new RegExp(`${path.resolve(__dirname, 'ios').replace(/\\/g, '/')}.*`),
  new RegExp(`${path.resolve(__dirname, 'server').replace(/\\/g, '/')}.*`),
];

module.exports = config;
