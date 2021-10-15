"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prismjs_1 = __importDefault(require("prismjs"));
const dependencies_1 = __importDefault(require("prismjs/dependencies"));
const components_1 = __importDefault(require("prismjs/components"));
const loadedLanguages = new Set();
function loadLanguages(languages) {
    if (languages === undefined) {
        languages = Object.keys(components_1.default.languages).filter((l) => l !== 'meta');
    }
    else if (!Array.isArray(languages)) {
        languages = [languages];
    }
    const loaded = [...loadedLanguages, ...Object.keys(prismjs_1.default.languages)];
    (0, dependencies_1.default)(components_1.default, languages, loaded).load((lang) => {
        if (!(lang in components_1.default.languages)) {
            if (!loadLanguages.silent) {
                console.warn(`Language does not exist: ${lang}`);
            }
            return;
        }
        const pathToLanguage = `node_modules/prismjs/components/prism-${lang}`;
        delete prismjs_1.default.languages[lang];
        loadedLanguages.add(lang);
    });
}
loadLanguages.silent = false;
exports.default = loadLanguages;
