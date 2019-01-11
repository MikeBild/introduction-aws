const path = require('path');

module.exports = (baseConfig, env, defaultConfig) => {
  defaultConfig.module.rules.push({
    test    : /\.(graphql|gql)$/,
    exclude : /node_modules/,
    loader  : 'graphql-tag/loader',
  });
  // defaultConfig.resolve.extensions.push('.ts', '.tsx');
  return defaultConfig;
};
