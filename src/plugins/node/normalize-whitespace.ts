import Prism from 'prismjs';
import 'prismjs/plugins/normalize-whitespace/prism-normalize-whitespace';

Prism.plugins.NormalizeWhitespace.setDefaults({
  'remove-trailing': true,
  'remove-indent': true,
  'remove-initial-line-feed': true,
  'left-trim': true,
  'right-trim': true,
});

Prism.hooks.add('before-tokenize', (env) => {
  if (Prism.plugins.normalizeWhitespace) {
    Prism.hooks.run('before-sanity-check', env);
  }
});
