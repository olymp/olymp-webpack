const path = require('path');

module.exports = (
  config,
  { isWeb, isElectronMain, isElectronRenderer, isDev, isNode, entry, target },
  webpack
) => {
  if (entry && entry.indexOf('?') !== -1) {
    config.resolve.alias.__resourceQuery = entry.split('?')[1];
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.__RESOURCE_QUERY': `"${entry.split('?')[1]}"`
      })
    );
  }
  if (isElectronRenderer) {
    if (isDev) {
      config.entry.app = [
        'react-hot-loader/patch',
        `webpack-dev-server/client?${config.output.publicPath}`,
        'webpack/hot/only-dev-server',
        'babel-polyfill',
        entry || 'olymp-webpack-electron/entry'
      ];
    } else {
      config.entry.app = [
        'babel-polyfill',
        entry || 'olymp-webpack-electron/entry'
      ];
    }
  } else if (isElectronMain) {
    if (isDev) {
      config.entry.main = [
        'webpack/hot/poll?1000',
        'babel-polyfill',
        entry || 'olymp-webpack-electron/main'
      ];
    } else {
      config.entry.main = [
        'babel-polyfill',
        entry || 'olymp-webpack-electron/main'
      ];
    }
  } else if (target === 'lambda') {
    if (isDev) {
      config.entry.app = [
        'babel-polyfill',
        'webpack/hot/poll?1000',
        entry || 'olymp-server/entry'
      ];
    } else {
      config.entry.app = ['babel-polyfill', entry || 'olymp-server/entry'];
    }
  } else if (isNode) {
    if (isDev) {
      config.entry.app = [
        'babel-polyfill',
        'webpack/hot/poll?1000',
        entry || 'olymp-server/entry'
      ];
    } else {
      config.entry.app = ['babel-polyfill', entry || 'olymp-server/entry'];
    }
  } else if (isWeb) {
    if (isDev) {
      config.entry.app = [
        'react-hot-loader/patch',
        `webpack-dev-server/client?${config.output.publicPath}`,
        'webpack/hot/only-dev-server',
        'babel-polyfill',
        'olymp-webpack-pwa/offline',
        entry || 'olymp-webpack-pwa/entry'
      ];
    } else {
      config.entry.app = [
        'babel-polyfill',
        'olymp-webpack-pwa/offline',
        entry || 'olymp-webpack-pwa/entry'
      ];
    }
  }
  return config;
};
