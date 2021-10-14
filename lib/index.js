"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var __require = /* @__PURE__ */ (function (x) { return typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: function (a, b) { return (typeof require !== "undefined" ? require : a)[b]; }
}) : x; })(function(x) {
  if (typeof require !== "undefined")
    { return require.apply(this, arguments); }
  throw new Error('Dynamic require of "' + x + '" is not supported');
});

// node_modules/tsup/assets/cjs_shims.js
var importMetaUrlShim = typeof document === "undefined" ? new (__require("url")).URL("file:" + __filename).href : document.currentScript && document.currentScript.src || new URL("main.js", document.baseURI).href;

// src/index.ts
var _prismjs = require('prismjs'); var _prismjs2 = _interopRequireDefault(_prismjs);
var _index = require('prismjs/components/index'); var _index2 = _interopRequireDefault(_index);
function loadLanguages(languages) {
  var langsToLoad = languages == null ? void 0 : languages.filter(function (item) { return !_prismjs2.default.languages[item]; });
  if (langsToLoad == null ? void 0 : langsToLoad.length) {
    _index2.default.call(void 0, langsToLoad);
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
    var prismLang = _prismjs2.default.languages[lang];
    var html = prismLang ? _prismjs2.default.highlight(code, prismLang, lang) : md.utils.escapeHtml(code);
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


exports.default = src_default;
