import Prism from 'prismjs';

const previewers = {
  gradient: {
    tokens: {
      gradient: {
        pattern: /(?:\b|\B-[a-z]{1,10}-)(?:repeating-)?(?:linear|radial)-gradient\((?:(?:hsl|rgb)a?\(.+?\)|[^\)])+\)/gi,
        inside: {
          function: /[\w-]+(?=\()/,
          hexcode: {
            pattern: /\B#[\da-f]{3,8}\b/i,
            alias: 'color',
          },
          color: [
            {
              // eslint-disable-next-line max-len
              pattern: /(^|[^\w-])(?:AliceBlue|AntiqueWhite|Aqua|Aquamarine|Azure|Beige|Bisque|Black|BlanchedAlmond|Blue|BlueViolet|Brown|BurlyWood|CadetBlue|Chartreuse|Chocolate|Coral|CornflowerBlue|Cornsilk|Crimson|Cyan|DarkBlue|DarkCyan|DarkGoldenRod|DarkGr[ae]y|DarkGreen|DarkKhaki|DarkMagenta|DarkOliveGreen|DarkOrange|DarkOrchid|DarkRed|DarkSalmon|DarkSeaGreen|DarkSlateBlue|DarkSlateGr[ae]y|DarkTurquoise|DarkViolet|DeepPink|DeepSkyBlue|DimGr[ae]y|DodgerBlue|FireBrick|FloralWhite|ForestGreen|Fuchsia|Gainsboro|GhostWhite|Gold|GoldenRod|Gr[ae]y|Green|GreenYellow|HoneyDew|HotPink|IndianRed|Indigo|Ivory|Khaki|Lavender|LavenderBlush|LawnGreen|LemonChiffon|LightBlue|LightCoral|LightCyan|LightGoldenRodYellow|LightGr[ae]y|LightGreen|LightPink|LightSalmon|LightSeaGreen|LightSkyBlue|LightSlateGr[ae]y|LightSteelBlue|LightYellow|Lime|LimeGreen|Linen|Magenta|Maroon|MediumAquaMarine|MediumBlue|MediumOrchid|MediumPurple|MediumSeaGreen|MediumSlateBlue|MediumSpringGreen|MediumTurquoise|MediumVioletRed|MidnightBlue|MintCream|MistyRose|Moccasin|NavajoWhite|Navy|OldLace|Olive|OliveDrab|Orange|OrangeRed|Orchid|PaleGoldenRod|PaleGreen|PaleTurquoise|PaleVioletRed|PapayaWhip|PeachPuff|Peru|Pink|Plum|PowderBlue|Purple|Red|RosyBrown|RoyalBlue|SaddleBrown|Salmon|SandyBrown|SeaGreen|SeaShell|Sienna|Silver|SkyBlue|SlateBlue|SlateGr[ae]y|Snow|SpringGreen|SteelBlue|Tan|Teal|Thistle|Tomato|Transparent|Turquoise|Violet|Wheat|White|WhiteSmoke|Yellow|YellowGreen)(?![\w-])/i,
              lookbehind: true,
            },
            {
              pattern: /\b(?:hsl|rgb)\(\s*\d{1,3}\s*,\s*\d{1,3}%?\s*,\s*\d{1,3}%?\s*\)\B|\b(?:hsl|rgb)a\(\s*\d{1,3}\s*,\s*\d{1,3}%?\s*,\s*\d{1,3}%?\s*,\s*(?:0|0?\.\d+|1)\s*\)\B/i,
              inside: {
                unit: {
                  pattern: /(\b\d+)(?:%|[a-z]+(?![\w-]))/,
                  lookbehind: true,
                },
                number: {
                  pattern: /(^|[^\w.-])-?(?:\d+(?:\.\d+)?|\.\d+)/,
                  lookbehind: true,
                },
                function: /[\w-]+(?=\()/,
                punctuation: /[(),]/,
              },
            },
          ],
        },
      },
    },
    languages: {
      css: true,
      less: true,
      sass: [
        {
          lang: 'sass',
          before: 'punctuation',
          inside: 'inside',
          root: Prism.languages.sass && Prism.languages.sass['variable-line'],
        },
        {
          lang: 'sass',
          before: 'punctuation',
          inside: 'inside',
          root: Prism.languages.sass && Prism.languages.sass['property-line'],
        },
      ],
      scss: true,
      stylus: [
        {
          lang: 'stylus',
          before: 'func',
          inside: 'rest',
          // @ts-ignore
          root: Prism.languages.stylus && Prism.languages.stylus['property-declaration'].inside,
        },
        {
          lang: 'stylus',
          before: 'func',
          inside: 'rest',
          // @ts-ignore
          root: Prism.languages.stylus && Prism.languages.stylus['variable-declaration'].inside,
        },
      ],
    },
  },
  angle: {
    tokens: {
      angle: /(?:\b|\B-|(?=\B\.))(?:\d+(?:\.\d+)?|\.\d+)(?:deg|g?rad|turn)\b/i,
    },
    languages: {
      css: true,
      less: true,
      markup: {
        lang: 'markup',
        before: 'punctuation',
        inside: 'inside',
        // @ts-ignore
        root: Prism.languages.markup && Prism.languages.markup.tag.inside['attr-value'],
      },
      sass: [
        {
          lang: 'sass',
          inside: 'inside',
          root: Prism.languages.sass && Prism.languages.sass['property-line'],
        },
        {
          lang: 'sass',
          before: 'operator',
          inside: 'inside',
          root: Prism.languages.sass && Prism.languages.sass['variable-line'],
        },
      ],
      scss: true,
      stylus: [
        {
          lang: 'stylus',
          before: 'func',
          inside: 'rest',
          // @ts-ignore
          root: Prism.languages.stylus && Prism.languages.stylus['property-declaration'].inside,
        },
        {
          lang: 'stylus',
          before: 'func',
          inside: 'rest',
          // @ts-ignore
          root: Prism.languages.stylus && Prism.languages.stylus['variable-declaration'].inside,
        },
      ],
    },
  },
  color: {
    tokens: {
      color: [Prism.languages.css.hexcode].concat(Prism.languages.css.color),
    },
    languages: {
      // CSS extras is required, so css and scss are not necessary
      css: false,
      less: true,
      markup: {
        lang: 'markup',
        before: 'punctuation',
        inside: 'inside',
        // @ts-ignore
        root: Prism.languages.markup && Prism.languages.markup.tag.inside['attr-value'],
      },
      sass: [
        {
          lang: 'sass',
          before: 'punctuation',
          inside: 'inside',
          root: Prism.languages.sass && Prism.languages.sass['variable-line'],
        },
        {
          lang: 'sass',
          inside: 'inside',
          root: Prism.languages.sass && Prism.languages.sass['property-line'],
        },
      ],
      scss: false,
      stylus: [
        {
          lang: 'stylus',
          before: 'hexcode',
          inside: 'rest',
          // @ts-ignore
          root: Prism.languages.stylus && Prism.languages.stylus['property-declaration'].inside,
        },
        {
          lang: 'stylus',
          before: 'hexcode',
          inside: 'rest',
          // @ts-ignore
          root: Prism.languages.stylus && Prism.languages.stylus['variable-declaration'].inside,
        },
      ],
    },
  },
  easing: {
    tokens: {
      easing: {
        pattern: /\bcubic-bezier\((?:-?(?:\d+(?:\.\d+)?|\.\d+),\s*){3}-?(?:\d+(?:\.\d+)?|\.\d+)\)\B|\b(?:ease(?:-in)?(?:-out)?|linear)(?=\s|[;}]|$)/i,
        inside: {
          function: /[\w-]+(?=\()/,
          punctuation: /[(),]/,
        },
      },
    },
    languages: {
      css: true,
      less: true,
      sass: [
        {
          lang: 'sass',
          inside: 'inside',
          before: 'punctuation',
          root: Prism.languages.sass && Prism.languages.sass['variable-line'],
        },
        {
          lang: 'sass',
          inside: 'inside',
          root: Prism.languages.sass && Prism.languages.sass['property-line'],
        },
      ],
      scss: true,
      stylus: [
        {
          lang: 'stylus',
          before: 'hexcode',
          inside: 'rest',
          // @ts-ignore
          root: Prism.languages.stylus && Prism.languages.stylus['property-declaration'].inside,
        },
        {
          lang: 'stylus',
          before: 'hexcode',
          inside: 'rest',
          // @ts-ignore
          root: Prism.languages.stylus && Prism.languages.stylus['variable-declaration'].inside,
        },
      ],
    },
  },

  time: {
    tokens: {
      time: /(?:\b|\B-|(?=\B\.))(?:\d+(?:\.\d+)?|\.\d+)m?s\b/i,
    },
    languages: {
      css: true,
      less: true,
      markup: {
        lang: 'markup',
        before: 'punctuation',
        inside: 'inside',
        // @ts-ignore
        root: Prism.languages.markup && Prism.languages.markup.tag.inside['attr-value'],
      },
      sass: [
        {
          lang: 'sass',
          inside: 'inside',
          root: Prism.languages.sass && Prism.languages.sass['property-line'],
        },
        {
          lang: 'sass',
          before: 'operator',
          inside: 'inside',
          root: Prism.languages.sass && Prism.languages.sass['variable-line'],
        },
      ],
      scss: true,
      stylus: [
        {
          lang: 'stylus',
          before: 'hexcode',
          inside: 'rest',
          // @ts-ignore
          root: Prism.languages.stylus && Prism.languages.stylus['property-declaration'].inside,
        },
        {
          lang: 'stylus',
          before: 'hexcode',
          inside: 'rest',
          // @ts-ignore
          root: Prism.languages.stylus && Prism.languages.stylus['variable-declaration'].inside,
        },
      ],
    },
  },
};

function beforeTokenize(env) {
  for (const previewer in previewers) {
    const languages = previewers[previewer].languages;
    if (env.language && languages[env.language] && !languages[env.language].initialized) {
      let lang = languages[env.language];
      if (!Array.isArray(lang)) {
        lang = [lang];
      }
      lang.forEach((lang) => {
        let before; let inside; let root; let skip;
        if (lang === true) {
          before = 'important';
          inside = env.language;
          lang = env.language;
        } else {
          before = lang.before || 'important';
          inside = lang.inside || lang.lang;
          root = lang.root || Prism.languages;
          skip = lang.skip;
          lang = env.language;
        }

        if (!skip && Prism.languages[lang]) {
          Prism.languages.insertBefore(inside, before, previewers[previewer].tokens, root);
          env.grammar = Prism.languages[lang];
          languages[env.language] = { initialized: true };
        }
      });
    }
  }
}

export default beforeTokenize;
