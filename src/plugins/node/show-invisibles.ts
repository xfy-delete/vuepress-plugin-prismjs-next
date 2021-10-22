import Prism from 'prismjs';

const invisibles = {
  tab: /\t/,
  crlf: /\r\n/,
  lf: /\n/,
  cr: /\r/,
  space: / /,
};

function handleToken(tokens, name) {
  const value = tokens[name];
  const type = Prism.util.type(value);
  switch (type) {
    case 'RegExp': {
      const inside = {};
      tokens[name] = {
        pattern: value,
        inside,
      };
      addInvisibles(inside);
      break;
    }
    case 'Array': {
      for (let i = 0, l = value.length; i < l;) {
        handleToken(value, i);
        i += 1;
      }
      break;
    }
    default: {
      const inside = value.inside || (value.inside = {});
      addInvisibles(inside);
      break;
    }
  }
}

function addInvisibles(grammar) {
  if (!grammar || grammar.tab) {
    return;
  }
  for (const name in invisibles) {
    if (invisibles.hasOwnProperty(name)) {
      grammar[name] = invisibles[name];
    }
  }
  for (const name in grammar) {
    if (grammar.hasOwnProperty(name) && !invisibles[name]) {
      if (name === 'rest') {
        addInvisibles(grammar.rest);
      } else {
        handleToken(grammar, name);
      }
    }
  }
}

Prism.hooks.add('before-tokenize', (env) => {
  if (Prism.plugins.showInvisibles) {
    addInvisibles(env.grammar);
  }
});
