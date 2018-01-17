const CopyWebpackPlugin = require('copy-webpack-plugin');
const StartServerPlugin = require('start-server-webpack-plugin');
const WebpackShellPlugin = require('./webpack-shell-plugin');
const DepsPlugin = require('./webpack-deps-plugin');

const path = require('path');

module.exports = (config, { isDev, appRoot, folder, target, entry }) => {
  if (target === 'lambda') {
    config.module.rules.push({
      test: /\.(yaml|yml)$/,
      use: [
        {
          loader: 'json-loader'
        },
        {
          loader: 'yaml-loader'
        }
      ]
    });
    if (isDev) {
      config.plugins.push(
        new StartServerPlugin({
          name: 'app.js'
          // nodeArgs: [`--inspect=${devPort + 1}`], // allow debugging
        })
      );
    } else {
      config.plugins.push(
        new CopyWebpackPlugin([
          {
            from: path.resolve(entry, 'serverless.yml'),
            to: path.resolve(appRoot, folder, target.split('-')[0])
          }
        ])
      );
      config.plugins.push(
        new DepsPlugin({
          root: appRoot,
          outDir: path.resolve(appRoot, folder, target.split('-')[0])
        })
      );
      config.plugins.push(
        new WebpackShellPlugin({
          onBuildEnd: [`cd ./.dist/lambda && npm i`],
          safe: true
        })
      );
    }
  }
  return config;
};
