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

export default convertToW3CGradient;
