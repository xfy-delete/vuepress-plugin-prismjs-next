function LoadLineNumbers(elements: Array<any>) {
  const NEW_LINE_EXP = /\n(?!$)/g;
  function getStyles(element: Element) {
    if (!element) {
      return null;
    }
    // @ts-ignore
    return typeof window.getComputedStyle === 'function' ? getComputedStyle(element) : (element.currentStyle || null);
  }
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

// @ts-ignore
if (typeof VUEPRESS_PLUGIN !== 'undefined') {
  // @ts-ignore
  VUEPRESS_PLUGIN.LoadLineNumbers = LoadLineNumbers;
}
