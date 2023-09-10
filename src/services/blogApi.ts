/**
 * @description 用户账户模块
 * @author PeterAlbus
 * @time 2023-08-15
 */

import http from './httpConfig';
import axios from "axios";
import { blogUrl } from "@/services/urlConfig";

export const fetchBlogList = () => http.get({},blogUrl.getBlogList);
export const fetchBlogById = (id:string) => http.get({ id:id }, blogUrl.getBlogById);

export const visitBlog = (blogId:any, ipAddress:string) =>
  http.get({ blogId:blogId, ipAddress:ipAddress }, blogUrl.visitBlog);

export const getIpAddress = () => axios.get('https://ip.useragentinfo.com/json')

export const updateBlog = (data: any) => http.post(data, blogUrl.updateBlog);

export const addBlog = (data: any) => http.post(data, blogUrl.addBlog);
