<template>
  <div class="navbar nav" v-if="screenWidth>=768">
    <div class="nav-title">PeterAlbus的博客</div>
    <div class="nav-links">
      <div class="nav-avatar">
        <router-link to="/login" class="nav-avatar-link">
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
  height: 64px;
  padding: 0 max(5vw, 32px);
  justify-content: space-between;
  align-items: center;
  z-index: 99;
}

.navbar-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 99;
  background: rgba(255, 255, 255, 0.92);
  border-top: 1px solid rgba(50, 97, 57, 0.12);
  box-shadow: 0 -10px 30px rgba(25, 48, 30, 0.09);
  backdrop-filter: blur(18px) saturate(1.25);
  width: 100%;
  height: 64px;
  padding: 6px 8px max(6px, env(safe-area-inset-bottom));
  display: grid;
  align-content: center;
  transition: var(--transition-normal);
}

.navbar-bottom-list a {
  display: block;
  color: var(--color-primary-700);
}

.navbar-bottom-item {
  display: flex;
  min-height: 48px;
  text-align: center;
  align-items: center;
  justify-content: center;
}

.navbar-bottom-item p {
  height: 20px;
  margin: 0 0 1px;
  line-height: 20px;
}

.navbar-bottom-icon {
  font-size: large;
}

.navbar-bottom-text {
  display: block;
  font-size: 10px;
  font-weight: 550;
  letter-spacing: 0.02em;
}

.active-item {
  position: relative;
  color: #60638e !important;
  transition: var(--transition-fast);
}

.active-item::after {
  position: absolute;
  right: 20%;
  bottom: -5px;
  left: 20%;
  height: 2px;
  border-radius: 99px;
  background: currentColor;
  content: "";
}

.active-top-item {
  position: relative;
  color: #b8d69e !important;
  transition: var(--transition-fast);
}

.active-top-item::after {
  position: absolute;
  right: 0;
  bottom: -9px;
  left: 0;
  height: 2px;
  border-radius: 99px;
  background: currentColor;
  box-shadow: 0 0 10px rgba(184, 214, 158, 0.7);
  content: "";
}

.nav {
  background: rgba(18, 30, 23, 0.72) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 30px rgba(8, 18, 11, 0.16);
  backdrop-filter: blur(18px) saturate(1.2);
}

.nav-avatar {
  position: relative;
  display: flex;
  width: 50px;
  flex: 0 0 50px;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 0;
  background: rgba(0, 0, 0, 0) !important;
}

.nav-avatar-link {
  position: relative;
  z-index: 102;
  display: flex;
  width: 50px;
  height: 64px;
  align-items: center;
  justify-content: center;
  line-height: 0;
}

.avatar-img {
  display: block;
  transform-origin: right top;
  transition: transform 300ms ease, box-shadow 300ms ease;
  will-change: transform;
}

.nav-avatar:hover .avatar-img {
  box-shadow: 0 10px 24px rgba(8, 18, 11, 0.28);
  transform: scale(1.8);
}

.nav-avatar:hover .user-info {
  opacity: 1;
  visibility: visible;
  transform: translate(-50%, 0);
}

.user-info {
  opacity: 0;
  visibility: hidden;
  position: absolute;
  top: 64px;
  left: calc(50% - 14px);
  width: 216px;
  padding: 17px;
  color: var(--color-text);
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  backdrop-filter: blur(18px);
  transform: translate(-50%, -8px);
  transition: opacity var(--transition-normal), transform var(--transition-normal), visibility var(--transition-normal);
  z-index: 101;
}

.nav-links {
  display: flex;
  height: 64px;
  align-items: center;
}

.nav-item {
  height: 64px;
  line-height: 64px;
  padding: 0 clamp(12px, 2vw, 28px);
  background: rgba(0, 0, 0, 0) !important;
}

.nav-item a {
  color: rgba(255, 255, 255, 0.88);
  font-size: 14px;
  font-weight: 550;
  letter-spacing: 0.03em;
}

.nav-menu {
  color: black !important;
}

.nav-title {
  height: 64px;
  margin: 0;
  color: rgba(255, 255, 255, 0.94);
  line-height: 64px;
  z-index: 100;
  font-size: 18px;
  font-weight: 650;
  letter-spacing: 0.05em;
  background: rgba(0, 0, 0, 0) !important;
}

.nav-item:focus, .nav-item:hover a {
  outline: 0 !important;
  color: #b8d69e !important;
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
  border-radius: var(--radius-sm);
  padding: 8px 10px;
  cursor: pointer;
  transition: color var(--transition-fast), background-color var(--transition-fast), transform var(--transition-fast);
}

.operation:hover {
  background: var(--color-primary-50);
  color: var(--color-primary-600);
  transform: translateX(2px);
}

:deep(.el-divider--horizontal) {
  margin: 12px 0;
  border-color: var(--color-border);
}

@media (max-width: 980px) {
  .navbar {
    padding: 0 24px;
  }

  .nav-item {
    padding: 0 12px;
  }
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
