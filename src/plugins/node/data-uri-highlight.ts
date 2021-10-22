import Prism from 'prismjs';
import 'prismjs/plugins/data-uri-highlight/prism-data-uri-highlight';

Prism.hooks.add('before-tokenize', (env) => {
  Prism.hooks.run('before-highlight', env);
});
