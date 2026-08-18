# 前端所依赖的后端契约

本文记录当前前端如何消费后端，而不是理想 API 设计。后端接口的完整权威清单位于相邻后端仓库的 `docs/api-contract.md`；任何接口变更都必须同时核对两端实现和两份文档。

## 传输与响应规则

`src/services/httpConfig.ts` 为每次调用创建 Axios 实例，默认超时 30 秒，基地址来自 `src/services/urlConfig.ts`。

- GET 参数放在 query string。
- POST/PUT/DELETE 默认使用 `application/x-www-form-urlencoded`，请求数据经 `qs.stringify` 转换。
- 普通请求不会发送 JSON。
- 若 `localStorage.token` 存在，请求头携带 `satoken_peteralbus_blog: <token>`。
- 后端业务响应统一为：

```ts
interface Result<T> {
  code: number
  message: string
  data: T | null
}
```

后端通常仍以 HTTP 200 传输业务失败；前端以响应体 `code === 200` 判断成功。成功 Promise 的值是 `Result<T>`，因此业务数据从 `res.data` 读取。业务失败会弹出 `message` 并以该消息字符串 reject；HTTP/网络失败则以 Axios error reject。

后端给 Snowflake ID 加了字符串序列化。`blogId`、`commentId`、`commentTargetId`、`commentUserId`、`userId`、`linkId`、`musicId`、`imgId` 在前端必须保持字符串语义。

## 当前被前端调用的接口

“编码”列描述前端实际发送方式；字段名必须精确匹配。

### 用户

| 前端函数/位置 | 方法与路径 | 输入 | 使用的输出 |
| --- | --- | --- | --- |
| `mailLogin` | GET `/user/mailLogin` | `userMail`, `userPassword` | `data.tokenValue` |
| `phoneLogin` | GET `/user/phoneLogin` | `userPhone`, `userPassword` | `data.tokenValue` |
| `isLogin` | GET `/user/isLogin` | token header | `data` 为当前 `User` |
| `logoutUser` | GET `/user/logout` | token header | 仅判断成功 |
| `fetchMailVerifyCode` | GET `/user/applyMailVerifyCode` | `account` | 仅判断成功 |
| `fetchPhoneVerifyCode` | GET `/user/applyPhoneVerifyCode` | `account` | 仅判断成功 |
| `register` | POST form `/user/register` | `userUsername`, `userPhone` 或 `userMail`, `userPassword`, `verifyCode`, `userAvatar` | 仅判断成功 |
| `fetchUserById` | GET `/user/getUserById` | `userId` | 脱敏公开用户资料 |
| `changeUsername` | GET `/user/changeUsername` | `userId`, `username` | 仅判断成功 |
| `changePasswordByOld` | GET `/user/changePassword` | `userId`, `oldPassword`, `newPassword`; 表单还含后端忽略的 `userConfirmPassword` | 成功后退出 |
| `changePhone` | GET `/user/setPhone` | 前端发送 `userId`, `userPhone`, `verifyCode` | 见“已知偏差” |
| `changeMail` | GET `/user/setMail` | 前端发送 `userId`, `userMail`, `verifyCode` | 见“已知偏差” |
| `UserCenter.vue` 上传 | multipart POST `/user/uploadAvatar` | `file`, `userId`, token header | `data` 为头像 URL |

`User` 当前字段：`userId`, `userUsername`, `userPassword`, `userPhone`, `userMail`, `userIdentity`, `userAvatar`, `userSalt`, `gmtCreate`。普通登录态响应只清空密码和 salt；公开用户查询还清空手机和邮箱。

### 文章

| 前端函数/位置 | 方法与路径 | 输入 | 使用的输出 |
| --- | --- | --- | --- |
| `fetchBlogList` | GET `/blog/queryAll` | 无 | 非隐藏文章数组；正文为空字符串 |
| `fetchBlogById` | GET `/blog/queryById` | `id` | 完整 `Blog` |
| `visitBlog` | GET `/blog/visitBlog` | `blogId`, `ipAddress` | 首次计数时 `data === "success"`；8 小时内重复时 `data === null` |
| `addBlog` | POST form `/blog/add` | `Blog` 字段 | 发布后的 `Blog` |
| `updateBlog` | POST form `/blog/update` | `Blog` 字段 | 更新后的 `Blog` |
| `EditBlog.vue` 上传 | multipart POST `/blog/upload` | `file` | `data` 为封面 URL |

`Blog` 字段：`blogId`, `blogTitle`, `blogImg`, `blogType`, `blogDescription`, `blogAuthor`, `blogContent`, `blogTime`, `blogLike`, `blogViews`, `isTop`, `blogHide`, `gmtModified`。

### 评论

| 前端函数 | 方法与路径 | 输入 | 使用的输出 |
| --- | --- | --- | --- |
| `fetchCommentByBlogId` | GET `/comment/getCommentByBlogId` | `blogId` | 一级评论数组 |
| `fetchChildCommentByCommentId` | GET `/comment/getCommentByCommentId` | `commentId` | 该一级评论下的回复数组 |
| `postComment` | POST form `/comment/addComment` | `commentTarget`, `commentTargetId`, `commentUserId`, `commentContent` | 创建后的 `Comment` |
| `deleteExistComment` | POST form `/comment/deleteComment` | 至少传入现有评论对象中的 `commentId`, `commentUserId` | 仅判断成功 |

`commentTarget === 1` 表示文章评论，`commentTargetId` 是文章 ID；`commentTarget === 2` 表示回复，`commentTargetId` 是一级评论 ID。`commentUserId === "-1"` 表示匿名展示，但发布动作仍需登录。后端会为非匿名评论用 token 中的登录用户 ID 覆盖提交值。

### 友链、音乐和照片

| 前端函数/位置 | 方法与路径 | 输入 | 使用的输出 |
| --- | --- | --- | --- |
| `fetchFriendLinkList` | GET `/friendLink/getFriendLinkList` | 无 | `FriendLink[]` |
| `addFriendLink` | POST form `/friendLink/addFriendLink` | `linkName`, `linkUrl` | 创建后的 `FriendLink` |
| `fetchMusicList` | GET `/music/queryAll` | 无 | APlayer 直接消费的 `Music[]` |
| `fetchPhotoList` | GET `/photo/queryAll` | 无 | `Photo[]` |
| `UploadPhoto.vue` 上传 | multipart POST `/api/photo/upload` | `file`, `imgName`, token header | 成功后跳转；依赖部署层 `/api` 代理 |

`FriendLink` 字段为 `linkId`, `linkName`, `linkUrl`；`Music` 字段为 `musicId`, `name`, `artist`, `url`, `cover`, `lrc`；`Photo` 字段为 `imgId`, `imgName`, `imgSrc`, `imgThumb`。

## 配置中存在但当前 UI 未调用的接口

`urlConfig.ts` 还声明了以下后端能力，但没有对应的当前页面调用链：

- `/user/applyResetPasswordVerifyCode`、`/user/resetPassword`；
- `/comment/getCommentByUserId`、`/comment/getCommentById`、`/comment/updateComment`；
- `/music/add`、`/music/delete`；
- `photoUrl.addPhoto` 指向 `/photo/upload`，但上传页没有使用该配置；
- `blogUrl.uploadCover` 声明为 `/blog/uploadCover`，但上传页直接调用另一路径。

## 权限语义

前端展示的身份值与后端权限映射一致：`0` 为站长，`1` 为管理员，`5` 为普通用户，未登录状态用 `-1`。

- 站长：发布/修改文章、删除任意评论、评论；
- 管理员：删除任意评论、评论；
- 普通用户：评论；
- 评论本人可删除自己的评论。

当前后端未对友链新增、音乐增删、照片/封面上传做显式权限检查。不要把前端是否显示入口误认为安全边界。

## 已知契约偏差

以下条目是当前实现事实，不是供新代码仿照的兼容规则：

1. `UserController.setPhone/setMail` 接收参数名 `userID`，而 `UserCenter.vue` 发送 `userId`；当前字段名不一致。
2. 重置密码验证码接口检查 `verifyCode_reset:<account>`，却把验证码写入 `verifyCode:<account>`；随后重置接口只读取前一种 key。
3. `blogUrl.uploadCover` 配置为 `/blog/uploadCover`，实际后端和 `EditBlog.vue` 使用 `/blog/upload`。
4. 照片上传页使用 `https://www.peteralbus.com/api/photo/upload`，其余 API 基地址是 `https://www.peteralbus.com:8089/`；本地 Vite 配置没有 `/api` 代理。
5. 后端 `/comment/getCommentByUserId` 的实现按 `comment_target_id` 过滤，而不是按 `comment_user_id`；当前前端未调用它。
6. 多个写操作使用 GET 或不限制 HTTP 方法；这是现有 controller 与调用方的实际契约，不应由单端“规范化”。
7. 后端仓库提供的 `SmsUtil.java.example` 在成功时返回 `smsSendSuccess`，而验证码 controller 判断的是 `sendSmsSuccess`；照模板原样创建短信实现时，手机验证码调用会被判为失败。

修复任一偏差时，应选择唯一的新契约，直接同时修改前后端及文档，不增加双字段、双路径或旧行为兜底。
