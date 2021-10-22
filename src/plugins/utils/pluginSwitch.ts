import Prism from 'prismjs';

function sitePluginSwitch(info: string, preAttrList: Array<string>) {
  if (/:no-inline-color|no-ic\b/.test(info)) {
    Prism.plugins.inlineColor = false;
  }
  if (/:no-autolinker|no-al\b/.test(info)) {
    Prism.plugins.autoLinker = false;
  }
  if (/:show-invisibles|si\b/.test(info)) {
    Prism.plugins.showInvisibles = true;
  }
  if (/:no-previewers|no-pw\b/.test(info)) {
    Prism.plugins.previewers = false;
    preAttrList.push('no-pw=true');
  }
  if (/:no-line-highlight|no-lh\b/.test(info)) {
    preAttrList.push('no-lh=true');
  }
  if (/:no-match-braces|no-mb\b/.test(info)) {
    preAttrList.push('no-mb=true');
  }
  if (/:no-toolbar|no-tb\b/.test(info)) {
    preAttrList.push('no-tb=true');
  }
}

function initPluginSwitch() {
  Prism.plugins.inlineColor = true;
  Prism.plugins.autoLinker = true;
  Prism.plugins.previewers = true;
  Prism.plugins.showInvisibles = false;
}

export {
  sitePluginSwitch,
  initPluginSwitch,
};
