import { getText } from '@zos/i18n';
import * as hmUI from "@zos/ui";
import { px } from "@zos/utils";
import { getDeviceInfo } from "@zos/device";

// 从 @zos/device 直接获取设备信息
const { width: DEVICE_WIDTH } = getDeviceInfo();

// ------------------- UI 布局定义区 -------------------
// 将所有 UI 元素的布局对象都定义在这里，与页面逻辑分开。
const START_BUTTON_STYLE = {
  text: getText("Start"),
  press_color: 0x333333,
  normal_color: 0x1a1a1a,
  x: px(108),
  y: px(376),
  w: DEVICE_WIDTH - 2 * px(108),
  h: px(56),
  color: 0xffffff,
  text_size: px(32),
  radius: px(28),
};

// 如果还有其他控件，也像这样定义...
// const OTHER_WIDGET_STYLE = { ... };


// ------------------- 页面逻辑区 -------------------
Page({
  build() {
    console.log(getText('example'));

    // 在这里创建控件，引用上面定义好的样式对象
    hmUI.createWidget(hmUI.widget.BUTTON, {
      ...START_BUTTON_STYLE, // 使用样式对象
      click_func: () => {
        console.log("Button Press!");
        // 在这里添加按钮的点击逻辑
      },
    });

    // hmUI.createWidget(hmUI.widget.TEXT, { ...OTHER_WIDGET_STYLE });
  },

  onDestroy() {
    // 页面销毁逻辑
  }
});