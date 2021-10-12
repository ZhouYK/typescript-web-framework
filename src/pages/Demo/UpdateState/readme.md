在react能观察到的地方做多次state更新，不会引起多次渲染而是会合并成一次。

react能观察到的地方是指：react知道这个地方是否在执行，这个地方属于哪个组件。如果这个地方在执行，
那么这个地方在执行过程中引起的状态更新会被合并。这样就能解释为什么放在异步回调、原生事件回调中的
状态设置，每一次都会引起组件更新。