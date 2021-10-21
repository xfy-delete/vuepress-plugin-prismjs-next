export default `
@import '_variables';

pre[class*='language-'][data-line] {
  position: relative;
  padding: 1em 0 1em 3em !important;
}

.copy-to-clipboard-button {
  margin-left: 0.3em;
  cursor: pointer;
}

.theme-default-content {
  pre,
  pre[class*='language-'] {
    margin: 0.85rem 0;
    overflow: auto;

    code {
      padding: 0;
      border-radius: 0;
      -webkit-font-smoothing: auto;
      -moz-osx-font-smoothing: auto;
    }
  }

  .line-number {
    font-family: var(--font-family-code);
  }
}
@each $lang in $codeLang {
  div[class*='language-'].ext-#{$lang} {
    &:before {
      content: '' + $lang;
    }
  }
}
@media (max-width: $MQMobileNarrow) {
  .theme-default-content {
    div[class*='language-'] {
      margin: 0.85rem -1.5rem;
      border-radius: 0;
    }
  }
}`;
