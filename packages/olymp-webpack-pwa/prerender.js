require('babel-polyfill');
const prerender = require('olymp/file');

module.exports = (path, urls, options) => {
  prerender(path, urls, Object.assign({}, { ssr: true }, options));
};
