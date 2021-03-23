# using-OrbitControls-in-Worker

[English](https://github.com/puxiao/using-orbitcontrols-in-worker/blob/main/README.md) | 简体中文



## 问题的根源

假设我们希望 Three.js 运行在 Web Worker 中以提高网页性能，那么我们需要做 2 件事情：

1. 通过 OffscreenCanvas 将网页中的画布元素(HTMLCanvasElement)的控制权转移给 Web Worker，并且在 Worker 内部开始创建和渲染 3D 场景。
2. 通过添加 OrbitControls 来控制 3D 场景的视图。

创建一个 OrbitControls 实例时需要指定某个 HTMLElement 元素，在 OrbitControls 内部会对该 HTMLElement 元素添加多个事件监听。



<br>

> OrbitControls.js 中需要添加的事件侦听
>
> ```
> scope.domElement.addEventListener( 'contextmenu', onContextMenu );
> scope.domElement.addEventListener( 'pointerdown', onPointerDown );
> scope.domElement.addEventListener( 'wheel', onMouseWheel );
> scope.domElement.addEventListener( 'touchstart', onTouchStart );
> scope.domElement.addEventListener( 'touchend', onTouchEnd );
> scope.domElement.addEventListener( 'touchmove', onTouchMove );
> scope.domElement.ownerDocument.addEventListener( 'pointermove', onPointerMove );
> scope.domElement.ownerDocument.addEventListener( 'pointerup', onPointerUp );
> domElement.addEventListener( 'keydown', onKeyDown )
> ```
>
> 查看详情：
> https://github.com/mrdoob/three.js/blob/dev/examples/jsm/controls/OrbitControls.js



<br>

**那么问题来了**

在 Web Worker 中无法获取 HTMLElement 元素，以及 HTMLElement 元素对应的各种事件。

也就意味着我们无法在 Web Worker 中使用 OrbitControls。



那我们该怎么办？



<br>

## 解决方案

我们可以通过在 Web Worker 中 “虚构网页元素” 的方式来让 OrbitControls 可以正常运行。



<br>

**虚构的网页元素：**

1. 继承于 EventDispatcher，这样便可以拥有 dispatchEvent() 方法

   > EventDispatcher:
   > https://github.com/mrdoob/three.js/blob/dev/src/core/EventDispatcher.js

2. 拥有一些 HTMLElement 相同的一些属性和方法，例如：

   1. ownerDocument、width、height、top、left ...
   2. focus()、clientWidth()、clientHeight()、getBoundingClientRect()



<br>

**虚构的window**

仅仅继承于 EventDispatcher 即可。

> 未来或许会添加更多属性和方法。



<br>

**网页元素各种事件代理者**

1. 添加各种事件侦听
2. 当监听到事件发生后，对该事件进行分析、包装成新的事件
3. 通过 worker.postMessage({ ... }) 将该事件当做消息发送给 Worker



<br>

**Worker接收消息后做出相应的处理**

1. 根据消息的类型，做出相应的处理
2. 如果消息的类型是交互事件，则让 “虚构的网页元素 或 window” 抛出该事件



<br>

这样，运行在 Web Worker 中的 OrbitControls 便可以正常监听到该事件了。

> 对于 OrbitControls 来说，他并不知道自己监听的并不是真的网页元素，而是一个虚构的网页元素。



<br>

整体的解决方案思路：

![using-orbitcontrols-in-worker.jpg](https://puxiao.com/demo/using-orbitcontrols-in-worker/using-orbitcontrols-in-worker.jpg)

<br>

## 代码结构

```
│
│ src
│
├── components/orbitcontrols-in-worker
│   ├── create-world.ts
│   ├── index.css
│   ├── index.tsx
│   └── worker.ts
│
├── fictional
│   ├── ControlsProxy.js
│   ├── FictionalElement.js
│   ├── FictionalElementManager.js
│   ├── FictionalWindow.js
│   ├── OrbitControlsProxy.js
│   └── WorkerMessageType.js
│
└── typing
│   └── worker-load.d.ts
│
```



<br>

## 提示

* 本项目采用 React + TypeScript + Worker-loader。
* 由于 src/fictional/xxxxx.js 采用 JS + JSDoc 编写，所以你也可以将代码应用在非 TypeScript 项目中。
* 本项目只考虑了当前 Worker 中只监控 1 个网页元素的情况，如果需要监听多个网页元素，你可以修改 ControlsProxy constructor() 中第 3 个参数。



<br>

## 运行示例

1. 克隆本项目

   ```
   git clone https://github.com/puxiao/using-orbitcontrols-in-worker.git
   ```

   

2. 安装依赖

   ```
   yarn install
   ```

   or

   ```
   npm install
   ```

   

3. 创建本地服务

   ```
   yarn start
   ```

   or

   ```
   npm start
   ```

   

4. 打开 谷歌浏览器 Chrome 或 火狐浏览器 Firefox，访问 http://localhost:3000 请注意查看 Console 面板，你会看到以下信息：

   > Chrome: 'start in worker'
   >
   > Firefox: 'start in main'
   
   > 目前火狐浏览器并不支持 OffscreenCanvas。



<br>

## 有哪些遗漏

本项目仅仅编写了 OrbitControlsProxy，但是在 Three.js 中还有很多其他的轨道控制器，例如 DragControls、FlyControls 等等。

如果你想使用其他轨道控制器，你可以尝试编写对应的 XxxControlsProxy.js，你需要做的事情是：

1. 让 XxxControlsProxy 继承于 ControlsProxy
2. 重写 configEventListener()、dispose()



<br>

## 致歉

由于本人英语水平十分有限，所以代码中 JSDoc 英语注释写得十分糟糕。 

望体谅。



<br>

## 贡献

欢迎提交 Bug、Issues 或 Pull requests。

我的邮箱：yangpuxiao@gmail.com