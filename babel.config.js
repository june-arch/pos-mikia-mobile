module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@shared-types': '../packages/shared-types',
            '@shared-api': '../packages/shared-api',
            '@shared-auth': '../packages/shared-auth',
          },
        },
      ],
    ],
  };
};
