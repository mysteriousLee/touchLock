## 手势解锁
### 介绍 
#### 主要用到了h5+css3 canvas动画来进行解锁圆圈和解锁路径的渲染，在事件方面主要用到了touchstart，touchmove和touchend三个事件
### 步骤
### 第一步

#### 初始化数据及触摸点并绑定事件，触摸点包括对应坐标及序号，定义两个数组passwordPath用来保存触摸过的点信息，restPoint用来保存去除正确路径之后剩余的触摸点。
### 第二步

#### touchstart事件：初始化触摸起点并加入到passwordPath中，然后将该点从restPoint中删除。锁定某个点是根据遍历所有点当点击位置与某点的圆心距离小于r则锁定某一点。
#### touchmove事件：更新整个画板，调用canvas的moveTo方法和lineTo方法来渲染触摸轨迹，也是根据圆心距离来锁定下一个点。
#### touchend事件：重构整个画板。
### 第三步

#### 通过判断选中的功能来进行不同的操作。
#### 设置密码：设置一个step来存储设置密码的次数，第一次判断密码长度，第二次判断前两次密码是否一致，然后存入到localstorage中。
#### 验证密码：验证localstorage中的数据是否与再次输入的一致，然后抛出对应提示信息。