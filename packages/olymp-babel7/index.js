/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = ({ isLibrary, isDev, isFlowEnabled }) => ({
  presets: [
    [
      // Latest stable ECMAScript features
      require('@babel/preset-env').default,
      {
        // `entry` transforms `@babel/polyfill` into individual requires for
        // the targeted browsers. This is safer than `usage` which performs
        // static code analysis to determine what's required.
        // This is probably a fine default to help trim down bundles when
        // end-users inevitably import '@babel/polyfill'.
        useBuiltIns: isLibrary ? 'usage' : 'entry',
        // Do not transform modules to CJS
        modules: isLibrary ? 'commonjs' : false,
      },
    ],
    [
      require('@babel/preset-react').default,
      {
        // Adds component stack to warning messages
        // Adds __self attribute to JSX which React will use for some warnings
        development: !!isDev,
      },
    ],
    isFlowEnabled && [require('@babel/preset-flow').default],
  ].filter(Boolean),
  plugins: [
    // Experimental macros support. Will be documented after it's had some time
    // in the wild.
    require('babel-plugin-macros'),
    // Necessary to include regardless of the environment because
    // in practice some other transforms (such as object-rest-spread)
    // don't work without it: https://github.com/babel/babel/issues/7215
    require('@babel/plugin-transform-destructuring').default,
    // class { handleClick = () => { } }
    require('@babel/plugin-proposal-decorators').default,
    [require('@babel/plugin-proposal-class-properties'), { loose: true }],
    // The following two plugins use Object.assign directly, instead of Babel's
    // extends helper. Note that this assumes `Object.assign` is available.
    // { ...todo, completed: true }
    [
      require('@babel/plugin-proposal-object-rest-spread').default,
      {
        useBuiltIns: true,
      },
    ],
    // Transforms JSX
    [
      require('@babel/plugin-transform-react-jsx').default,
      {
        useBuiltIns: true,
      },
    ],
    // Polyfills the runtime needed for async/await and generators
    [
      require('@babel/plugin-transform-runtime').default,
      isLibrary
        ? {
            polyfill: true,
            regenerator: false,
          }
        : {
            helpers: false,
            polyfill: false,
            regenerator: true,
          },
    ],
    !isDev && [
      // Remove PropTypes from production build
      require('babel-plugin-transform-react-remove-prop-types').default,
      {
        removeImport: true,
      },
    ],
    // function* () { yield 42; yield 43; }
    [
      require('@babel/plugin-transform-regenerator').default,
      {
        // Async functions are converted to generators by @babel/preset-env
        async: false,
      },
    ],
    // Adds syntax support for import()
    require('@babel/plugin-syntax-dynamic-import').default,
    require('@babel/plugin-transform-shorthand-properties').default,
    require('babel-plugin-lodash').default,
    [
      require('babel-plugin-import').default,
      { libraryName: 'antd', style: true },
    ],
    [
      require('babel-plugin-transform-imports'),
      {
        antd: {
          transform: 'antd/lib/${member}',
          kebabCase: true,
          preventFullImport: true,
        },
        'date-fns': {
          transform: 'date-fns/${member}',
          preventFullImport: true,
          camelCase: true,
        },
        'olymp-icons': {
          transform: 'olymp-icons/lib/${member}',
          kebabCase: true,
          preventFullImport: true,
        },
        icon88: {
          transform: 'icon88/lib/${member}',
          kebabCase: true,
          preventFullImport: true,
        },
      },
    ],
  ].filter(Boolean),
});
