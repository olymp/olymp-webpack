module.exports = ({ transform, isLibrary, isDev }) => {
  const babelOptions = {
    presets: [
      'react',
      [
        'env',
        {
          modules: isLibrary ? 'commonjs' : false,
          loose: true,
          targets: { node: '6.10', browsers: ['last 2 versions'] },
          es2015: {
            modules: isLibrary ? 'commonjs' : false,
            loose: true,
          },
        },
      ],
    ],
    plugins: [
      'transform-runtime',
      'syntax-dynamic-import',
      'transform-object-rest-spread',
      // 'transform-es2015-destructuring',
      'transform-decorators-legacy',
      'transform-class-properties',
      'transform-react-constant-elements',
      'transform-es2015-classes',
      'transform-react-pure-class-to-function',
      'lodash',
      // 'reflective-bind',
      // 'babel-plugin-fela',
      ['import', { libraryName: 'antd', style: true }],
      [
        'transform-imports',
        Object.assign({}, transform || {}, {
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
        }),
      ],
    ],
  };

  return babelOptions;
};
