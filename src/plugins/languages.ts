import Prism from 'prismjs';
import getLoader from 'prismjs/dependencies';
import components from 'prismjs/components';

const loadedLanguages = new Set();

function loadLanguages(languages) {
  if (languages === undefined) {
    languages = Object.keys(components.languages).filter((l) => l !== 'meta');
  } else if (!Array.isArray(languages)) {
    languages = [languages];
  }
  const loaded = [...loadedLanguages, ...Object.keys(Prism.languages)];
  getLoader(components, languages, loaded).load((lang) => {
    if (!(lang in components.languages)) {
      if (!loadLanguages.silent) {
        console.warn(`Language does not exist: ${lang}`);
      }
      return;
    }
    const pathToLanguage = `node_modules/prismjs/components/prism-${lang}`;
    // delete require.cache[require.resolve(pathToLanguage)];
    delete Prism.languages[lang];
    // @ts-ignore
    // import.meta.glob(pathToLanguage);
    loadedLanguages.add(lang);
  });
}

loadLanguages.silent = false;

export default loadLanguages;
