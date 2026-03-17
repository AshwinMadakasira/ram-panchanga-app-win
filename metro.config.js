/*
 * Build-tool teaching note:
 * Metro is the bundler for React Native. This config wraps the default Expo setup with NativeWind support.
 */
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, {
  input: "./global.css"
});
