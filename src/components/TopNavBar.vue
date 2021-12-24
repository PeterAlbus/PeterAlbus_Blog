<template>
  <div class="navbar">
    <el-menu active-text-color="#4B6186" text-color="#FFFFFF" id="navid" class="nav" mode="horizontal" :router="true">
      <div class="title">PeterAlbus的博客</div>
      <!--大屏幕导航栏-->
      <el-menu-item
          v-if="screenWidth>=600"
          class="nav-item"
          style="float: right"
          route="/photo"
          index="5"
      ><i class="el-icon-picture-outline"></i>照片墙</el-menu-item>
      <el-menu-item
          v-if="screenWidth>=600"
          class="nav-item"
          style="float: right"
          route="/about"
          index="4"
      ><i class="el-icon-user"></i>关于我</el-menu-item>
      <el-menu-item
          v-if="screenWidth>=600"
          class="nav-item"
          style="float: right"
          route="/types"
          index="2"
      ><i class="el-icon-menu"></i>分类</el-menu-item>
      <el-menu-item
          v-if="screenWidth>=600"
          class="nav-item"
          style="float: right"
          route="/"
          index="1"
      ><i class="el-icon-s-home"></i>主页</el-menu-item>
      <!--小屏幕导航栏-->
      <el-submenu
          class="nav-item"
          v-if="screenWidth<600"
          index="10"
          style="float: right"
          popper-class="submenu"
      >
        <template #title>
          <i class="el-icon-s-fold" style="font-size:28px;color:#ffffff;"></i>
        </template>
        <el-menu-item
            class="nav-menu"
            route="/photo"
            index="5"
        ><i class="el-icon-picture-outline"></i>照片墙</el-menu-item>
        <el-menu-item
            class="nav-menu"
            route="/about"
            index="4"
        ><i class="el-icon-user"></i>关于我</el-menu-item>
        <el-menu-item
            class="nav-menu"
            route="/types"
            index="2"
        ><i class="el-icon-menu"></i>分类</el-menu-item>
        <el-menu-item
            class="nav-menu"
            route="/"
            index="1"
        ><i class="el-icon-s-home"></i>主页</el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: "TopNavBar",
  created () {
  },
  mounted () {
    window.addEventListener('scroll', this.scroll)
    window.onresize = () => {this.screenWidth = document.body.clientWidth}
  },
  data () {
    return {
      screenWidth: document.body.clientWidth,
      navItems: [
        { name: "关于", indexPath: "/more", index: "4" },
        { name: "归档", indexPath: "/about", index: "3" },
        { name: "分类", indexPath: "/subscribe", index: "2"},
        { name: "主页", indexPath: "/", index: "1" }
      ]
    }
  },
  methods: {
    scroll () {
      const that = this
      // const scrollTop =
      //     window.pageYOffset ||
      //     document.documentElement.scrollTop ||
      //     document.body.scrollTop
      that.scrollTop = window.pageYOffset ||
          document.documentElement.scrollTop ||
          document.body.scrollTop
      if (that.scrollTop > 60) {
        that.navClass = 'nav-fixed'
      } else {
        that.navClass = 'nav'
      }
    },
  },
  computed:{
    leftNavItems: function() {
      return this.screenWidth >= 600 ? this.navItems : {};
    },
    rightNavItems: function() {
      return this.screenWidth < 600 ? this.navItems : {};
    }
  }
}
</script>

<style scoped>
.navbar{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height:10px; /* 高度 */
  z-index:99; /* 层叠顺序，数值越大就越高。页面滚动的时候就不会被其他内容所遮挡。 */
}
.nav{
  background: rgba(0, 0, 0, 0.5) !important;
  box-shadow: 3px 3px 6px 3px rgba(0, 0, 0, .3);
}

.nav-item{
  float: right;
  height: 100%;
  line-height: 50px;
  margin-right: 20px;
  background: rgba(0, 0, 0, 0) !important;
}

.nav-menu{
  color: black !important;
}

.submenu{
  background: rgba(0, 0, 0, 0) !important;
}

.title{
  float: left;
  height: 100%;
  left: 30px;
  position: absolute;
  margin: auto;
  color:white;
  line-height: 60px;
}
</style>

<style>
.el-submenu__title:focus, .el-submenu__title:hover{
  outline: 0 !important;
  color: #ffffff !important;
  background: none !important;
}
</style>
