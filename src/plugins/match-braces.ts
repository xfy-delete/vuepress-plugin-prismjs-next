export default function matchBraces(preElem) {
  function isActive(element, className, defaultActivation?) {
    const no = `no-${className}`;
    while (element) {
      const classList = element.classList;
      if (classList.contains(className)) {
        return true;
      }
      if (classList.contains(no)) {
        return false;
      }
      element = element.parentElement;
    }
    return !!defaultActivation;
  }
  function mapClassName(name) {
    return name;
  }

  const PARTNER = {
    '(': ')',
    '[': ']',
    '{': '}',
  };
  const NAMES = {
    '(': 'brace-round',
    '[': 'brace-square',
    '{': 'brace-curly',
  };
  const BRACE_ALIAS_MAP = {
    '${': '{',
  };

  const LEVEL_WARP = 12;

  let pairIdCounter = 0;

  const BRACE_ID_PATTERN = /^(pair-\d+-)(close|open)$/;

  function getPartnerBrace(brace) {
    const match = BRACE_ID_PATTERN.exec(brace.id);
    return match && document.querySelector(`#${match[1]}${match[2] === 'open' ? 'close' : 'open'}`);
  }

  function hoverBrace(this: any) {
    if (!isActive(this, 'brace-hover', true)) {
      return;
    }
    [this, getPartnerBrace(this)].forEach((e) => {
      e.classList.add(mapClassName('brace-hover'));
    });
  }

  function leaveBrace(this: any) {
    [this, getPartnerBrace(this)].forEach((e) => {
      e.classList.remove(mapClassName('brace-hover'));
    });
  }

  function clickBrace(this: any) {
    if (!isActive(this, 'brace-select', true)) {
      return;
    }

    [this, getPartnerBrace(this)].forEach((e) => {
      e.classList.add(mapClassName('brace-selected'));
    });
  }

  const code = preElem.querySelector('code');
  const pre = preElem;

  if (!pre || pre.tagName !== 'PRE') {
    return;
  }

  const toMatch: Array<any> = [];
  if (isActive(code, 'match-braces')) {
    toMatch.push('(', '[', '{');
  }

  if (toMatch.length === 0) {
    return;
  }

  if (!pre.__listenerAdded) {
    pre.addEventListener('mousedown', () => {
      const code = pre.querySelector('code');
      const className = mapClassName('brace-selected');
      Array.prototype.slice.call(code.querySelectorAll(`.${className}`)).forEach((e) => {
        e.classList.remove(className);
      });
    });
    Object.defineProperty(pre, '__listenerAdded', { value: true });
  }

  const punctuation = Array.prototype.slice.call(
    code.querySelectorAll(`span.${mapClassName('token')}.${mapClassName('punctuation')}`),
  );

  const allBraces: Array<any> = [];

  toMatch.forEach((open) => {
    const close = PARTNER[open];
    const name = mapClassName(NAMES[open]);

    const pairs: Array<any> = [];
    const openStack: Array<any> = [];

    for (let i = 0; i < punctuation.length;) {
      const element = punctuation[i];
      if (element.childElementCount === 0) {
        let text = element.textContent;
        text = BRACE_ALIAS_MAP[text] || text;
        if (text === open) {
          allBraces.push({ index: i, open: true, element });
          element.classList.add(name);
          element.classList.add(mapClassName('brace-open'));
          openStack.push(i);
        } else if (text === close) {
          allBraces.push({ index: i, open: false, element });
          element.classList.add(name);
          element.classList.add(mapClassName('brace-close'));
          if (openStack.length) {
            pairs.push([i, openStack.pop()]);
          }
        }
      }
      i += 1;
    }

    pairs.forEach((pair) => {
      const pairId = `pair-${pairIdCounter}-`;
      pairIdCounter += 1;
      const opening = punctuation[pair[0]];
      const closing = punctuation[pair[1]];

      opening.id = `${pairId}open`;
      closing.id = `${pairId}close`;

      [opening, closing].forEach((e) => {
        e.addEventListener('mouseenter', hoverBrace);
        e.addEventListener('mouseleave', leaveBrace);
        e.addEventListener('click', clickBrace);
      });
    });
  });

  let level = 0;
  allBraces.sort((a, b) => a.index - b.index);
  allBraces.forEach((brace) => {
    if (brace.open) {
      brace.element.classList.add(mapClassName(`brace-level-${level % LEVEL_WARP + 1}`));
      level += 1;
    } else {
      level = Math.max(0, level - 1);
      brace.element.classList.add(mapClassName(`brace-level-${level % LEVEL_WARP + 1}`));
    }
  });
}
