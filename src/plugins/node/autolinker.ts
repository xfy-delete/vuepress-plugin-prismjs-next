import Prism from 'prismjs';
import 'prismjs/plugins/autolinker/prism-autolinker';

const linkMd = /\[([^\]]+)\]\(([^)]+)\)/;

Prism.hooks.add('before-tokenize', (env) => {
  if (Prism.plugins.autoLinker) {
    Prism.hooks.run('before-highlight', env);
  }
});

Prism.hooks.add('wrap', (env) => {
  if (Prism.plugins.autoLinker && /-link$/.test(env.type)) {
    env.tag = 'a';
    let href = env.content;
    if (env.type === 'email-link' && href.indexOf('mailto:') !== 0) {
      href = `mailto:${href}`;
    } else if (env.type === 'md-link') {
      const match = env.content.match(linkMd);
      if (match) {
        href = match[2];
        env.content = match[1];
      }
    }
    env.attributes.href = href;
    if (env.type !== 'email-link') {
      env.attributes.target = '_blank';
    }
    env.attributes.style = 'text-decoration: underline;';
    try {
      env.content = decodeURIComponent(env.content);
    } catch (e) { }
  }
});
