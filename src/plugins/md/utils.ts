function resolveLineNumbers(info: string, reg: RegExp): Array<[number, number]> | null {
  const match = info.match(reg);
  if (match === null) {
    return null;
  }
  return match[1].split(',').map((item) => {
    const range = item.split('-');
    if (range.length === 1) {
      range.push(range[0]);
    }
    return range.map((str) => Number.parseInt(str, 10)) as [number, number];
  });
}

function isLineNumber(
  lineNumber: number,
  ranges: Array<[number, number]>,
): boolean {
  return ranges.some(([start, end]) => lineNumber >= start && lineNumber <= end);
}

export {
  resolveLineNumbers,
  isLineNumber,
};
