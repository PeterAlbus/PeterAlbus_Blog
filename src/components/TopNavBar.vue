<template>
  <div class="navbar nav" v-if="screenWidth>=768">
    <div class="nav-title">PeterAlbus的博客</div>
    <div style="display: flex">
      <div class="nav-avatar">
        <router-link to="/login" style="line-height: 0">
          <el-avatar class="avatar-img"
                     :size="35"
                     :src="userStore.userAvatar"
          />
        </router-link>
        <div class="user-info">
          <h4 style="padding: 4px">{{ userStore.userUsername }}</h4>
          <p style="padding: 4px">
            <el-tag
              :type="identityType"
              effect="dark"
            >
              {{ userIdentity }}
            </el-tag>
          </p>
          <div class="operations" v-if="userStore.userId===''">
            <el-divider />
            <div class="operation" @click="toLink('/login')">
              <el-icon style="vertical-align: -15%">
                <Lollipop />
              </el-icon>
              登录
            </div>
            <div class="operation" @click="toLink('/register')">
              <el-icon style="vertical-align: -15%">
                <Tickets />
              </el-icon>
              注册
            </div>
          </div>
          <div class="operations" v-if="userStore.userId!==''">
            <el-divider />
            <div class="operation" @click="toLink('/userCenter')">
              <el-icon style="vertical-align: -15%">
                <Avatar />
              </el-icon>
              个人中心
            </div>
            <div class="operation" @click="showMessageBox = true;newMessageCount = 0;">
              <el-icon style="vertical-align: -15%">
                <Message />
              </el-icon>
              消息<span v-if="newMessageCount" class="count_tip"> {{newMessageCount}} </span>
            </div>
            <div class="operation">
              <el-icon style="vertical-align: -15%">
                <Setting />
              </el-icon>
              设置
            </div>
            <el-divider />
            <div class="operation" @click="logout">
              <el-icon style="vertical-align: -10%">
                <Close />
              </el-icon>
              退出登录
            </div>
          </div>
        </div>
      </div>
      <div class="nav-item" v-for="item in navItems" :key="item.name">
        <router-link :to="item.indexPath" active-class="active-top-item">
          <el-icon style="vertical-align: -10%">
            <component :is="item.iconName" />
          </el-icon>
          {{ item.name }}
        </router-link>
      </div>
    </div>
  </div>
  <div class="navbar-bottom" v-if="screenWidth<768">
    <el-row class="navbar-bottom-list" justify="space-between">
      <el-col :span="Math.floor(24/(navItems.length+1))"
              class="navbar-bottom-item"
              v-for="item in navItems" :key="item.name">
        <router-link :to="item.indexPath" active-class="active-item">
          <p>
            <el-icon>
              <component :is="item.iconName" />
            </el-icon>
          </p>
          <span class="navbar-bottom-text">{{ item.name }}</span>
        </router-link>
      </el-col>
      <el-col :span="Math.floor(24/(navItems.length+1))" class="navbar-bottom-item">
        <router-link to="/login">
          <p>
            <el-avatar
              :size="16"
              :src="userStore.userAvatar"
            />
          </p>
          <span class="navbar-bottom-text">个人中心</span>
        </router-link>
      </el-col>
    </el-row>
  </div>
  <MessageBox v-model="showMessageBox"/>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useUserStore } from "@/stores/user";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { logoutUser } from "@/services/userApi";
import MessageBox from "@/components/MessageBox.vue";
import { unreadMessageCount } from "@/services/messageApi";

const router = useRouter();
const userStore = useUserStore();
const showMessageBox = ref(false);
const newMessageCount = ref(0);

router.beforeEach((to, from, next) => {
  showMessageBox.value = false;
  getNewMessageCount();
  next();
});

const screenWidth = ref(document.body.clientWidth);
const navItems = [{ name: "主页", indexPath: "/", iconName: "HomeFilled" },
  { name: "分类", indexPath: "/types", iconName: "Menu" },
  { name: "关于我", indexPath: "/about", iconName: "UserFilled" },
  { name: "照片墙", indexPath: "/photo", iconName: "PictureFilled" }];

const resize = function() {
  screenWidth.value = document.body.clientWidth;
};

const getNewMessageCount = () => {
  unreadMessageCount().then((res) => {
    newMessageCount.value = res.data;
  });
};

const logout = () => {
  logoutUser().then(() => {
    ElMessage.success("登出成功");
    localStorage.removeItem("token");
    userStore.logout();
    router.push("/");
  });
};

const toLink = (path: any) => {
  router.push(path);
};

const identityType = computed(() => {
  if (userStore.userIdentity == 0) {
    return "warning";
  } else if (userStore.userIdentity == 1) {
    return "success";
  } else if (userStore.userIdentity == 5) {
    return "";
  } else {
    return "info";
  }
});

const userIdentity = computed(() => {
  if (userStore.userIdentity == 0) {
    return "站长";
  } else if (userStore.userIdentity == 1) {
    return "管理员";
  } else if (userStore.userIdentity == 5) {
    return "普通用户";
  } else {
    return "游客";
  }
});

onMounted(() => {
  window.addEventListener("resize", resize);
});
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  z-index: 99; /* 层叠顺序，数值越大就越高。页面滚动的时候就不会被其他内容所遮挡。 */
}

.navbar-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 99; /* 层叠顺序，数值越大就越高。页面滚动的时候就不会被其他内容所遮挡。 */

  background-color: #ffffff;
  box-shadow: 0 -1px 12px hsla(174, 63%, 15%, 0.15);
  width: 100%;
  height: 4rem;
  padding: 0;
  display: grid;
  align-content: center;

  transition: .4s;;
}

.navbar-bottom-list a {
  color: #326139;
}

.navbar-bottom-item {
  display: inline-block;
  text-align: center;
}

.navbar-bottom-icon {
  font-size: large;
}

.navbar-bottom-text {
  font-size: small;
}

.active-item {
  position: relative;
  color: #60638E !important;
  transition: .3s;
}

.active-top-item {
  position: relative;
  color: #82A96D !important;
  transition: .3s;
}

.nav {
  background: rgba(0, 0, 0, 0.5) !important;
  box-shadow: 3px 3px 6px 3px rgba(0, 0, 0, .3);
}

.nav-avatar {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 0;
  background: rgba(0, 0, 0, 0) !important;
}

.avatar-img {
  transform-origin: right top;
  transition-property: transform;
  transition-duration: 0.3s;
  transition-timing-function: ease;
}

.nav-avatar:hover .avatar-img {
  transform: scale(1.8);
}

.nav-avatar:hover .user-info {
  opacity: 1;
  transform: scale(1) translateX(-14px);
}

.user-info {
  opacity: 0;
  position: fixed;
  top: 60px;
  width: 200px;

  background-color: white;
  border-radius: 5px;
  box-shadow: 0 3px 8px 6px rgba(7, 17, 27, 0.05);
  padding: 15px;
  transform-origin: top;
  transform: scale(0.3) translateY(-20px);
  transition-property: opacity, transform;
  transition-duration: 0.3s;
  transition-timing-function: ease;
  z-index: -1;
}

.nav-item {
  height: 100%;
  line-height: 60px;
  padding: 0 30px 0 30px;
  background: rgba(0, 0, 0, 0) !important;
}

.nav-item a {
  color: white;
}

.nav-menu {
  color: black !important;
}

.nav-title {
  height: 100%;
  margin: 0;
  color: white;
  line-height: 60px;
  z-index: 100;
  font-size: large;
  background: rgba(0, 0, 0, 0) !important;
}

.nav-item:focus, .nav-item:hover a {
  outline: 0 !important;
  color: #82A96D !important;
  background: none !important;
}

.operations {
  width: 100%;
}

.operations a {
  color: #2E3E4F;
}

.operations a:hover {
  color: #82A96D;
}

.operation {
  text-align: left;
  border-radius: 5px;
  padding: 5px;
  cursor: pointer;
}

.operation:hover {
  background-color: #F1F1F1;
  color: #63a35c;
}

.count_tip {
  background-color: #ff4d4f;
  color: white;
  padding: 0 5px;
  border-radius: 40%;
  font-size: 12px;
  margin-left: 5px;
}
</style>
