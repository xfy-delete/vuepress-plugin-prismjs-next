# 测试

## css

```css
.example-gradient {
	background: -webkit-linear-gradient(-45deg, #9dd53a 0%, #a1d54f 50%, #80c217 51%, #7cbc0a 100%); /* Chrome10+, Safari5.1+ */
	background:    -moz-linear-gradient(-45deg, #9dd53a 0%, #a1d54f 50%, #80c217 51%, #7cbc0a 100%); /* FF3.6+ */
	background:     -ms-linear-gradient(-45deg, #9dd53a 0%, #a1d54f 50%, #80c217 51%, #7cbc0a 100%); /* IE10+ */
	background:      -o-linear-gradient(-45deg, #9dd53a 0%, #a1d54f 50%, #80c217 51%, #7cbc0a 100%); /* Opera 11.10+ */
	background:         linear-gradient(135deg, #9dd53a 0%, #a1d54f 50%, #80c217 51%, #7cbc0a 100%); /* W3C */
}
@angle: 3rad;
.example-angle {
	transform: rotate(.4turn)
}
@nice-blue:
#5B83AD;
.example-color {
	color:
hsla(102, 53%, 42%, 0.4);
}
@easing: cubic-bezier(0.1, 0.3, 1, .4);
.example-easing {
	transition-timing-function: ease;
}
@time: 1s;
.example-time {
	transition-duration: 2s;
}
```
