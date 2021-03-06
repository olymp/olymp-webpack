const path = require('path');
const rimraf = require('rimraf');
const webpack = require('webpack');
const notifier = require('node-notifier');
const jsonfile = require('jsonfile');
const { merge } = require('lodash');
// const FileSizeReporter = require('react-dev-utils/FileSizeReporter');
// const printFileSizesAfterBuild = FileSizeReporter.printFileSizesAfterBuild;

require('dotenv').config();

const createConfig = require(path.resolve(__dirname, 'webpack', 'config.js'));

const root = process.cwd();

const pckgOlymp =
  jsonfile.readFileSync(path.resolve(root, 'package.json'), {
    throws: false,
  }) || {};
const olymprc = merge(
  {
    app: './app',
    server: './server',
    plugins: [],
    modifyVars: {
      'menu-collapsed-width': '64px',
      'font-family-no-number':
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
      'font-family':
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
      'font-size-base': '15px',
      'primary-color': '#8e44ad',
    },
  },
  pckgOlymp.olymp || {},
  jsonfile.readFileSync(path.resolve(root, '.olymprc'), {
    throws: false,
  }) || {}
);

exports.start = () => {
  require(path.resolve(process.cwd(), '.dist', 'node', 'app'));
};

exports.build = options => {
  if (!Array.isArray(options)) {
    options = [options];
  }
  process.env.NODE_ENV = process.env.NODE_ENV || 'production';

  const compiler = webpack(
    options.map((config, i) => {
      rimraf.sync(path.resolve(root, '.dist', config.target));
      return createConfig(
        Object.assign({}, olymprc, config, {
          mode: 'production',
        })
      );
    })
  );

  return new Promise((yay, nay) => {
    compiler.run((err, compilation) => {
      if (err) {
        console.error(err);
        nay(err);
        return process.exit(1);
      }
      const stats = compilation.stats || [compilation];
      console.log('[webpack] the following asset bundles were built:');
      stats.forEach((c, i) => {
        console.log(c.toString());
        // console.log('File sizes after gzip:\n');
        // printFileSizesAfterBuild(c, null, null);
      });
      yay(stats);
    });
  });
};

exports.dev = options => {
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';
  const mode = process.env.NODE_ENV;
  if (!Array.isArray(options)) {
    options = [options];
  }
  const watch = {
    aggregateTimeout: 300,
    poll: false,
    ignored: /node_modules/,
  };

  const compiler = webpack(
    options.map(config =>
      createConfig(
        Object.assign({}, olymprc, config, {
          mode,
          port: config.port,
        })
      )
    )
  );

  options.forEach((config, i) => {
    const currentCompiler = compiler.compilers[i];
    if (
      config.target === 'node' ||
      config.target === 'lambda' ||
      config.target === 'electron-main'
    ) {
      currentCompiler.watch(watch, (err, compilation) => {
        if (err) {
          return console.log('[webpack] error:', err);
        }
        const stats = compilation.stats || [compilation];
        console.log('[webpack] the following asset bundles were built:');
        stats.forEach(c => console.log(c.toString()));
        notifier.notify('Ready');
      });
    } else {
      const WebpackDevServer = require('webpack-dev-server');
      const proxy = config.proxy || {};
      const server = new WebpackDevServer(currentCompiler, {
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        proxy: proxy || {},
        watchOptions: watch,
        inline: false,
        host: '0.0.0.0',
        port: config.port,
        disableHostCheck: true,
        historyApiFallback: true,
        hot: true,
        stats: {
          colors: true,
          hash: false,
          version: false,
          timings: false,
          assets: false,
          chunks: false,
          modules: false,
          reasons: false,
          children: false,
          source: false,
          errors: true,
          errorDetails: true,
          warnings: false,
          publicPath: false,
        },
      });
      console.log('WebpackDevServer listening to', config.port);
      server.listen(config.port);
    }
  });
  return compiler;
};
