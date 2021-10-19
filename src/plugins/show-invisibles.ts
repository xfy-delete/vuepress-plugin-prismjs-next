import Prism from 'prismjs';
import 'prismjs/plugins/show-invisibles/prism-show-invisibles';

Prism.hooks.add('before-tokenize', (env) => {
  Prism.hooks.run('before-highlight', env);
});
