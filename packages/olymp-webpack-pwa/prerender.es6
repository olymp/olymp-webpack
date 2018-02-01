import 'babel-polyfill';
import prerender from 'olymp/file';

export default (path, urls, options) => {
  prerender(path, urls, { ssr: true, ...options });
};
