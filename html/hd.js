/*
      # 按照宽高比例设定html字体, width=device-width initial-scale=1版
      # @pargam win 窗口window对象
      # @pargam option{
        designWidth: 设计稿宽度，必须
        designHeight: 设计稿高度，不传的话则比例按照宽度来计算，可选
        注意点： 安卓下 html的font-size设置小于12px的值不起作用
        注意点： 安卓下 html的font-size设置小于12px的值不起作用
        注意点： 安卓下 html的font-size设置小于12px的值不起作用
        designFontSize: 设计稿宽高下用于计算的字体大小，默认100，可选
        callback: 字体计算之后的回调函数，可选
      }
      # return Boolean;
      # ps:请尽量第一时间运行此js计算字体
      */
/* eslint-disable */
!(function (win, option) {
  let count = 0,
    designWidth = option.designWidth,
    designHeight = option.designHeight || 0,
    designFontSize = option.designFontSize || 20,
    callback = option.callback || null,
    root = document.documentElement,
    body = document.body,
    rootWidth,
    newSize,
    t,
    self,
    metaEl = document.querySelector('meta[name="viewport"]'),
    dpr = window.devicePixelRatio || 1,
    rem = root.clientWidth * dpr / 10,
    scale = 1 / dpr
  ;
  // 设置viewport，进行缩放，达到高清效果
  metaEl.setAttribute('content', `width=${dpr * root.clientWidth},initial-scale=${scale},maximum-scale=${scale}, minimum-scale=${scale},user-scalable=no`);
  // 设置data-dpr属性，留作的css hack之用
  root.setAttribute('data-dpr', dpr);

  root.style.width = '100%';
  root.style.height = '100%';
  // 返回root元素字体计算结果
  function _getNewFontSize() {
    // var scale = designHeight !== 0 ? Math.min(win.innerWidth / designWidth, win.innerHeight / designHeight) : win.innerWidth / designWidth;
    const scale = (window.innerWidth) / designWidth;
    return parseInt(scale * designFontSize);
  }
  !(function () {
    rootWidth = root.getBoundingClientRect().width;
    self = self || arguments.callee;
    // 如果此时屏幕宽度不准确，就尝试再次获取分辨率，只尝试20次，否则使用win.innerWidth计算
    if (rootWidth !== win.innerWidth && count < 20) {
      win.setTimeout(() => {
        count++;
        self();
      }, 0);
    } else {
      newSize = _getNewFontSize();
      // 如果css已经兼容当前分辨率就不管了
      if (`${newSize}px` !== getComputedStyle(root)['font-size']) {
        root.style.fontSize = `${newSize}px`;
        return callback && callback(newSize);
      }
    }
  }());
  // 横竖屏切换的时候改变fontSize，根据需要选择使用
  win.addEventListener('onorientationchange' in window ? 'orientationchange' : 'resize', () => {
    clearTimeout(t);
    t = setTimeout(() => {
      self();
    }, 300);
  }, false);
}(window, {
  designWidth: 750,
  // designHeight: 1136,
  designFontSize: 100, // 安卓下不能设置小于12px的字体 所以这个值要尽量大些
  callback() {
    // console.log("test")
  },
}));
