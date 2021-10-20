export default function percentage(value) {
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
  return percentage;
}
