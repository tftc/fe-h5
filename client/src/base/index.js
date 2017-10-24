/**
 * @description 移动端适配 动态计算rem
 * @time 2016.5.25
 * @author shijianguo
 */
 
'use strict';

import './index.less';

var dpr, rem, scale, win;
var docEl = document.documentElement;
var fontEl = document.createElement('style');
var metaEl = document.querySelector('meta[name="viewport"]');
var win = window;

dpr = Math.floor(win.devicePixelRatio) || 1;
rem = docEl.clientWidth * dpr / 10;
scale = 1 / dpr;

// 设置viewport，进行缩放，达到高清效果
metaEl.setAttribute('content', 'width=' + dpr * docEl.clientWidth + ',initial-scale=' + scale + ',maximum-scale=' + scale + ', minimum-scale=' + scale + ',user-scalable=no');
// 设置data-dpr属性，留作的css hack之用
docEl.setAttribute('data-dpr', dpr);
// 动态写入样式
docEl.firstElementChild.appendChild(fontEl);
fontEl.innerHTML = 'html{font-size:' + rem + 'px!important;}';

// 给js调用的，某一dpr下rem和px之间的转换函数
window.rem2px = function(v) {
  v = parseFloat(v);
  return v * rem;
};
window.px2rem = function(v) {
  v = parseFloat(v);
  return v / rem;
};
window.dpr = dpr;
window.rem = rem;