const previewers = {
  gradient: {
    create: (function () {
      const cache = {};
      const convertToW3CLinearGradient = function (prefix, func, values) {
        let angle = '180deg';
        if (/^(?:-?(?:\d+(?:\.\d+)?|\.\d+)(?:deg|rad)|to\b|top|right|bottom|left)/.test(values[0])) {
          angle = values.shift();
          if (angle.indexOf('to ') < 0) {
            if (angle.indexOf('top') >= 0) {
              if (angle.indexOf('left') >= 0) {
                angle = 'to bottom right';
              } else if (angle.indexOf('right') >= 0) {
                angle = 'to bottom left';
              } else {
                angle = 'to bottom';
              }
            } else if (angle.indexOf('bottom') >= 0) {
              if (angle.indexOf('left') >= 0) {
                angle = 'to top right';
              } else if (angle.indexOf('right') >= 0) {
                angle = 'to top left';
              } else {
                angle = 'to top';
              }
            } else if (angle.indexOf('left') >= 0) {
              angle = 'to right';
            } else if (angle.indexOf('right') >= 0) {
              angle = 'to left';
            } else if (prefix) {
              if (angle.indexOf('deg') >= 0) {
                angle = `${90 - parseFloat(angle)}deg`;
              } else if (angle.indexOf('rad') >= 0) {
                angle = `${Math.PI / 2 - parseFloat(angle)}rad`;
              }
            }
          }
        }
        return `${func}(${angle},${values.join(',')})`;
      };
      const convertToW3CRadialGradient = function (prefix, func, values) {
        if (values[0].indexOf('at') < 0) {
          let position = 'center';
          let shape = 'ellipse';
          let size = 'farthest-corner';

          if (/\b(?:bottom|center|left|right|top)\b|^\d+/.test(values[0])) {
            position = values.shift().replace(/\s*-?\d+(?:deg|rad)\s*/, '');
          }
          if (/\b(?:circle|closest|contain|cover|ellipse|farthest)\b/.test(values[0])) {
            const shapeSizeParts = values.shift().split(/\s+/);
            if (shapeSizeParts[0] && (shapeSizeParts[0] === 'circle' || shapeSizeParts[0] === 'ellipse')) {
              shape = shapeSizeParts.shift();
            }
            if (shapeSizeParts[0]) {
              size = shapeSizeParts.shift();
            }

            if (size === 'cover') {
              size = 'farthest-corner';
            } else if (size === 'contain') {
              size = 'clothest-side';
            }
          }

          return `${func}(${shape} ${size} at ${position},${values.join(',')})`;
        }
        return `${func}(${values.join(',')})`;
      };
      const convertToW3CGradient = function (gradient) {
        if (cache[gradient]) {
          return cache[gradient];
        }
        const parts = gradient.match(/^(\b|\B-[a-z]{1,10}-)((?:repeating-)?(?:linear|radial)-gradient)/);
        const prefix = parts && parts[1];
        const func = parts && parts[2];
        const values = gradient.replace(/^(?:\b|\B-[a-z]{1,10}-)(?:repeating-)?(?:linear|radial)-gradient\(|\)$/g, '').split(/\s*,\s*/);
        if (func.indexOf('linear') >= 0) {
          return cache[gradient] = convertToW3CLinearGradient(prefix, func, values);
        } if (func.indexOf('radial') >= 0) {
          return cache[gradient] = convertToW3CRadialGradient(prefix, func, values);
        }
        return cache[gradient] = `${func}(${values.join(',')})`;
      };
      return function () {
        new Previewer('gradient', function (value) {
          this.firstChild.style.backgroundImage = '';
          this.firstChild.style.backgroundImage = convertToW3CGradient(value);
          return !!this.firstChild.style.backgroundImage;
        }, '*', function () {
          this._elt.innerHTML = '<div></div>';
        });
      };
    }()),
  },
  angle: {
    create() {
      new Previewer('angle', function (value) {
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

        this[`${num < 0 ? 'set' : 'remove'}Attribute`]('data-negative', '');
        this.querySelector('circle').style.strokeDasharray = `${Math.abs(percentage)},500`;
        return true;
      }, '*', function () {
        this._elt.innerHTML = '<svg viewBox="0 0 64 64">'
          + '<circle r="16" cy="32" cx="32"></circle>'
          + '</svg>';
      });
    },
  },
  color: {
    create() {
      new Previewer('color', function (value) {
        this.style.backgroundColor = '';
        this.style.backgroundColor = value;
        return !!this.style.backgroundColor;
      });
    },
  },
  easing: {
    create() {
      new Previewer('easing', function (value) {
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
      }, '*', function () {
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
  },

  time: {
    create() {
      new Previewer('time', function (value) {
        const num = parseFloat(value);
        let unit = value.match(/[a-z]+$/i);
        if (!num || !unit) {
          return false;
        }
        unit = unit[0];
        this.querySelector('circle').style.animationDuration = 2 * num + unit;
        return true;
      }, '*', function () {
        this._elt.innerHTML = '<svg viewBox="0 0 64 64">'
          + '<circle r="16" cy="32" cx="32"></circle>'
          + '</svg>';
      });
    },
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

const Previewer = function (type, updater, supportedLanguages, initializer) {
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
};

Previewer.prototype.init = function () {
  if (this._elt) {
    return;
  }
  this._elt = document.createElement('div');
  this._elt.className = `prism-previewer prism-previewer-${this._type}`;
  document.body.appendChild(this._elt);
  if (this.initializer) {
    this.initializer();
  }
};

Previewer.prototype.isDisabled = function (token) {
  do {
    if (token.hasAttribute && token.hasAttribute('data-previewers')) {
      const previewers = token.getAttribute('data-previewers');
      return (previewers || '').split(/\s+/).indexOf(this._type) === -1;
    }
  } while ((token = token.parentNode));
  return false;
};

Previewer.prototype.check = function (token) {
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
};

Previewer.prototype.mouseout = function () {
  // this._token.removeEventListener('mouseout', this._mouseout, false);
  this._token = null;
  this.hide();
};

Previewer.prototype.show = function () {
  if (!this._elt) {
    this.init();
  }
  if (!this._token) {
    return;
  }

  if (this.updater.call(this._elt, this._token.textContent)) {
    // this._token.addEventListener('mouseout', this._mouseout, false);

    const offset = getOffset(this._token);
    this._elt.classList.add('active');

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
};

Previewer.prototype.hide = function () {
  this._elt.classList.remove('active');
};

Previewer.byLanguages = {};

Previewer.byType = {};

for (const previewer in previewers) {
  previewers[previewer].create();
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
    previewers.forEach((previewer) => {
      previewer.check(target);
    });
  }, false);
}

export default previewers;
