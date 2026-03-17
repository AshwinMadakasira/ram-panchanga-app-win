/*
 * Build-tool teaching note:
 * Babel transforms app source so Expo can bundle it, and NativeWind plugs into that same pipeline.
 */
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo", "nativewind/babel"]
  };
};
