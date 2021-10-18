# 测试

```html:pre-wrap:-5:{1,6-8}
<!DOCTYPE html>
<html lang="en">
<head>

<meta charset="utf-8" />
<link rel="icon" href="assets/favicon.png" />
<title>Line Numbers ▲ Prism plugins</title>
<base href="../.." />
<link rel="stylesheet" href="assets/style.css" />
<link rel="stylesheet" href="themes/prism.css" data-noprefix />
<link rel="stylesheet" href="plugins/line-numbers/prism-line-numbers.css" data-noprefix />
<script src="assets/vendor/prefixfree.min.js"></script>

<script>var _gaq = [['_setAccount', 'UA-33746269-1'], ['_trackPageview']];</script>
<script src="https://www.google-analytics.com/ga.js" async></script>
</head>
<body class="language-none" style="color: red;">

<header data-plugin-header="line-numbers"></header>

<section class="language-markup">
  <h1>How to use</h1>

  <p>Obviously, this is supposed to work only for code blocks (<code>&lt;pre>&lt;code></code>) and not for inline code.</p>
  <p>Add the <code>line-numbers</code> class to your desired <code>&lt;pre></code> or any of its ancestors, and the Line Numbers plugin will take care of the rest. To give all code blocks line numbers, add the <code>line-numbers</code> class to the <code>&lt;body></code> of the page. This is part of a general activation mechanism where adding the <code>line-numbers</code> (or <code>no-line-numbers</code>) class to any element will enable (or disable) the Line Numbers plugin for all code blocks in that element. <br> Example:</p>

  <pre><code>&lt;body class="line-numbers"> &lt;!-- enabled for the whole page -->

 &lt;!-- with line numbers -->
 &lt;pre>&lt;code>...&lt;/code>&lt;/pre>
 &lt;!-- disabled for a specific element - without line numbers -->
 &lt;pre class="no-line-numbers">&lt;code>...&lt;/code>&lt;/pre>

 &lt;div class="no-line-numbers"> &lt;!-- disabled for this subtree -->

  &lt;!-- without line numbers -->
  &lt;pre>&lt;code>...&lt;/code>&lt;/pre>
  &lt;!-- enabled for a specific element - with line numbers -->
  &lt;pre class="line-numbers">&lt;code>...&lt;/code>&lt;/pre>

 &lt;/div>
&lt;/body></code></pre>

  <p>Optional: You can specify the <code>data-start</code> (Number) attribute on the <code>&lt;pre></code> element. It will shift the line counter.</p>
  <p>Optional: To support multiline line numbers using soft wrap, apply the CSS <code>white-space: pre-line;</code> or <code>white-space: pre-wrap;</code> to your desired <code>&lt;pre></code>.</p>
</section>

<section class="line-numbers">
  <h1>Examples</h1>

  <h2>JavaScript</h2>
  <pre class="line-numbers" data-src="plugins/line-numbers/prism-line-numbers.js"></pre>

  <h2>CSS</h2>
  <p>Please note that this <code class="language-markup">&lt;pre></code> does not have the <code>line-numbers</code> class but its parent does.</p>
  <pre data-src="plugins/line-numbers/prism-line-numbers.css"></pre>

  <h2>HTML</h2>
  <p>Please note the <code>data-start="-5"</code> in the code below.</p>
  <pre class="line-numbers" data-src="plugins/line-numbers/index.html" data-start="-5"></pre>

  <h2>Unknown languages</h2>
  <pre class="language-none line-numbers"><code>This raw text
is not highlighted
but it still has
line numbers</code></pre>

  <h2>Soft wrap support</h2>
  <p>Please note the <code>style="white-space:pre-wrap;"</code> in the code below.</p>
  <pre class="line-numbers" data-src="plugins/line-numbers/index.html" data-start="-5" style="white-space:pre-wrap;"></pre>

</section>

<footer data-src="assets/templates/footer.html" data-type="text/html"></footer>

<script src="prism.js"></script>
<script src="plugins/line-numbers/prism-line-numbers.js"></script>
<script src="assets/vendor/utopia.js"></script>
<script src="components.js"></script>
<script src="assets/code.js"></script>


</body>
</html>
```

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
