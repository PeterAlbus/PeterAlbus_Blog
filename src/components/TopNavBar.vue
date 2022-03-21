<template>
  <div class="navbar nav" v-if="screenWidth>=640">
    <div class="nav-title">PeterAlbus的博客</div>
    <div style="display: flex">
      <div class="nav-item" v-for="item in navItems">
        <router-link :to="item.indexPath" active-class="active-top-item">
          <el-icon style="vertical-align: -10%">
            <component :is="item.iconName"/>
          </el-icon>
          {{ item.name }}
        </router-link>
      </div>
    </div>
  </div>
  <div class="navbar-bottom" v-if="screenWidth<640">
    <el-row class="navbar-bottom-list">
      <el-col :span="24/navItems.length" class="navbar-bottom-item" v-for="item in navItems">
        <router-link :to="item.indexPath" active-class="active-item">
          <p>
            <el-icon>
              <component :is="item.iconName"/>
            </el-icon>
          </p>
          <span class="navbar-bottom-text">{{ item.name }}</span>
        </router-link>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import {HomeFilled, Menu, UserFilled, PictureFilled} from "@element-plus/icons-vue";

let screenWidth = ref(document.body.clientWidth)
let navItems = [{name: "主页", indexPath: "/", iconName: HomeFilled},
  {name: "分类", indexPath: "/types", iconName: Menu},
  {name: "关于我", indexPath: "/about", iconName: UserFilled},
  {name: "照片墙", indexPath: "/photo", iconName: PictureFilled}]

const resize = function () {
  screenWidth.value = document.body.clientWidth
}

onMounted(() => {
  window.addEventListener('resize', resize)
})
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
</style>
