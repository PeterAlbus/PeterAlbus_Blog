import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import qs from "qs";

import { ElMessage } from "element-plus";
import { BASE_URL } from "@/services/urlConfig";


// 可能需要自定义添加些配置
// interface AxiosRequestConfig extends _AxiosRequestConfig {}
// interface AxiosResponse extends _AxiosResponse { }
// 约束封装axios四个方法的对象
interface Http {
    get(data: any, url: string, header?: any, baseUrl?: string, showErrorMsg?:boolean): Promise<any>;
    post(data: any, url: string, header?: any, baseUrl?: string, showErrorMsg?:boolean): Promise<any>;
    put(data: any, url: string, header?: any, baseUrl?: string, showErrorMsg?:boolean): Promise<any>;
    delete(data: any, url: string, header?: any, baseUrl?: string, showErrorMsg?:boolean): Promise<any>;
}
// 约束方法名称数组
type HttpName = keyof Http;
// 方法名称数组，用于循环封装axios方法
const funArr: HttpName[] = ['get', 'post', 'put', 'delete'];
// axios 全局配置
const DEFAULT_CONFIG: AxiosRequestConfig = {
    timeout: 30 * 1000 // 超时
};

const http = {};

funArr.map((key: HttpName) => {
    // 断言当前http类型
    (<Http>http)[key] = async (data, url, header = null, baseURL = BASE_URL, showErrorMsg = true) => {
        // 根据全局配置创建 axios 实例
        const instance = axios.create(DEFAULT_CONFIG);
        // instance.defaults.transformRequest = data => qs.stringify(data);

        // 请求拦截器
        instance.interceptors.request.use(
          (config: AxiosRequestConfig) => {
              if (localStorage.getItem("token") && config.headers ) { //判断token是否存在
                  config.headers['satoken_peteralbus_blog'] = localStorage.getItem("token")||'';  //将token设置成请求头
              }
              return config;
          },
          err => Promise.reject(err)
        );

        // 响应拦截器
        instance.interceptors.response.use(
          (response: AxiosResponse) => {
              if (response.status && response.status === 200) {
                  if(response.data.code === 200) {
                      return response.data;
                  }
                  if(showErrorMsg) {
                      ElMessage.error(response.data.message);
                  }
                  return Promise.reject(response.data.message);
                  // if (response.data.status) {
                  // 	return response.data.msg;
                  // } else {
                  // 	ElMessage.error(response.data.error);
                  // 	return Promise.reject(response.data.error);
                  // }
              }
          },
          error => {
              if (error && error.response) {
                  let msg = "服务器出错！";
                  switch (error.response.status) {
                      case 400:
                          msg = "错误请求";
                          break;
                      case 401:
                          msg = "未授权，请重新登录";
                          break;
                      case 403:
                          msg = "拒绝访问";
                          break;
                      case 404:
                          msg = "请求错误,未找到该资源";
                          break;
                      case 405:
                          msg = "请求方法未允许";
                          break;
                      case 408:
                          msg = "请求超时";
                          break;
                      case 500:
                          if (error.response.data.message != null) {
                              msg = error.response.data.message;
                          } else msg = "服务器出错!";
                          break;
                      case 501:
                          msg = "服务器无法识别请求方法";
                          break;
                      case 502:
                          msg = "网络错误";
                          break;
                      case 503:
                          msg = "服务不可用";
                          break;
                      case 504:
                          msg = "网络超时";
                          break;
                      case 505:
                          msg = "http版本不支持该请求";
                          break;
                      default:
                          msg = "未知的错误，请联系管理员！";
                  }
                  ElMessage.error({ message: msg });
              } else {
                  // 超时处理
                  if (error.message.includes("timeout")) {
                      ElMessage.error({ message: "服务器响应超时，请刷新当前页" });
                  } else {
                      ElMessage.error({ message: "未知的错误，请联系管理员！" });
                  }
              }
              return Promise.reject(error);
          }
        );

        // 组织请求数据
        const requestData: AxiosRequestConfig = {
            method: key,
            headers: header || { "Content-Type": "application/x-www-form-urlencoded" },
            url,
            baseURL
        };
        // 对请求中的 data 进行处理
        if (key === "get") {
            requestData.params = data;
        } else if (data instanceof FormData) {
            // 一般post采用FormData的形式发送数据
            requestData.data = data;
        } else {
            // 将对象转为url参数形式 { a: 1, b: 2 } => ?a=1&b=2
            requestData.data = qs.stringify(data);
        }

        try {
            return await instance
              .request(requestData);
        } catch (error_1) {
            return await Promise.reject(error_1);
        }
    };
});

export default <Http>http;
