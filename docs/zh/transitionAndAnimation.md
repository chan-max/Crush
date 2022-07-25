# 过渡与动画

## transition 

## transition 指令

transition 指令是框架内置的指令 ， 用于为元素的进入离开添加动画效果（指令目前只支持元素，不支持组件）

transition有两种类型，一种是在进入离开相应的时机时绑定不同的class，另一种是在进入离开时，执行一次预定义的动画帧

- css 过渡
- animate 动画过渡

### css transition

自动绑定的class如下

- transition-enter
- transition-enter-from
- transition-enter-leave
- transition-leave
- transition-leave-from
- transition-leave-to

### transition指令的使用

## transition group 中的 appear
因为 transition-group 本身第一次就不会过渡 ， 所以appear属性失效

### transition-group

框架内部提供了 transition-group 组件

组件插槽内容当更新时，会自动比较出新增或卸载的节点，并执行进入或离开动画，
props与transition组件基本相同，但 appear 属性无效，只会在更新时才会执行动画




## 内置动画

框架本身提供了与animate.css相同的动画 ，如下



- slideIndown 向下滑动进入
- slideInUp 向上滑动进入
- slideInLeft 向左滑动进入
- slideInRight 向右滑动进入

- zoomIn 缩放进入
- zoomInDown 向下缩放进入
- zoomInLeft 向左缩放进入
- zoomInRight 向右缩放进入
- zoomInUp 向上缩放进入
- zoomOut 缩放离开
- zoomOutDown 向下缩放离开
- zoomOutLeft 向左缩放离开
- zoomOutRight 向右缩放离开
- zoomOutUp 向上缩放离开
  
- rollIn 滚动进入
- rollOut 滚动离开
  
- hinge 合页
- jackInTheBox 千斤顶

- bounce 弹跳
  
- bounceIn 弹跳进入
- bounceOut 弹跳离开
- bounceInDown 向下弹跳进入
- bounceInLeft 向左弹跳进入
- bounceInRight 向右弹跳进入
- bounceInUp 向上弹跳进入

-  bounceOutDown 向下弹跳离开
-  bounceOutLeft 向左弹跳离开
-  bounceOutRight 向右弹跳离开
-  bounceOutUp 向上弹跳离开

- rotateIn
- rotateInDownLeft
- rotateInDownRight
- rotateInUpLeft
- rotateInUpRight

- rotateOut
- rotateOutDownLeft
- rotateOutDownRight
- rotateOutUpLeft
- rotateOutUpRight

- fadeIn
- fadeInDown
- fadeInDownBig
- fadeInLeft
- fadeInLeftBig
- fadeInRight
- fadeInRightBig
- fadeInUp
- fadeInUpBig
- fadeInTopLeft
- fadeInTopRight
- fadeInBottomLeft
- fadeInBottomRight

- fadeOut
- fadeOutDown
- fadeOutDownBig
- fadeOutLeft
- fadeOutLeftBig
- fadeOutRight
- fadeOutRightBig
- fadeOutUp
- fadeOutUpBig
- fadeOutTopLeft
- fadeOutTopRight
- fadeOutBottomRight
