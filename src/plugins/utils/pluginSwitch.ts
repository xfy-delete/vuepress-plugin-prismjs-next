import Prism from 'prismjs';

function sitePluginSwitch(info: string, preAttrList: Array<string>) {
  if (/:no-inline-color\b/.test(info)) {
    Prism.plugins.inlineColor = false;
  }
  if (/:no-autolinker\b/.test(info)) {
    Prism.plugins.autoLinker = false;
  }
  if (/:no-data-uri-highlight\b/.test(info)) {
    Prism.plugins.dataUriHighlight = false;
  }
  if (/:no-normalize-whitespace\b/.test(info)) {
    Prism.plugins.normalizeWhitespace = false;
  }
  if (/:no-show-invisibles\b/.test(info)) {
    Prism.plugins.showInvisibles = false;
  }
  if (/:no-previewers\b/.test(info)) {
    Prism.plugins.previewers = false;
    preAttrList.push('no-previewers=true');
  }
  if (/:no-line-highlight\b/.test(info)) {
    Prism.plugins.previewers = false;
    preAttrList.push('no-line-highlight=true');
  }
  if (/:no-match-braces\b/.test(info)) {
    Prism.plugins.previewers = false;
    preAttrList.push('no-match-braces=true');
  }
}

function initPluginSwitch() {
  Prism.plugins.inlineColor = true;
  Prism.plugins.autoLinker = true;
  Prism.plugins.dataUriHighlight = true;
  Prism.plugins.normalizeWhitespace = true;
  Prism.plugins.previewers = true;
  Prism.plugins.showInvisibles = true;
}

export {
  sitePluginSwitch,
  initPluginSwitch,
};
