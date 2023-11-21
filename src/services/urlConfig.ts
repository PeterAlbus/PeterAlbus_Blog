const env:string=import.meta.env.VITE_APP_ENV

export const BASE_URL:string|undefined = {
    dev: "http://localhost:8089/",
    prod: "https://www.peteralbus.com:8089/",
    test: "https://api.testserver.com/base/url",
}[env]

// const FILE_BASE_URL:string|undefined = {
//     dev: "https://file.devserver.com/templete/",
//     prod: "https://file.prodserver.com/templete/",
//     test: "https://file.testserver.com/templete/",
// }[env];

export const userUrl:any = {
    mailLogin: "/user/mailLogin",
    phoneLogin: "/user/phoneLogin",
    register: "/user/register",
    isLogin: "/user/isLogin",
    logout: "/user/logout",
    applyMailVerifyCode: "/user/applyMailVerifyCode",
    applyPhoneVerifyCode: "/user/applyPhoneVerifyCode",
    applyResetPasswordVerifyCode: "/user/applyResetPasswordVerifyCode",
    changePassword: "/user/changePassword",
    resetPassword: "/user/resetPassword",
    setPhone: "/user/setPhone",
    setMail: "/user/setMail",
    uploadAvatar: "/user/uploadAvatar",
    changeUsername: "/user/changeUsername",
    getUserById: "/user/getUserById"
}

export const blogUrl:any = {
    getBlogList: "/blog/queryAll",
    getBlogById: "/blog/queryById",
    addBlog: "/blog/add",
    updateBlog: "/blog/update",
    visitBlog: "/blog/visitBlog",
    uploadCover: "/blog/upload",
}

export const commentUrl:any = {
    getCommentByBlogId: "/comment/getCommentByBlogId",
    getChildCommentByCommentId: "/comment/getCommentByCommentId",
    getCommentByUserId: "/comment/getCommentByUserId",
    getCommentById: "/comment/getCommentById",
    addComment: "/comment/addComment",
    updateComment: "/comment/updateComment",
    deleteComment: "/comment/deleteComment"
}

export const friendLinkUrl:any = {
    getFriendLinkList: "/friendLink/getFriendLinkList",
    addFriendLink: "/friendLink/addFriendLink",
}

export const musicUrl:any = {
    getMusicList: "/music/queryAll",
    addMusic: "/music/add",
    deleteMusic: "/music/delete",
}

export const photoUrl:any = {
    getPhotoList: "/photo/queryAll",
    addPhoto: "/photo/upload",
    uploadOriginImg: "/photo/uploadOriginImg",
    deletePhotoByUrl: "/photo/deletePhotoByUrl",
    deletePhotoById: "/photo/deletePhotoById"
}

export const messageUrl:any = {
    getInBoxMessageList: "/message/getInBoxMessage",
    getOutBoxMessageList: "/message/getOutBoxMessage",
    getUnreadMessageCount: "/message/getUnreadMessageCount",
    readMessage: "/message/readMessage"
}
