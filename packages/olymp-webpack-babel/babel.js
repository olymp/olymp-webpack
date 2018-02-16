export default ({ transform = {}, isProd, isNode, isDev }) => {
  const babelOptions = require('olymp-babel')({ isDev });

  if (isProd) {
    // babelOptions.plugins.push('graphql-tag');
  }

  if (!isNode && isDev) {
    babelOptions.plugins.push('extract-hoc/babel');
    babelOptions.plugins.push('react-hot-loader/babel');
  }
  return babelOptions;
};
