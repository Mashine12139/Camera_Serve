import { getText } from "@zos/i18n";
import { getDeviceInfo, SCREEN_SHAPE_SQUARE } from "@zos/device";

export const {
  width: DEVICE_WIDTH,
  height: DEVICE_HEIGHT,
  screenShape,
} = getDeviceInfo();