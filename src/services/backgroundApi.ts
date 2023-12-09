/**
 * @description 背景图片模块
 * @author PeterAlbus
 * @time 2023-08-15
 */

import http from './httpConfig';
import { backgroundUrl } from "@/services/urlConfig";

export const fetchBackgroundList = () => http.get({},backgroundUrl.getBackgroundList);
