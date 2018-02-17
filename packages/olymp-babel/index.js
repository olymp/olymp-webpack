module.exports = ({ isLibrary, isDev, isFlowEnabled, transform }) => ({
  presets: [
    [
      'env',
      {
        modules: isLibrary ? 'commonjs' : false,
        loose: true,
        targets: { node: 'current', browsers: ['last 2 versions'] },
        es2015: {
          modules: isLibrary ? 'commonjs' : false,
          loose: true,
        },
      },
    ],
    [
      'react',
      {
        development: !!isDev,
      },
    ],
    //  '@babel/typescript',
  ].filter(Boolean),
  plugins: [
    'transform-runtime',
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
  ].filter(Boolean),
});
