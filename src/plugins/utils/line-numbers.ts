import { optionsType } from '../..';

function setWhiteSpaceStyle(info: string, styleList: Array<string>) {
  if (/:pre-wrap\b/.test(info)) {
    styleList.push('white-space: pre-wrap;');
  } else if (/:pre-line\b/.test(info)) {
    styleList.push('white-space: pre-line;');
  }
}
function lineNumbers(info: string, code: string, preStyleList: Array<string>, codeStyleList: Array<string>, options: optionsType): [number, string] | null {
  if (/:no-line-numbers\b/.test(info) || (typeof options.lineNumbers === 'boolean' && !options.lineNumbers)) {
    setWhiteSpaceStyle(info, codeStyleList);
    return null;
  }
  const lines = code.split('\n').slice(0, -1);
  if (typeof options.lineNumbers === 'number' && lines.length <= options.lineNumbers) {
    setWhiteSpaceStyle(info, codeStyleList);
    return null;
  }
  const match = info.match(/:([\d,-]+)/);
  let startLine = 1;
  if (match) {
    startLine = Number.parseInt(match[1], 10);
  }
  if (startLine < 0 && Math.abs(startLine) > lines.length) {
    startLine = 1;
  }
  let spanStr = '<span aria-hidden=true class="line-numbers-rows">';
  for (let index = 0; index < lines.length;) {
    spanStr += '<span></span>';
    index += 1;
  }
  spanStr += '</span>';
  if (/:pre-wrap|:pre-line\b/.test(info)) {
    spanStr += '<span class="line-numbers-sizer" style="display: none;"></span>';
  }
  setWhiteSpaceStyle(info, preStyleList);
  return [startLine, spanStr];
}

export {
  setWhiteSpaceStyle,
  lineNumbers,
};
