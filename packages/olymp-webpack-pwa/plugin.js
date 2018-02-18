const { resolve } = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const path = require('path');

module.exports = (
  config,
  { isWeb, isProd, serverMode, appRoot, folder, target },
  webpack
) => {
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env.SERVER_MODE': `${serverMode}`,
      'process.env.IS_SERVERLESS': `${serverMode === 'serverless'}`,
      'process.env.IS_SSR': `${serverMode === 'ssr'}`,
      'process.env.IS_STATIC': `${serverMode === 'static'}`,
    })
  );

  if (isWeb) {
    if (isProd) {
      const OfflinePlugin = require('offline-plugin');
      config.plugins.push(
        new HtmlWebpackPlugin({
          filename: 'offline.html',
          template: path.resolve(__dirname, 'serverless.js'),
          inject: false,
          /* minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        }, */
        })
      );
      config.plugins.push(
        new OfflinePlugin({
          responseStrategy: 'network-first',
          // externals: ['https://cdn.polyfill.io/v2/polyfill.min.js?callback=POLY'],
          autoUpdate: 1000 * 60 * 1,
          caches: {
            main: ['app.*.js', 'offline.html'],
            additional: [':externals:'],
            optional: ['*.js'],
          },
          updateStrategy: 'all',
          ServiceWorker: {
            events: true,
            navigateFallbackURL: '/offline.html',
          },
          AppCache: false,
        })
      );
    }
    if (serverMode === 'serverless' || serverMode === 'static') {
      config.plugins.push(
        new HtmlWebpackPlugin({
          filename: 'index.html',
          template: path.resolve(__dirname, 'serverless.js'),
          inject: false,
          /* minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        }, */
        })
      );
    }
    config.plugins.push(
      new CopyWebpackPlugin([
        {
          context: path.resolve('..', 'olymp', 'public'),
          from: '**/*',
          to: path.resolve(appRoot, folder, target.split('-')[0]),
        },
        {
          context: path.resolve(appRoot, 'public'),
          from: '**/*',
          to: path.resolve(appRoot, folder, target.split('-')[0]),
        },
      ])
    );
  }
  return config;
};
