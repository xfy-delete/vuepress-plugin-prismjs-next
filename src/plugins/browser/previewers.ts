import convertToW3CGradient from '../utils/convertToW3CGradient';

const previewers = {
  gradient: (function () {
    return function () {
      new Previewer('gradient', function (this: any, value) {
        this.firstChild.style.backgroundImage = '';
        this.firstChild.style.backgroundImage = convertToW3CGradient(value);
        return !!this.firstChild.style.backgroundImage;
      }, '*', function (this: any) {
        this._elt.innerHTML = '<div></div>';
      });
    };
  }()),
  angle: () => {
    new Previewer('angle', function (this: any, value) {
      const num = parseFloat(value);
      let unit = value.match(/[a-z]+$/i);
      let max; let percentage;
      if (!num || !unit) {
        return false;
      }
      unit = unit[0];
      switch (unit) {
        case 'deg':
          max = 360;
          break;
        case 'grad':
          max = 400;
          break;
        case 'rad':
          max = 2 * Math.PI;
          break;
        case 'turn':
          max = 1;
          break;
        default:
          break;
      }
      percentage = 100 * num / max;
      percentage %= 100;
      if (percentage === false || percentage === undefined) {
        return false;
      }
      this[`${num < 0 ? 'set' : 'remove'}Attribute`]('data-negative', '');
      this.querySelector('circle').style.strokeDasharray = `${Math.abs(percentage)},500`;
      return true;
    }, '*', function (this: any) {
      this._elt.innerHTML = '<svg viewBox="0 0 64 64">'
        + '<circle r="16" cy="32" cx="32"></circle>'
        + '</svg>';
    });
  },
  color: () => {
    new Previewer('color', function (this: any, value) {
      this.style.backgroundColor = '';
      this.style.backgroundColor = value;
      return !!this.style.backgroundColor;
    });
  },
  easing: () => {
    new Previewer('easing', function (this: any, value) {
      value = {
        linear: '0,0,1,1',
        ease: '.25,.1,.25,1',
        'ease-in': '.42,0,1,1',
        'ease-out': '0,0,.58,1',
        'ease-in-out': '.42,0,.58,1',
      }[value] || value;

      let p = value.match(/-?(?:\d+(?:\.\d+)?|\.\d+)/g);

      if (p.length === 4) {
        p = p.map((p, i) => (i % 2 ? 1 - p : p) * 100);

        this.querySelector('path').setAttribute('d', `M0,100 C${p[0]},${p[1]}, ${p[2]},${p[3]}, 100,0`);

        const lines = this.querySelectorAll('line');
        lines[0].setAttribute('x2', p[0]);
        lines[0].setAttribute('y2', p[1]);
        lines[1].setAttribute('x2', p[2]);
        lines[1].setAttribute('y2', p[3]);

        return true;
      }

      return false;
    }, '*', function (this: any) {
      this._elt.innerHTML = '<svg viewBox="-20 -20 140 140" width="100" height="100">'
        + '<defs>'
        + '<marker id="prism-previewer-easing-marker" viewBox="0 0 4 4" refX="2" refY="2" markerUnits="strokeWidth">'
        + '<circle cx="2" cy="2" r="1.5" />'
        + '</marker>'
        + '</defs>'
        + '<path d="M0,100 C20,50, 40,30, 100,0" />'
        + '<line x1="0" y1="100" x2="20" y2="50" marker-start="url(#prism-previewer-easing-marker)" marker-end="url(#prism-previewer-easing-marker)" />'
        + '<line x1="100" y1="0" x2="40" y2="30" marker-start="url(#prism-previewer-easing-marker)" marker-end="url(#prism-previewer-easing-marker)" />'
        + '</svg>';
    });
  },
  time: () => {
    new Previewer('time', function (this: any, value) {
      const num = parseFloat(value);
      let unit = value.match(/[a-z]+$/i);
      if (!num || !unit) {
        return false;
      }
      unit = unit[0];
      this.querySelector('circle').style.animationDuration = 2 * num + unit;
      return true;
    }, '*', function (this: any) {
      this._elt.innerHTML = '<svg viewBox="0 0 64 64">'
        + '<circle r="16" cy="32" cx="32"></circle>'
        + '</svg>';
    });
  },
};

const getOffset = function (element) {
  const elementBounds = element.getBoundingClientRect();
  let left = elementBounds.left;
  let top = elementBounds.top;
  const documentBounds = document.documentElement.getBoundingClientRect();
  left -= documentBounds.left;
  top -= documentBounds.top;

  return {
    top,
    right: window.innerWidth - left - elementBounds.width,
    bottom: window.innerHeight - top - elementBounds.height,
    left,
    width: elementBounds.width,
    height: elementBounds.height,
  };
};

let previewerActive: any;

class Previewer {
  _elt: any;

  _type: any;

  _token: any;

  updater: any;

  _mouseout: any;

  initializer: any;

  static byLanguages: any;

  static byType: any;

  constructor(type, updater, supportedLanguages?, initializer?) {
    this._elt = null;
    this._type = type;
    this._token = null;
    this.updater = updater;
    this._mouseout = this.mouseout.bind(this);
    this.initializer = initializer;

    const self = this;

    if (!supportedLanguages) {
      supportedLanguages = ['*'];
    }
    if (!Array.isArray(supportedLanguages)) {
      supportedLanguages = [supportedLanguages];
    }
    supportedLanguages.forEach((lang) => {
      if (typeof lang !== 'string') {
        lang = lang.lang;
      }
      if (!Previewer.byLanguages[lang]) {
        Previewer.byLanguages[lang] = [];
      }
      if (Previewer.byLanguages[lang].indexOf(self) < 0) {
        Previewer.byLanguages[lang].push(self);
      }
    });
    Previewer.byType[type] = this;
  }

  init() {
    if (this._elt) {
      return;
    }
    this._elt = document.createElement('div');
    this._elt.className = `prism-previewer prism-previewer-${this._type}`;
    document.body.appendChild(this._elt);
    if (this.initializer) {
      this.initializer();
    }
  }

  isDisabled(token) {
    do {
      if (token.hasAttribute && token.hasAttribute('data-previewers')) {
        const previewers = token.getAttribute('data-previewers');
        return (previewers || '').split(/\s+/).indexOf(this._type) === -1;
      }
    } while ((token = token.parentNode));
    return false;
  }

  check(token) {
    if (token.classList.contains('token') && this.isDisabled(token)) {
      return;
    }
    do {
      if (token.classList && token.classList.contains('token') && token.classList.contains(this._type)) {
        break;
      }
    } while ((token = token.parentNode));

    if (token && token !== this._token) {
      this._token = token;
      this.show();
    }
  }

  mouseout() {
    this._token.removeEventListener('mouseout', this._mouseout, false);
    this._token = null;
    this.hide();
  }

  show() {
    if (!this._elt) {
      this.init();
    }
    if (!this._token) {
      return;
    }

    if (this.updater.call(this._elt, this._token.textContent)) {
      this._token.addEventListener('mouseout', this._mouseout, false);
      const offset = getOffset(this._token);
      if (previewerActive) {
        previewerActive.classList.remove('active');
        previewerActive = null;
      }
      this._elt.classList.add('active');
      previewerActive = this._elt;
      if (offset.top - this._elt.offsetHeight > 0) {
        this._elt.classList.remove('flipped');
        this._elt.style.top = `${offset.top}px`;
        this._elt.style.bottom = '';
      } else {
        this._elt.classList.add('flipped');
        this._elt.style.bottom = `${offset.bottom}px`;
        this._elt.style.top = '';
      }

      this._elt.style.left = `${offset.left + Math.min(200, offset.width / 2)}px`;
    } else {
      this.hide();
    }
  }

  hide() {
    this._elt.classList.remove('active');
    previewerActive = null;
  }
}

Previewer.byLanguages = {};

Previewer.byType = {};

for (const previewer in previewers) {
  previewers[previewer]();
}

function PreviewerInitEvents(elt, lang) {
  let previewers = [];
  if (Previewer.byLanguages[lang]) {
    previewers = previewers.concat(Previewer.byLanguages[lang]);
  }
  if (Previewer.byLanguages['*']) {
    previewers = previewers.concat(Previewer.byLanguages['*']);
  }
  elt.addEventListener('mouseover', (e) => {
    const target = e.target;
    previewers.forEach((previewer: Previewer) => {
      previewer.check(target);
    });
  }, false);
}

// @ts-ignore
if (typeof VUEPRESS_PLUGINS !== 'undefined') {
  // @ts-ignore
  VUEPRESS_PLUGINS.PreviewerInitEvents = PreviewerInitEvents;
}
