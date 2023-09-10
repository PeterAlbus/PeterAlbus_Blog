/**
 * @description 音乐列表模块
 * @author PeterAlbus
 * @time 2023-08-15
 */

import http from './httpConfig';
import { musicUrl } from "@/services/urlConfig";

export const fetchMusicList = () => http.get({},musicUrl.getMusicList);
