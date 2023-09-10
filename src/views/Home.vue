<template>
  <div class="home-banner" :style="{background:'url('+backgrounds[randomIndex]+') fixed center center',backgroundSize:'cover',OBackgroundSize:'cover',MozBackgroundSize:'cover'}">
    <div class="banner-container">
      <div>
        <el-avatar :size="150" src="https://file.peteralbus.com/assets/blog/imgs/blog_avatar.png"></el-avatar>
        <h2>欢迎来到PeterAlbus的个人博客</h2>
        <div @mouseout="showFrom=false" @mouseover="showFrom=true" style="height: 30px;color:#ccccd6;font-size: 0.8em;">
          <p
              @click="copyQuotes"
              @contextmenu.prevent="getQuotes"
              style='cursor: pointer'>「{{famousQuotes.hitokoto}}」</p>
          <span v-show="showFrom">——{{famousQuotes.from}}</span>
          <br>
        </div>
        <el-tooltip class="item" effect="dark" content="发送电子邮件" placement="top">
          <a href="mailto:wuhongdb@163.com">
            <i class="fa fa-fw fa-envelope" style="font-size:37px"></i>
          </a>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="github" placement="top">
          <a href="https://github.com/PeterAlbus" target="_blank">
            <i class="fa fa-fw fa-github" style="font-size:40px"></i>
          </a>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="bilibili" placement="top">
          <a href="https://space.bilibili.com/2003822" target="_blank">
            <i class="iconfont icon-bilibili-line" style="font-size:40px"></i>
          </a>
        </el-tooltip>
      </div>
    </div>
  </div>
  <el-row class="main-container">
    <el-col :lg="{span:11,offset:3}" :sm="15">
      <div class="module">
        <h2 class="title">置顶博文</h2>
        <el-card class="content" v-for="item in topBlogs" :key="item.blogId" shadow="hover" :body-style="{ padding: '0px' }">
          <el-row style="height: 170px">
            <el-col :span="8">
              <el-image :src="item.blogImg" fit="cover" class="blog-cover"></el-image>
            </el-col>
            <el-col :span="16">
              <div class="blog-description">
                <router-link :to="{ path: '/blog',query:{id:item.blogId}}">
                  <h4>{{ item.blogTitle }}&emsp;<el-tag size="small">{{ getType(item.blogType) }}</el-tag>
                  </h4>
                </router-link>
                <p style="height: 110px">{{ item.blogDescription }}</p>
                <p class="info">
                  <span type="info"><el-icon style="vertical-align: -10%"><Avatar /></el-icon>{{ item.blogAuthor }}</span>
                  <span type="info"><el-icon style="vertical-align: -10%"><Clock /></el-icon>{{ item.blogTime }}</span>
                  <span type="info"><el-icon style="vertical-align: -10%"><StarFilled /></el-icon>{{ item.blogLike }}</span>
                </p>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </div>

      <div class="module">
        <h2 class="title">最新发布<span style="float:right;"><router-link to="/types">查看全部>></router-link></span></h2>
        <el-card class="content" v-for="item in recentBlogs" :key="item.blogId" shadow="hover" :body-style="{ padding: '0px' }">
          <el-row style="height: 170px">
            <el-col :span="8">
              <el-image :src="item.blogImg" fit="cover" class="blog-cover"></el-image>
            </el-col>
            <el-col :span="16">
              <div class="blog-description">
                <router-link :to="{ path: '/blog',query:{id:item.blogId}}">
                  <h4 style="height: 40px"><span style="white-space: nowrap">{{ item.blogTitle }}&emsp;</span>
                    <el-tag size="small">{{ getType(item.blogType) }}</el-tag>
                  </h4>
                </router-link>
                <p style="height: 90px;overflow: hidden">{{ item.blogDescription }}</p>
                <p class="info">
                  <span type="info"><el-icon style="vertical-align: -10%"><Avatar /></el-icon>{{ item.blogAuthor }}</span>
                  <span type="info"><el-icon style="vertical-align: -10%"><Clock /></el-icon>{{ item.blogTime }}</span>
                  <span type="info"><el-icon style="vertical-align: -10%"><StarFilled /></el-icon>{{ item.blogLike }}</span>
                </p>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </div>
    </el-col>
    <el-col :lg="{span:6}" :sm="9">
      <div class="sticky-box">
        <PersonalInfo></PersonalInfo>
        <FriendLinks></FriendLinks>
      </div>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import { toClipboard } from '@soerenmartius/vue3-clipboard'
import axios from "axios";
import {ElMessage} from "element-plus";
import FriendLinks from "@/components/FriendLinks.vue"
import PersonalInfo from "@/components/PersonalInfo.vue"
import { fetchBlogList } from "@/services/blogApi";

const blogList = ref([
  {
    blogId: 1,
    blogTitle: '稍等，数据请求中',
    blogImg: 'https://file.peteralbus.com/assets/blog/imgs/cover/cover1.jpg',
    blogType: 1,
    blogDescription: '如果长时间仍显示本文字，请检查网络或联系PeterAlbus',
    blogAuthor: 'PeterAlbus',
    blogContent: '',
    blogTime: '2021-7-19',
    blogLike: 999,
    blogViews: 999,
    isTop: 1
  }
])

const famousQuotes= ref({
  id: 0,
  uuid: "",
  hitokoto: "",
  type: "",
  from: "",
  from_who: null,
  creator: "",
  creator_uid: 0,
  reviewer: 0,
  commit_from: "",
  created_at: "",
  length: 0
})

const showFrom = ref(false)

const getQuotes= ()=>{
  axios({
    method: "get",
    url: "https://v1.hitokoto.cn/?c=c&c=b&c=a&c=d&encode=json",
  })
      .then(res=>{
        famousQuotes.value=res.data
      })
}

const copyQuotes=()=>{
  toClipboard(famousQuotes.value.hitokoto+"——"+famousQuotes.value.from)
  ElMessage.success("复制成功!点击右键可换一句")
}

const backgrounds=[
    'https://file.peteralbus.com/assets/blog/static/background/background-lumine.jpg',
    'https://file.peteralbus.com/assets/blog/static/background/background-kazuha.jpg',
    'https://file.peteralbus.com/assets/blog/static/background/background-blueeyes.jpg',
    'https://file.peteralbus.com/assets/blog/static/background/background-girl1.jpg',
    'https://file.peteralbus.com/assets/blog/static/background/background-mountain1.jpg',
    'https://file.peteralbus.com/assets/blog/static/background/background-nogamenolife.jpg',
    'https://file.peteralbus.com/assets/blog/static/background/background-ai1.jpg',
    'https://file.peteralbus.com/assets/blog/static/background/background-ai2.jpg',
]

const randomIndex=Math.floor(Math.random()*backgrounds.length)
// const randomIndex=4

const getBlogList=function () {
  fetchBlogList().then(res=>{
    blogList.value=res.data
  })
}

onMounted(()=>{
  getBlogList()
  getQuotes()
})

const topBlogs=computed(()=>{
  const topBlogs = [];
  for (const i of blogList.value) {
    if (i.isTop == 1) {
      topBlogs.push(i);
    }
  }
  return topBlogs.reverse();
})

const recentBlogs = computed (function () {
  const recentBlogs = blogList.value.reverse();
  return recentBlogs.slice(0, 10);
})

const getType = computed(function () {
  return function (type: number) {
    const types = ['学习笔记', '生活', 'ACG', '科技', '随笔']
    return types[type - 1];
  }
})


</script>

<style scoped>
.home-banner {
  position: relative;
  top: 0;
  left: 0;
  right: 0;
  height: 100vh;

  text-align: center;
  color: #fff !important;
  animation: header-effect 1s !important;
}

.banner-container {
  position: absolute;
  width: 100%;
  padding-top: 20px;
  margin-top: 33vh;
  line-height: 1.5;
  color: #eee;
  background: rgba(34, 44, 63, 0.5) !important;
  box-shadow: 3px 3px 6px 3px rgba(0, 0, 0, .3);
}

.banner-container a {
  color: white;
}

.banner-container a:hover {
  color: black;
}

@keyframes header-effect {
  0% {
    opacity: 0;
    filter: alpha(opacity=0);
    transform: translateY(-50px);
  }
  100% {
    opacity: 1;
    filter: none;
    transform: translateY(0);
  }
}
</style>
