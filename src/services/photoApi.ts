/**
 * @description 图像模块
 * @author PeterAlbus
 * @time 2023-08-28
 */

import http from './httpConfig';
import { photoUrl } from "@/services/urlConfig";

export const fetchPhotoList = () => http.get({},photoUrl.getPhotoList);
