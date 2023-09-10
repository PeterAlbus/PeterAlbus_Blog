/**
 * @description 友情链接模块
 * @author PeterAlbus
 * @time 2023-08-16
 */

import http from './httpConfig';
import { friendLinkUrl } from "@/services/urlConfig";

export const fetchFriendLinkList = () => http.get({},friendLinkUrl.getFriendLinkList);

export const addFriendLink = (data:any) => http.post(data,friendLinkUrl.addFriendLink);
