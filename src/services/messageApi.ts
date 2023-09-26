/**
 * @description 消息模块
 * @author PeterAlbus
 * @time 2023-08-19
 */

import http from './httpConfig';
import { messageUrl } from "@/services/urlConfig";

export const fetchInBoxMessage = () => http.get({},messageUrl.getInBoxMessageList);

export const fetchOutBoxMessage = () => http.get({},messageUrl.getOutBoxMessageList);

export const unreadMessageCount = () => http.get({},messageUrl.getUnreadMessageCount);

export const readMessageById = (messageId:string) => http.get({messageId},messageUrl.readMessage);
