module.exports = {
  presets: [
    'react',
    [
      'latest',
      {
        es2015: {
          modules: 'commonjs',
          // modules: false,
        },
      },
    ],
  ],
  plugins: [
    'syntax-dynamic-import',
    'transform-decorators-legacy',
    'transform-object-rest-spread',
    'transform-class-properties',
    'transform-object-rest-spread',
    'transform-react-constant-elements',
    'transform-react-pure-class-to-function',
    'lodash',
    ['import', { libraryName: 'antd', style: true }],
    [
      'transform-imports',
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
      },
    ],
  ],
};
