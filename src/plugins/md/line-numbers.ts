import { App } from '@vuepress/core';
import Token from 'markdown-it/lib/token';

function resizeLineNumbers() {
  const NEW_LINE_EXP = /\n(?!$)/g;

  const preElements = Array.prototype.slice.call(document.querySelectorAll('pre.line-numbers[class*=language-]'));
  function getStyles(element: Element) {
    if (!element) {
      return null;
    }
    // @ts-ignore
    return typeof window.getComputedStyle === 'function' ? getComputedStyle(element) : (element.currentStyle || null);
  }

  function resizeElements(elements: Array<Element>): void {
    elements = elements.filter((e) => {
      const codeStyles = getStyles(e);
      const whiteSpace = codeStyles['white-space'];
      return whiteSpace === 'pre-wrap' || whiteSpace === 'pre-line';
    });
    if (elements.length === 0) {
      return;
    }
    const infos = elements.map((element) => {
      const codeElement = element.querySelector('code');
      const lineNumbersWrapper = element.querySelector('.line-numbers-rows');
      if (codeElement === null || !lineNumbersWrapper) {
        return undefined;
      }
      let lineNumberSizer = element.querySelector('.line-numbers-sizer');
      const text = codeElement.textContent;
      if (!text) {
        return undefined;
      }
      const codeLines = text.split(NEW_LINE_EXP);
      if (!lineNumberSizer) {
        lineNumberSizer = document.createElement('span');
        lineNumberSizer.className = 'line-numbers-sizer';

        codeElement.appendChild(lineNumberSizer);
      }
      lineNumberSizer.innerHTML = '0';
      // @ts-ignore
      lineNumberSizer.style.display = 'block';
      const oneLinerHeight = lineNumberSizer.getBoundingClientRect().height;
      lineNumberSizer.innerHTML = '';
      return {
        element,
        lines: codeLines,
        lineHeights: [],
        oneLinerHeight,
        sizer: lineNumberSizer,
      };
    }).filter(Boolean);

    infos.forEach((info) => {
      if (info) {
        const lineNumberSizer = info.sizer;
        const lines = info.lines;
        const lineHeights: Array<number | undefined> = info.lineHeights;
        const oneLinerHeight = info.oneLinerHeight;
        lineHeights[lines.length - 1] = undefined;
        lines.forEach((line, index) => {
          if (line && line.length > 1) {
            const e = lineNumberSizer.appendChild(document.createElement('span'));
            e.style.display = 'block';
            e.textContent = line;
          } else {
            lineHeights[index] = oneLinerHeight;
          }
        });
      }
    });

    infos.forEach((info) => {
      if (info) {
        const lineNumberSizer = info.sizer;
        const lineHeights: Array<number> = info.lineHeights;
        let childIndex = 0;
        for (let i = 0; i < lineHeights.length;) {
          if (lineHeights[i] === undefined) {
            lineHeights[i] = lineNumberSizer.children[childIndex].getBoundingClientRect().height;
            childIndex += 1;
          }
          i += 1;
        }
      }
    });

    infos.forEach((info) => {
      if (info) {
        const lineNumberSizer = info.sizer;
        const wrapper = document.querySelectorAll('.line-numbers-rows span');
        // @ts-ignore
        lineNumberSizer.style.display = 'none';
        lineNumberSizer.innerHTML = '';
        info.lineHeights.forEach((height, lineNumber) => {
          // @ts-ignore
          wrapper[lineNumber].style.height = `${height}px`;
        });
      }
    });
  }
  resizeElements(preElements);
  let lastWidth: number;
  window.addEventListener('resize', () => {
    if (lastWidth === window.innerWidth) {
      return;
    }
    lastWidth = window.innerWidth;

    resizeElements(Array.prototype.slice.call(document.querySelectorAll('pre.line-numbers[class*=language-]')));
  });
}

export default (token: Token, info: string, code: string, preStyleList: Array<string>, app: App): [number, string] | null => {
  if (/:no-line-numbers\b/.test(info)) {
    return null;
  }
  const lines = token.map && token.map.length === 2 ? token.map[1] - token.map[0] - 2 : code.split('\n').slice(0, -1);
  const match = info.match(/:([\d,-]+)/);
  let startLine = 1;
  if (match) {
    startLine = Number.parseInt(match[1], 10);
  }
  if (startLine < 0 && Math.abs(startLine) > lines) {
    startLine = 1;
  }
  let spanStr = '<span aria-hidden=true class="line-numbers-rows">';
  for (let index = 0; index < lines;) {
    spanStr += '<span></span>';
    index += 1;
  }
  spanStr += '</span>';
  if (/:pre-wrap\b/.test(info)) {
    preStyleList.push('white-space: pre-wrap;');
    spanStr += '<span class="line-numbers-sizer" style="display: none;"></span>';
  } else if (/:pre-line\b/.test(info)) {
    preStyleList.push('white-space: pre-line;');
    spanStr += '<span class="line-numbers-sizer" style="display: none;"></span>';
  }
  if (/:pre-wrap|pre-line\b/.test(info)) {
    app.siteData.head = app.siteData.head || [];
    app.siteData.head.push([
      'script',
      {},
      resizeLineNumbers.toString(),
    ]);
  }
  return [startLine, spanStr];
};
