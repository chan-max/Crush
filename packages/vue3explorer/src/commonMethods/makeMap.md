# makeMap

makeMap 是vue中的一个小方法，根据一段字符串生成一个map映射，并返回一个方法用于判断元素是否存在该列表中

源代码如下：
```
function makeMap(str, expectsLowerCase) {
    const map = Object.create(null);
    const list = str.split(',');
    for (let i = 0; i < list.length; i++) {
        map[list[i]] = true;
    }
    return expectsLowerCase ? val => !!map[val.toLowerCase()] : val => !!map[val];
}
```

### 小细节

- 第二个参数为true时，传入的值转为小写
- 用于生成map的字符串用 **，** 间隔，并且不能出现空格换行
- 使用 Object.create(null) , 而非普通对象，防止出现原型链上的方法名 