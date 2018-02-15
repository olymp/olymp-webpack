const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const newer = require('gulp-changed');
const babel = require('gulp-babel');
const watch = require('gulp-watch');
const debug = require('gulp-debug');
const path = require('path');

process.env.NODE_ENV = 'production';

const root = process.cwd();

const { packages } = require(path.resolve(root, 'lerna.json'));

const src = [];
packages.forEach(x => {
  src.push(`${root}/${x}*/*.es6`);
  src.push(`!${root}/${x}/node_modules/**/*`);
  src.push(`!${root}/${x}/node_modules/**`);
  src.push(`!${root}/${x}/node_modules`);
});
const dest = '.';

const babelOptions = {
  presets: [require.resolve('olymp-lerna/babel')],
  plugins: [
    'transform-decorators-legacy',
    'lodash',
    ['import', { libraryName: 'antd', style: true }],
    [
      'transform-imports',
      {
        antd: {
          transform: 'antd/lib/${member}',
          kebabCase: true,
          preventFullImport: true
        },
        'date-fns': {
          transform: 'date-fns/${member}',
          preventFullImport: true,
          camelCase: true
        },
        'olymp-icons': {
          transform: 'olymp-icons/lib/${member}',
          kebabCase: true,
          preventFullImport: true
        }
      }
    ]
  ]
};

const compile = x =>
  x
    .pipe(plumber())
    .pipe(debug())
    .pipe(newer(dest, { extension: '.js' }))
    .pipe(sourcemaps.init())
    .pipe(babel(babelOptions))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(dest));

exports.watch = () => {
  compile(watch(src, { ignoreInitial: false, base: dest, dot: true }));
};

exports.build = () => {
  compile(watch(src, { ignoreInitial: false, base: dest, dot: true }));
};
