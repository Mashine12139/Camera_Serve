import { getText } from '@zos/i18n';
import * as hmUI from "@zos/ui";
import { px } from "@zos/utils";
import { createWidget,widget,prop} from '@zos/ui';
import { push } from '@zos/router';
import { getApp } from '@zos/app'
import { openSync, writeSync, closeSync ,O_RDWR} from '@zos/fs'
import { getDeviceInfo } from "@zos/device";

// 从 @zos/device 直接获取设备信息
const { width: DEVICE_WIDTH , height: DEVICE_HEIGHT} = getDeviceInfo();
const messageBuilder = getApp()._options.globalData;
// ------------------- UI 布局定义区 -------------------
// 将所有 UI 元素的布局对象都定义在这里，与页面逻辑分开。
const START2_BUTTON_STYLE = {
  text: getText("Start"),
  press_color: 0x333333,
  normal_color: 0x1a1a1a,
  x: px(0),
  y: px(268),
  w: px(124),
  h: px(56),
  color: 0xffffff,
  text_size: px(32),
  radius: px(28),
};

const CONTINUE_BUTTON_STYLE = {
  text: getText("Again"),
  press_color: 0x333333,
  normal_color: 0x1a1a1a,
  x: px(196),
  y: px(268),
  w: px(124),
  h: px(56),
  color: 0xffffff,
  text_size: px(32),
  radius: px(28),
};

const CAMERA_IMA_STYLE = {
  x: px(0), 
  y: px(0), 
  w: px(128),
  h: px(128),
};

// 如果还有其他控件，也像这样定义...
// const OTHER_WIDGET_STYLE = { ... };


// ------------------- 页面逻辑区 -------------------
Page({
state:{
    imageWidget: null,
    fileInfo: {},
    receivedChunks: [],
    receivedSize: 0,
    },

onInit() {
    console.log("Requesting phone to send image...");
    messageBuilder.request({
        method: 'FETCH_AND_SEND_IMAGE'
    })
    .then(data => {
        console.log('Phone replied:',data.result);
    });
    console.log("Init success!");
  },

assembleAndSaveFile() {
    // 1. 创建一个足够大的 ArrayBuffer 来容纳所有数据
    const finalBuffer = new Uint8Array(fileInfo.fileSize);
    let offset = 0;
  
    // 2. 将所有小块数据复制到大的 Buffer 中
    receivedChunks.forEach(chunk => {
      finalBuffer.set(chunk, offset);
      offset += chunk.length;
    });

    // 3. 将最终的 Buffer 写入手表的文件系统
    const file = openSync({ path: fileInfo.fileName, flag: O_RDWR });
    writeSync({ fd: file, buffer: finalBuffer.buffer });
    closeSync({ fd: file });
    
    console.log('File saved successfully:', fileInfo.fileName);
    // 4. 在这里更新你的 IMG 控件的 src
    this.imageWidget.setProperty(prop.SRC, fileInfo.fileName);
  },

build() {
    //利用蓝牙将图片文件传输到手表上.
    //摄像头===>手机===>压缩图片画质===>>手表显示大致位置即可.
    //
    //监听来自手机的消息,
    const self = this;
    messageBuilder.on('request',(ctx)=>{
        const {method,params} = ctx.request
        switch (method) {
        case 'FILE_TRANSFER_START':
          // 收到开始信令，准备好接收
          self.state.fileInfo = {
            fileName: params.fileName,
            fileSize: params.fileSize,
          };
          self.state.receivedChunks = [];
          self.state.receivedSize = 0;
          console.log('Starting to receive file:', fileInfo.fileName);
          break;
          
        case 'FILE_TRANSFER_CHUNK':
          // 收到数据块，存入数组
          const chunk = params.chunk;
          self.state.receivedChunks.push(new Uint8Array(chunk));
          self.state.receivedSize += chunk.byteLength;
          // 这里可以更新UI显示进度
          console.log(`Progress: ${receivedSize} / ${fileInfo.fileSize}`);
          break;

        case 'FILE_TRANSFER_END':
          // 收到结束信令，开始拼接文件
          console.log('File receive complete. Assembling...');
          self.assembleAndSaveFile();
          break;
      }
    });
    // 创建一个 Group 作为所有UI元素的容器
    const SecondGroup = hmUI.createWidget(hmUI.widget.GROUP, {
      x: 0,
      y: 0,
      w: DEVICE_WIDTH,
      h: DEVICE_HEIGHT
    });

    // 在 Group 内部创建图片
    // 使用了新的图标，并将其放置在屏幕中央偏上的位置
    this.state.imageWidget=SecondGroup.createWidget(hmUI.widget.IMG, {
     ...CAMERA_IMA_STYLE,
     src:'' //初始值设置为空，占位.
    });
    // 在 Group 内部创建按钮
    SecondGroup.createWidget(hmUI.widget.BUTTON, {
    ...START2_BUTTON_STYLE,
      click_func: () => {
        console.log("Start Press!");
      },
    });
    SecondGroup.createWidget(hmUI.widget.BUTTON, {
    ...CONTINUE_BUTTON_STYLE,
      click_func: () => {
        console.log("Continue Press!");
      },
    });
  },

  onDestroy() {
    // 页面销毁逻辑
    if (messageBuilder) {
      messageBuilder.off(); // 4. 页面销毁时，清理监听事件
    }
  }
});