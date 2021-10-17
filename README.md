# 测试

## 颜色预览

``` css
span.foo {
 background-color:navy;
 color:#BFD;
}

span.bar {
 background:rgba(105, 0, 12, .38);
 color:hsl(30, 100%, 50%);
 border-color:transparent;
}
```

## 链接突出显示

```html
<style>
  @font-face {
    src: url(http://lea.verou.me/logo.otf);
    font-family: 'LeaVerou';
  }
</style>
<!-- Links in HTML, woo!
Lea Verou http://lea.verou.me or, with Markdown, Lea Verou -->
<img src="https://prismjs.com/assets/img/spectrum.png" alt="In attributes too!" />
<p>Autolinking in raw text: http://prismjs.com</p>
<script>
  /**
 * Prism: Lightweight, robust, elegant syntax highlighting
 * MIT license http://www.opensource.org/licenses/mit-license.php/
 * @author Lea Verou http://lea.verou.me
 * Reach Lea at fake@email.com (no, not really)
 * And this is a Markdown link. Sweet, huh?
 */
  var foo = 5;
  // And a single line comment http://google.com
  (function () {

    if (typeof Prism === 'undefined') {
      return;
    }

    Prism.hooks.add('wrap', function (env) {
      if (env.type !== 'keyword') {
        return;
      }
      env.classes.push('keyword-' + env.content);
    });

  }());
</script>
```

## 数据url突出

```css
div {
  border: 40px solid transparent;
  border-image: 33.334% url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30"> \
                        <circle cx="5" cy="5" r="5" fill="%23ab4"/><circle cx="15" cy="5" r="5" fill="%23655"/> \
                        <circle cx="25" cy="5" r="5" fill="%23e07"/><circle cx="5" cy="15" r="5" fill="%23655"/> \
                        <circle cx="15" cy="15" r="5" fill="hsl(15, 25%, 75%)"/> \
                        <circle cx="25" cy="15" r="5" fill="%23655"/><circle cx="5" cy="25" r="5" fill="%23fb3"/> \
                        <circle cx="15" cy="25" r="5" fill="%23655"/><circle cx="25" cy="25" r="5" fill="%2358a"/></svg>');
  padding: 1em;
  max-width: 20em;
  font: 130%/1.6 Baskerville, Palatino, serif;
}
```

## diff 对比

```diff
@@ -4,6 +4,5 @@
-    let foo = bar.baz([1, 2, 3]);
-    foo = foo + 1;
+    const foo = bar.baz([1, 2, 3]) + 1;
     console.log(`foo: ${foo}`);
```

## 树型目录

```treeview
├── a first folder/
|   ├── holidays.mov
|   ├── javascript-file.js
|   └── some_picture.jpg
├── documents/
|   ├── spreadsheet.xls
|   ├── manual.pdf
|   ├── document.docx
|   └── presentation.ppt
└── etc.
```

```treeview
|-- a first folder/
|   |-- holidays.mov
|   |-- javascript-file.js
|   `-- some_picture.jpg
|-- documents/
|   |-- spreadsheet.xls
|   |-- manual.pdf
|   |-- document.docx
|   `-- presentation.ppt
|       `-- test
|-- empty_folder/
|-- going deeper/
|   |-- going deeper/
|   |   `-- going deeper/
|   |        `-- going deeper/
|   |            `-- .secret_file
|   |-- style.css
|   `-- index.html
|-- music and movies/
|   |-- great-song.mp3
|   |-- S01E02.new.episode.avi
|   |-- S01E02.new.episode.nfo
|   `-- track 1.cda
|-- .gitignore
|-- .htaccess
|-- .npmignore
|-- archive 1.zip
|-- archive 2.tar.gz
|-- logo.svg
`-- README.md
```
