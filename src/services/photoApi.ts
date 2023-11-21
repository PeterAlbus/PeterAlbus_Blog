/**
 * @description 图像模块
 * @author PeterAlbus
 * @time 2023-08-28
 */

import http from './httpConfig';
import { photoUrl } from "@/services/urlConfig";

export const fetchPhotoList = () => http.get({},photoUrl.getPhotoList);

export const uploadOriginPhoto = (data: FormData) => http.post(data,
  photoUrl.uploadOriginImg,
  { "Content-Type": "multipart/form-data" },
  'https://www.peteralbus.com:8089');

export const deletePhotoByUrl = (url: string) => http.get(
  { photoUrl: url },
  photoUrl.deletePhotoByUrl,
  undefined,
  'https://www.peteralbus.com:8089');

export const deletePhotoById = (id: string) => http.get(
  { photoId: id },
  photoUrl.deletePhotoById,
  undefined,
  'https://www.peteralbus.com:8089');
