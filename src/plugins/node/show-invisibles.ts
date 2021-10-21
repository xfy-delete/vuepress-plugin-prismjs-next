import Prism from 'prismjs';
import 'prismjs/plugins/show-invisibles/prism-show-invisibles';

Prism.hooks.add('before-tokenize', (env) => {
  if (Prism.plugins.showInvisibles) {
    Prism.hooks.run('before-highlight', env);
  }
});
