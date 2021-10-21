import Prism from 'prismjs';

const autoLinkerProcess = (grammar: Prism.Grammar): Prism.Grammar => {
  if (Prism.plugins.autolinker) {
    Prism.plugins.autolinker.processGrammar(grammar);
  }
  return grammar;
};

const dataURI = {
  pattern: /(.)\bdata:[^\/]+\/[^,]+,(?:(?!\1)[\s\S]|\\\1)+(?=\1)/,
  lookbehind: true,
  inside: {
    'language-css': {
      pattern: /(data:[^\/]+\/(?:[^+,]+\+)?css,)[\s\S]+/,
      lookbehind: true,
    },
    'language-javascript': {
      pattern: /(data:[^\/]+\/(?:[^+,]+\+)?javascript,)[\s\S]+/,
      lookbehind: true,
    },
    'language-json': {
      pattern: /(data:[^\/]+\/(?:[^+,]+\+)?json,)[\s\S]+/,
      lookbehind: true,
    },
    'language-markup': {
      pattern: /(data:[^\/]+\/(?:[^+,]+\+)?(?:html|xml),)[\s\S]+/,
      lookbehind: true,
    },
  },
};

const candidates = ['url', 'attr-value', 'string'];

Prism.plugins.dataURIHighlight = {
  processGrammar(grammar) {
    if (!grammar || grammar['data-uri']) {
      return;
    }
    // @ts-ignore
    Prism.languages.DFS(grammar, function (this: any, key, def, type) {
      if (candidates.indexOf(type) > -1 && !Array.isArray(def)) {
        if (!def.pattern) {
          this[key] = {
            pattern: def,
          };
          def = this[key];
        }
        def.inside = def.inside || {};
        if (type === 'attr-value') {
          Prism.languages.insertBefore('inside', def.inside['url-link'] ? 'url-link' : 'punctuation', {
            'data-uri': dataURI,
          }, def);
        } else if (def.inside['url-link']) {
          Prism.languages.insertBefore('inside', 'url-link', {
            'data-uri': dataURI,
          }, def);
        } else {
          def.inside['data-uri'] = dataURI;
        }
      }
    });
    grammar['data-uri'] = dataURI;
  },
};

Prism.hooks.add('before-tokenize', (env) => {
  if (Prism.plugins.dataUriHighlight && dataURI.pattern.test(env.code)) {
    for (const p in dataURI.inside) {
      if (dataURI.inside.hasOwnProperty(p)) {
        if (!dataURI.inside[p].inside && dataURI.inside[p].pattern.test(env.code)) {
          const langs = p.match(/^language-(.+)/);
          if (langs && langs.length > 2) {
            const lang = langs[1];
            if (Prism.languages[lang]) {
              dataURI.inside[p].inside = {
                rest: autoLinkerProcess(Prism.languages[lang]),
              };
            }
          }
        }
      }
    }
  }
  Prism.plugins.dataURIHighlight.processGrammar(env.grammar);
});
