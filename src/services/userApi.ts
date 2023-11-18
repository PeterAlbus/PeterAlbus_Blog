/**
 * @description 用户账户模块
 * @author PeterAlbus
 * @time 2023-08-15
 */

import http from './httpConfig';
import { userUrl } from "@/services/urlConfig";

export const isLogin = () => http.get({},userUrl.isLogin);
export const mailLogin = (data: object) => http.get(data, userUrl.mailLogin);
export const phoneLogin = (data: object) => http.get(data, userUrl.phoneLogin);

export const register = (data: object) => http.post(data, userUrl.register);

export const fetchMailVerifyCode = (account: string) => http.get({ account }, userUrl.applyMailVerifyCode);

export const fetchPhoneVerifyCode = (account: string) => http.get({ account }, userUrl.applyPhoneVerifyCode);

export const fetchUserById = (id: string) => http.get({userId:id}, userUrl.getUserById);

export const logoutUser = () => http.get({}, userUrl.logout);

export const changeUsername = (userId: string, username: string) => http.get({ userId, username }, userUrl.changeUsername);

export const changePasswordByOld = (data:object) => http.get(data, userUrl.changePassword);

export const changePhone = (data:object) => http.get(data, userUrl.setPhone);

export const changeMail = (data:object) => http.get(data, userUrl.setMail);

export const fetchResetPasswordVerifyCode = (account: string, type: string) =>
  http.get({ account, type }, userUrl.applyResetPasswordVerifyCode);

export const resetPassword = (data:object) =>
  http.get(data, userUrl.resetPassword);


