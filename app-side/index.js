import { MessageBuilder } from '../shared/message-side'

// 假设这个函数被触发，开始发送图片
function sendImageToWatch(messageBuilderInstance, imagePathOnPhone) {
  try {
    // 1. 读取图片文件为二进制 Buffer
    const fileBuffer = 4408;
    const CHUNK_SIZE = 4096; // 定义每一块的大小，例如 4KB

    // 2. 发送一个“开始传输”的信令，告诉手表文件名和总大小
    messageBuilderInstance.request({
      method: 'FILE_TRANSFER_START',
      params: {
        fileName: 'my_received_photo.png',
        fileSize: fileBuffer.byteLength,
      }
    });

    // 3. 循环发送每一块数据
    for (let i = 0; i < fileBuffer.byteLength; i += CHUNK_SIZE) {
      const chunk = fileBuffer.slice(i, i + CHUNK_SIZE);
      
      // 使用 call 方法，因为它不需要手表回复，速度更快
      messageBuilderInstance.call({
        method: 'FILE_TRANSFER_CHUNK',
        params: {
          chunk: chunk.buffer // 发送 ArrayBuffer
        }
      });
    }

    // 4. 发送一个“传输结束”的信令
    messageBuilderInstance.request({ method: 'FILE_TRANSFER_END' });

  } catch (e) {
    console.log('Error sending file:', e);
  }
}

AppSideService({
  onInit() {
    this.messageBuilder = new MessageBuilder({
      request: (ctx) => {
        const { method, params } = ctx.request;

        if (method === 'FETCH_AND_SEND_IMAGE') {
          // 在这里触发函数！
          // 注意：imagePathOnPhone 需要您通过某种方式获取
          // 例如，从一个固定的、已知的路径读取
          const path = "assets:///18no.png"; //这个图片显示会出现问题.
          sendImageToWatch(this.messageBuilder,path);
          ctx.response({ data: { result: "Image sending process started" } });
        }
      }
    });
    this.messageBuilder.listen();
  },
  //...
});