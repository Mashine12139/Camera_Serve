import { getText } from '@zos/i18n'
import * as hmUI from "@zos/ui";
import {
    START_BUTTON,
}
from 'zosLoader:./index.layout.js'
Page({
  build() {
    console.log(getText('example'));
    hmUI.createWidget(hmUI.widget.BUTTON,{
    ...START_BUTTON,
    click_func: () =>{
      console.log("Button Press!");
    },
    });
  },
});
