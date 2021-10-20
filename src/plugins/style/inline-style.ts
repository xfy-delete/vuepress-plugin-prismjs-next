const style = `
span.inline-style-wrapper {
  background: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyIDIiPjxwYXRoIGZpbGw9ImdyYXkiIGQ9Ik0wIDBoMnYySDB6Ii8+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0wIDBoMXYxSDB6TTEgMWgxdjFIMXoiLz48L3N2Zz4=");
  background-position: center;
  background-size: 110%;
  display: inline-block;
  height: 1.333ch;
  width: 1.333ch;
  margin: 0 .333ch;
  box-sizing: border-box;
  border: 1px solid white;
  outline: 1px solid rgba(0,0,0,.5);
  overflow: hidden;
}

span.inline-style-previewer {
  display: inline-block;
  vertical-align: middle;
  height: 1.333ch;
  width: 1.333ch;
  margin: auto 0.6ch;
  position: relative;
}

span.inline-style-previewer-angle[data-negative] svg{
	-webkit-transform: scaleX(-1) rotate(-90deg);
	-moz-transform: scaleX(-1) rotate(-90deg);
	-ms-transform: scaleX(-1) rotate(-90deg);
	-o-transform: scaleX(-1) rotate(-90deg);
	transform: scaleX(-1) rotate(-90deg);
}

span.inline-style-previewer-angle svg {
  height: 1.333ch;
  width: 1.333ch;
  -webkit-transform: rotate(-90deg);
  -moz-transform: rotate(-90deg);
  -ms-transform: rotate(-90deg);
  -o-transform: rotate(-90deg);
  transform: rotate(-90deg);
}

span.inline-style-previewer-angle circle {
  fill: transparent;
  stroke: hsl(200, 10%, 20%);
  stroke-opacity: 0.9;
  stroke-width: 32;
  stroke-dasharray: 0, 500;
}

.inline-style-previewer:before {
  top: -5px;
  right: -5px;
  left: -5px;
  bottom: -5px;
  border-radius: 50%;
  background: #fff;
  border: 5px solid #fff;
  box-shadow: 0 0 3px rgb(0 0 0 / 50%) inset, 0 0 10px rgb(0 0 0 / 75%);
}

.inline-style-previewer:before {
  content: '';
  position: absolute;
  pointer-events: none;
}

span.inline-style {
  display: block;
  height: 120%;
  width: 120%;
}`;

export default style;
