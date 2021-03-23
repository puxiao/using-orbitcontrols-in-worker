# using-OrbitControls-in-Worker
English | [简体中文](https://github.com/puxiao/using-orbitcontrols-in-worker/blob/main/README-zh_CN.md)



## Motivation

If we want to using Three.js in a Web Worker to improve web page performance, there are two things we need to do:

1. Transfer control of the canvas elements (HTML CanvasElements) in the Web page to Web Worker through OffscreenCanvas, and start creating and rendering 3D scenes inside the Worker.

2. Control the view of a 3D scene by adding OrbitControls.

When you create an OrbitControls instance, you need to specify an HTMLElement that you will add multiple event listeners to within OrbitControls.



<br>

> OrbitControls.js
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
> See More:
> https://github.com/mrdoob/three.js/blob/dev/examples/jsm/controls/OrbitControls.js



<br>

**That's the problem**

HTMLElement elements cannot be retrieved and various event listeners added in the Web Worker.

That means we can't use OrbitControls in Web Worker.

So what should we do?



<br>

## Solution

We can use "Fictitious HTMLElement" in the Web Worker for OrbitControls.



<br>

**Fictional HTMLElement:**

1. Extends EventDispatcher so you can have dispatchEvent() methods

   > EventDispatcher:
   > Https://github.com/mrdoob/three.js/blob/dev/src/core/EventDispatcher.js

2. Have some of the same properties and methods as HTMLElement, for example:
   1. ownerDocument, width, height, top, left...
   2. focus(), clientWidth(), clientHeight(), getBoundingClientRect()




<br>

**Fictional window**

Simply extends EventDispatcher.

>More attributes and methods may be added in the future.



<br>

**HTMLElement various event agents (ControlsProxy)**

1. Add various event listeners
2. When an event is heard, it is analyzed and packaged into a new event
3. Send the event to Worker as a message by postMessage( { ... } )



<br>

In this way, Orbitcontrols running in web worker can listen to the event normally.

>For orbitcontrols, it doesn't know that what it is listening for is not a real web page element, but a fictitious web page element.



<br>

**Overall solution ideas:**

![using-orbitcontrols-in-worker.jpg](https://puxiao.com/demo/using-orbitcontrols-in-worker/using-orbitcontrols-in-worker.jpg)



## Contents

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

## Tip

* This project adopts react + typescript + worker-loader.
* Due to Src / functional/ xxxxx.js It's written in JS + JSDoc, so you can also apply the code to non typescript projects.
* This project only considers the situation that only one HTMLElement is monitored in the current worker. If you need to monitor multiple HTMLElement, you can modify the third parameter in ControlsProxy constructor().



<br>

## Usage

1. Clone project code.

   ```
   git clone https://github.com/puxiao/using-orbitcontrols-in-worker.git
   ```

   

2. Installation dependence.

   ```
   yarn install
   ```

   or

   ```
   npm install
   ```

   

3. Start local server.

   ```
   yarn start
   ```

   or

   ```
   npm start
   ```

   

4. After the startup is complete, open Chrome or Firefox and visit http://localhost:3000 , look at the console panel, as you may see: 

   > Chrome: 'start in worker'
   >
   > Firefox: 'start in main'
   
   > Currently, Firefox doesn't support OffscreenCanvas.



<br>

## What's missing

This project only writes OrbitControlsProxy, but in the Three.js There are many other track controllers, such as DragControls, FlyControls ...

If you want to use other track controllers, you can try to write corresponding ones XxxControlsProxy.js What you need to do is:

1. Let XxxControlsProxy extends ControlsProxy.
2. Override configEventListener(), dispose ()



<br>

## Sorry

My English is poor, so the JSDoc English comments in the code is not good.

I hope you will understand.



<br>

## Contributing

Welcome to submit bugs, issues or pull requests.

My email address: yangpuxiao@gmail.com

<br>