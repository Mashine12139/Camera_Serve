import * as hmUI from "@zos/ui";
import { getText } from "@zos/i18n";
import { px } from "@zos/utils";
import { DEVICE_WIDTH } from "../../utils/constants";

export const START_BUTTON = {
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
