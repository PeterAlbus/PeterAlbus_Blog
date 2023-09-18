import { createRouter, createWebHashHistory } from "vue-router";
import Nprogress from "nprogress";
import { useUserStore } from "@/stores/user";
import { isLogin } from "@/services/userApi";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../views/Home.vue"),
      meta: {
        title: "主页——PeterAlbus的博客",
        content: {
          keywords: "PeterAlbus,Vue,个人博客",
          description: "PeterAlbus的博客主页"
        }
      }
    },
    {
      path: "/login",
      name: "Login",
      component: () => import("../views/user/Login.vue"),
      meta: {
        title: "登录——PeterAlbus的博客",
        content: {
          keywords: "PeterAlbus,Vue",
          description: "PeterAlbus的博客登录页"
        }
      }
    },
    {
      path: "/register",
      name: "Register",
      component: () => import("../views/user/Register.vue"),
      meta: {
        title: "注册——PeterAlbus的博客",
        content: {
          keywords: "PeterAlbus,Vue",
          description: "PeterAlbus的博客注册页"
        }
      }
    },
    {
      path: "/userCenter",
      name: "UserCenter",
      component: () => import("../views/user/UserCenter.vue"),
      meta: {
        title: "用户中心——PeterAlbus的博客",
        content: {
          keywords: "PeterAlbus,Vue",
          description: "PeterAlbus的博客用户中心"
        }
      }
    },
    {
      path: "/blog",
      name: "Blog",
      component: () => import("../views/blog/Blog.vue"),
      meta: {
        title: "博文——PeterAlbus的博客",
        content: {
          keywords: "PeterAlbus,Vue",
          description: "PeterAlbus的博客博文页"
        }
      }
    },
    {
      path: "/about",
      name: "About",
      component: () => import("../views/blog/About.vue"),
      meta: {
        title: "关于我——PeterAlbus的博客",
        content: {
          keywords: "PeterAlbus,Vue",
          description: "PeterAlbus的个人介绍"
        }
      }
    },
    {
      path: "/document",
      name: "Document",
      component: () => import("../views/blog/Document.vue"),
      meta: {
        title: "归档——PeterAlbus的博客",
        content: {
          keywords: "PeterAlbus,Vue",
          description: "PeterAlbus的博客归档页"
        }
      }
    },
    {
      path: "/photo",
      name: "Photo",
      component: () => import("../views/photo/Photo.vue"),
      meta: {
        title: "照片墙——PeterAlbus的博客",
        content: {
          keywords: "PeterAlbus,Vue",
          description: "PeterAlbus的照片墙"
        }
      }
    },
    {
      path: "/types",
      name: "Types",
      component: () => import("../views/blog/Types.vue"),
      meta: {
        title: "分类查看——PeterAlbus的博客",
        content: {
          keywords: "PeterAlbus,Vue",
          description: "PeterAlbus的博客列表"
        }
      }
    },
    {
      path: "/editBlog",
      name: "EditBlog",
      component: () => import("../views/blog/EditBlog.vue"),
      meta: {
        title: "编辑/创建博客——PeterAlbus的博客",
        content: {
          keywords: "PeterAlbus,Vue",
          description: "PeterAlbus的博客编辑页"
        }
      }
    },
    {
      path: "/uploadPhoto",
      name: "UploadPhoto",
      component: () => import("../views/photo/UploadPhoto.vue"),
      meta: {
        title: "上传照片——PeterAlbus的博客",
        content: {
          keywords: "PeterAlbus,Vue",
          description: "PeterAlbus的博客"
        }
      }
    },
    {
      path: "/addFriendLink",
      name: "AddFriendLink",
      component: () => import("../views/user/AddFriendLink.vue"),
      meta: {
        title: "添加友情链接——PeterAlbus的博客",
        content: {
          keywords: "PeterAlbus,Vue,个人博客",
          description: "PeterAlbus的博客"
        }
      }
    },
    {
      path: "/resetPassword",
      name: "ResetPassword",
      component: () => import("../views/user/ResetPassword.vue"),
      meta: {
        title: "重置密码——PeterAlbus的博客",
        content: {
          keywords: "PeterAlbus,Vue,个人博客",
          description: "PeterAlbus的博客"
        }
      }
    }
  ]
});

router.beforeEach((to, from, next) => {
  Nprogress.start();
  const userStore = useUserStore();
  if (userStore.userId === "" && localStorage.getItem("token")) {
    isLogin().then(res => {
      userStore.updateUser(res.data);
    }).catch(err => {
      console.log(err);
      localStorage.removeItem("token");
    });
  } else if (userStore.userId != "" && !localStorage.getItem("token")) {
    userStore.logout();
  } else if (userStore.userId != "" && localStorage.getItem("token")) {
    isLogin().then(res => {
      userStore.updateUser(res.data);
    }).catch(() => {
      userStore.logout();
    });
  }
  if ((to.name == "Login" || to.name == "Register") && userStore.userId != "") {
    next("/userCenter");
    return;
  }
  if (to.meta.content) {
    const content = to.meta.content as any;
    document.querySelector("meta[name=\"keywords\"]")?.setAttribute("content", content.keywords);
    document.querySelector("meta[name=\"description\"]")?.setAttribute("content", content.description);
  }
  if (to.meta.title) {
    document.title = to.meta.title as string;
  }
  next();
});

router.afterEach(to => {
  Nprogress.done();
});

export default router;
