/**
 * @description 评论模块
 * @author PeterAlbus
 * @time 2023-08-16
 */

import http from './httpConfig';
import { commentUrl } from "@/services/urlConfig";

export const fetchCommentByBlogId = (id:string) => http.get({blogId:id},commentUrl.getCommentByBlogId);

export const fetchChildCommentByCommentId = (id:string) => http.get({commentId:id},commentUrl.getChildCommentByCommentId);

export const postComment = (data: any) => http.post(data, commentUrl.addComment);

export const deleteExistComment = (data: any) => http.post(data,commentUrl.deleteComment);
