module.exports = ({ isLibrary, isDev, isFlowEnabled, transform }) => ({
  passPerPreset: true,
  presets: [
    { plugins: ['transform-runtime'] },
    {
      passPerPreset: false,
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
        'react',
      ],
    },
  ].filter(Boolean),
  plugins: [
    'transform-runtime',
    'syntax-dynamic-import',
    'transform-decorators-legacy',
    'transform-object-rest-spread',
    'transform-class-properties',
    'transform-object-rest-spread',
    !isDev && 'transform-react-constant-elements',
    !isDev && 'transform-react-pure-class-to-function',
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
