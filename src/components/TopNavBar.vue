<template>
  <div class="navbar nav" v-if="screenWidth>=600">
    <div
        class="nav-title"
        style="font-size: large"
    >PeterAlbus的博客</div>
    <div style="display: flex">
        <div class="nav-item">
          <router-link to="/" active-class="active-top-item">
            <el-icon style="vertical-align: -10%"><home-filled /></el-icon>主页
          </router-link>
        </div>
        <div class="nav-item">
          <router-link to="/types" active-class="active-top-item">
            <el-icon style="vertical-align: -10%"><Menu /></el-icon>分类
          </router-link>
        </div>
        <div class="nav-item">
          <router-link to="/about" active-class="active-top-item">
            <el-icon style="vertical-align: -10%"><user-filled /></el-icon>关于我
          </router-link>
        </div>
        <div class="nav-item">
          <router-link to="/photo" active-class="active-top-item">
            <el-icon style="vertical-align: -10%"><picture-filled /></el-icon>照片墙
          </router-link>
        </div>
    </div>
  </div>
  <div class="navbar-bottom" v-if="screenWidth<600">
    <el-row class="navbar-bottom-list">
      <el-col :span="6" class="navbar-bottom-item">
        <router-link to="/" active-class="active-item">
          <p><el-icon><home-filled /></el-icon></p>
          <span class="navbar-bottom-text">主页</span>
        </router-link>
      </el-col>
      <el-col :span="6" class="navbar-bottom-item">
        <router-link to="/types" active-class="active-item">
          <p><el-icon><grid /></el-icon></p>
          <span class="navbar-bottom-text">分类</span>
        </router-link>
      </el-col>
      <el-col :span="6" class="navbar-bottom-item">
        <router-link to="/about" active-class="active-item">
          <p><el-icon><user-filled /></el-icon></p>
          <span class="navbar-bottom-text">关于我</span>
        </router-link>
      </el-col>
      <el-col :span="6" class="navbar-bottom-item">
        <router-link to="/photo" active-class="active-item">
          <p><el-icon><picture-filled /></el-icon></p>
          <span class="navbar-bottom-text">照片墙</span>
        </router-link>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {HomeFilled,Menu,UserFilled,PictureFilled,Grid} from '@element-plus/icons-vue'
export default {
  name: "TopNavBar",
  components:{
    HomeFilled,Menu,UserFilled,PictureFilled,Grid
  },
  created () {
  },
  mounted () {
    // window.addEventListener('scroll', this.scroll)
    window.addEventListener('resize',this.resize)
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
    resize(){
      this.screenWidth = document.body.clientWidth
    }
  },
  computed:{

  }
}
</script>

<style scoped>
.navbar{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  /*height:10px; !* 高度 *!*/
  display: flex;
  justify-content: space-around;
  z-index:99; /* 层叠顺序，数值越大就越高。页面滚动的时候就不会被其他内容所遮挡。 */
}

.navbar-bottom{
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index:99; /* 层叠顺序，数值越大就越高。页面滚动的时候就不会被其他内容所遮挡。 */

  background-color: #ffffff;
  box-shadow: 0 -1px 12px hsla(174, 63%, 15%, 0.15);
  width: 100%;
  height: 4rem;
  padding: 0;
  display: grid;
  align-content: center;

  transition: .4s;;
}

.navbar-bottom-list a{
  color: #326139;
}

.navbar-bottom-item{
  display: inline-block;
  text-align: center;
}

.navbar-bottom-icon{
  font-size: large;
}

.navbar-bottom-text{
  font-size: small;
}

.active-item{
  position: relative;
  color: #60638E !important;
  transition: .3s;
}

.active-top-item{
  position: relative;
  color: #82A96D !important;
  transition: .3s;
}

.nav{
  background: rgba(0, 0, 0, 0.5) !important;
  box-shadow: 3px 3px 6px 3px rgba(0, 0, 0, .3);
}

.nav-item{
  height: 100%;
  line-height: 60px;
  padding:0 30px 0 30px;
  background: rgba(0, 0, 0, 0) !important;
}

.nav-item a{
  color: white;
}

.nav-menu{
  color: black !important;
}

.submenu{
  background: rgba(0, 0, 0, 0) !important;
}

.nav-title{
  height: 100%;
  margin: 0;
  color:white;
  line-height: 60px;
  z-index: 100;
  font-size: large;
  background: rgba(0, 0, 0, 0) !important;
}
</style>

<style>
.el-submenu__title:focus, .el-submenu__title:hover{
  outline: 0 !important;
  color: #ffffff !important;
  background: none !important;
}
</style>
