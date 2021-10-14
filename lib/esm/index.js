// src/index.ts
import Prism from "prismjs";
import rawLoadLanguages from "prismjs/components/index";
function loadLanguages(languages) {
  var langsToLoad = languages == null ? void 0 : languages.filter(function (item) { return !Prism.languages[item]; });
  if (langsToLoad == null ? void 0 : langsToLoad.length) {
    rawLoadLanguages(langsToLoad);
  }
}
var plugin = function (md, options, _app) {
  var _a;
  var temp = options || {};
  if (((_a = temp.languages) == null ? void 0 : _a.length) !== 0) {
    loadLanguages(temp.languages);
  }
  console.log(222222);
  md.options.highlight = function (code, lang) {
    var prismLang = Prism.languages[lang];
    var html = prismLang ? Prism.highlight(code, prismLang, lang) : md.utils.escapeHtml(code);
    var classAttribute = lang ? (" class='" + (md.options.langPrefix) + (md.utils.escapeHtml(lang)) + "'") : "";
    return ("<pre" + classAttribute + "><code" + classAttribute + ">" + html + "</code></pre>");
  };
};
var src_default = function (options, app) {
  console.log("111111111111111");
  if (typeof options.use === "function") {
    plugin(options, app);
    return void 0;
  }
  return {
    name: "markdown-prismjs-plugin",
    extendsMarkdown: function extendsMarkdown(md) {
      plugin(md, options, app);
    }
  };
};
export {
  src_default as default
};
