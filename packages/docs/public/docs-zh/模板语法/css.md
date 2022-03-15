# css template chinese
这是一个链接 [Markdown语法](#999)。

# 111
## 222
### 333


```html
<img 
  src="https://i.imgur.com/yXOvdOSs.jpg" 
  alt="Hedy Lamarr" 
  className="photo"
/>
```
```css
@import "fruits";

@rhythm: 1.5em;

@media screen and (min-resolution: 2dppx) {
    body {font-size: 125%}
}

section > .foo + #bar:hover [href*="less"] {
    margin:     @rhythm 0 0 @rhythm;
    padding:    calc(5% + 20px);
    background: #f00ba7 url(http://placehold.alpha-centauri/42.png) no-repeat;
    background-image: linear-gradient(-135deg, wheat, fuchsia) !important ;
    background-blend-mode: multiply;
}

@font-face {
    font-family: /* ? */ 'Omega';
    src: url('../fonts/omega-webfont.woff?v=2.0.2');
}

.icon-baz::before {
    display:     inline-block;
    font-family: "Omega", Alpha, sans-serif;
    content:     "\f085";
    color:       rgba(98, 76 /* or 54 */, 231, .75);
}
```

```js
      var src;
      function getUrlByHash(treeNode: dirType) {
        if (treeNode.abstractSrc === abstractSrc) {
          src = treeNode.src;
          return;
        }
        if (treeNode.children) {
          treeNode.children.forEach(getUrlByHash);
        }
      }
      getUrlByHash(this.tree);
```