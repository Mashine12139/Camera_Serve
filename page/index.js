import { getText } from '@zos/i18n';
import * as hmUI from "@zos/ui";
import { px } from "@zos/utils";
import { getDeviceInfo } from "@zos/device";
import { createWidget,widget,prop} from '@zos/ui';

// 从 @zos/device 直接获取设备信息
const { width: DEVICE_WIDTH } = getDeviceInfo();

// ------------------- UI 布局定义区 -------------------
// 将所有 UI 元素的布局对象都定义在这里，与页面逻辑分开。
const START_BUTTON_STYLE = {
  text: getText("S t a r t"),
  press_color: 0x333333,
  normal_color: 0x1a1a1a,
  x: px(80),
  y: px(240),
  w: DEVICE_WIDTH - 2 * px(80),
  h: px(56),
  color: 0xffffff,
  text_size: px(32),
  radius: px(28),
};

const START_IMA_STYLE = {
  x: px(98), // (48  0 - 124) / 2
  y: px(230)-px(128), // 垂直方向上稍微靠上一点
  w: px(128),
  h: px(128),
  src: '18no.png' // 使用新的、干净的图标
};

// 如果还有其他控件，也像这样定义...
// const OTHER_WIDGET_STYLE = { ... };


// ------------------- 页面逻辑区 -------------------
Page({
build() {
    // 创建一个 Group 作为所有UI元素的容器
    const mainGroup = hmUI.createWidget(hmUI.widget.GROUP, {
      x: 0,
      y: 0,
      w: DEVICE_WIDTH,
      h: DEVICE_HEIGHT
    });

    // 在 Group 内部创建图片
    // 使用了新的图标，并将其放置在屏幕中央偏上的位置
    mainGroup.createWidget(hmUI.widget.IMG, {
     ...START_IMA_STYLE
    });

    // 在 Group 内部创建按钮
    mainGroup.createWidget(hmUI.widget.BUTTON, {
    ...START_BUTTON_STYLE,
      click_func: () => {
        console.log("Button Press!");
      },
    });
  },
  onDestroy() {
    // 页面销毁逻辑
  }
});