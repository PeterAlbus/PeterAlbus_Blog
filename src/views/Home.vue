<template>
  <div class="home-banner" :style="backgroundStyle">
    <div class="banner-container">
      <div>
        <el-avatar :size="150" src="https://file.peteralbus.com/assets/blog/imgs/blog_avatar.png"></el-avatar>
        <h2>欢迎来到PeterAlbus的个人博客</h2>
        <div class="banner-quote" @mouseout="showFrom=false" @mouseover="showFrom=true">
          <p
              @click="copyQuotes"
              @contextmenu.prevent="getQuotes"
              >「{{famousQuotes.hitokoto}}」</p>
          <span class="quote-source" v-show="showFrom">——{{famousQuotes.from}}</span>
        </div>
        <div class="social-links">
          <el-tooltip class="item" effect="dark" content="发送电子邮件" placement="top">
            <a href="mailto:wuhongdb@163.com" aria-label="发送电子邮件">
              <i class="fa fa-fw fa-envelope"></i>
            </a>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="github" placement="top">
            <a href="https://github.com/PeterAlbus" target="_blank" aria-label="GitHub">
              <i class="fa fa-fw fa-github"></i>
            </a>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="bilibili" placement="top">
            <a href="https://space.bilibili.com/2003822" target="_blank" aria-label="哔哩哔哩">
              <i class="iconfont icon-bilibili-line"></i>
            </a>
          </el-tooltip>
        </div>
      </div>
    </div>
  </div>
  <router-link
    v-if="isSiteOwner"
    class="owner-create-fab"
    to="/editBlog"
    aria-label="新建文章"
  >
    <el-icon><EditPen /></el-icon>
    <span>新建文章</span>
  </router-link>
  <el-row class="main-container">
    <el-col :lg="{span:11,offset:3}" :sm="15">
      <div class="module">
        <h2 class="title">置顶博文</h2>
        <el-card class="content" v-for="item in topBlogs" :key="item.blogId" shadow="hover" :body-style="{ padding: '0px' }">
          <el-row class="blog-card-row">
            <el-col :span="8">
              <el-image :src="item.blogImg" fit="cover" class="blog-cover"></el-image>
            </el-col>
            <el-col :span="16">
              <div class="blog-description">
                <router-link :to="{ path: '/blog',query:{id:item.blogId}}">
                  <h4 class="blog-title-row"><span class="blog-title-text">{{ item.blogTitle }}</span><el-tag class="blog-title-tag" size="small">{{ getType(item.blogType) }}</el-tag>
                  </h4>
                </router-link>
                <p class="blog-summary">{{ item.blogDescription }}</p>
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
        <h2 class="title">
          最新发布
          <span><router-link class="view-all-link" to="/types">查看全部&gt;&gt;</router-link></span>
        </h2>
        <el-card class="content" v-for="item in recentBlogs" :key="item.blogId" shadow="hover" :body-style="{ padding: '0px' }">
          <el-row class="blog-card-row">
            <el-col :span="8">
              <el-image :src="item.blogImg" fit="cover" class="blog-cover"></el-image>
            </el-col>
            <el-col :span="16">
              <div class="blog-description">
                <router-link :to="{ path: '/blog',query:{id:item.blogId}}">
                  <h4 class="blog-title-row"><span class="blog-title-text">{{ item.blogTitle }}</span>
                    <el-tag class="blog-title-tag" size="small">{{ getType(item.blogType) }}</el-tag>
                  </h4>
                </router-link>
                <p class="blog-summary">{{ item.blogDescription }}</p>
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
import { fetchBackgroundList } from "@/services/backgroundApi";
import type { HttpResult } from "@/services/httpConfig";
import { EditPen } from "@element-plus/icons-vue";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();
const isSiteOwner = computed(() => userStore.userIdentity === 0);

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

const backgrounds=ref([
  {
    url:'',
    description:'无'
  }
])

const getBackgrounds = () => {
  fetchBackgroundList().then((res:HttpResult) => {
    backgrounds.value = []
    res.data.map((item: any) => {
      if (item.isShow) {
        backgrounds.value.push({
          url: item.backgroundUrl,
          description: item.description
        })
      }
    })
    randomIndex.value=Math.floor(Math.random()*backgrounds.value.length)
  })
}

const backgroundStyle = computed(() => {
  return {
    backgroundImage: `url(${backgrounds.value[randomIndex.value].url})`,
    backgroundSize: 'cover',
    OBackgroundSize: 'cover',
    MozBackgroundSize: 'cover'
  }
})

const randomIndex=ref(Math.floor(Math.random()*backgrounds.value.length))
// const randomIndex=4

const getBlogList=function () {
  fetchBlogList().then(res=>{
    blogList.value=res.data
  })
}

onMounted(()=>{
  getBackgrounds()
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
  const blogListCopy = blogList.value;
  const recentBlogs = blogListCopy.reverse();
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
  min-height: 620px;
  overflow: hidden;
  text-align: center;
  color: #fff !important;
  animation: header-effect 800ms !important;
}

.home-banner::before {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(8, 18, 12, 0.2) 0%, rgba(8, 18, 12, 0.1) 45%, rgba(8, 18, 12, 0.46) 100%),
    radial-gradient(circle at center, transparent 10%, rgba(8, 18, 12, 0.18) 100%);
  content: "";
}

.banner-container {
  position: absolute;
  top: 50%;
  left: 50%;
  width: min(680px, calc(100% - 40px));
  padding: 32px 28px 26px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.88);
  background: rgba(23, 39, 29, 0.46) !important;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 28px;
  box-shadow: 0 22px 65px rgba(0, 0, 0, 0.24);
  backdrop-filter: blur(14px) saturate(1.12);
  transform: translate(-50%, -46%);
}

.banner-container h2 {
  margin: 15px 0 12px;
  color: #fff;
  font-size: clamp(22px, 3vw, 30px);
  font-weight: 650;
  letter-spacing: 0.04em;
  text-shadow: 0 4px 18px rgba(0, 0, 0, 0.2);
}

.banner-container :deep(.el-avatar) {
  border: 4px solid rgba(255, 255, 255, 0.82);
  box-shadow: 0 12px 34px rgba(0, 0, 0, 0.25);
}

.banner-quote {
  position: relative;
  min-height: 44px;
  color: rgba(231, 235, 238, 0.76);
  font-size: 12px;
}

.banner-quote p {
  margin: 0;
  overflow: hidden;
  cursor: pointer;
  line-height: 22px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.quote-source {
  display: block;
  margin-top: 2px;
  color: rgba(231, 235, 238, 0.62);
  line-height: 18px;
}

.social-links {
  display: flex;
  min-height: 48px;
  margin-top: 14px;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.social-links a {
  display: flex;
  width: 46px;
  height: 46px;
  margin: 0;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  color: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 50%;
  transition: color var(--transition-fast), background-color var(--transition-fast), transform var(--transition-fast);
}

.social-links a:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.14);
  transform: translateY(-2px);
}

.social-links i {
  display: flex !important;
  width: 28px !important;
  height: 28px;
  margin: 0 !important;
  align-items: center;
  justify-content: center;
  font-size: 27px !important;
  line-height: 1 !important;
  vertical-align: 0 !important;
}

.social-links i::before {
  line-height: 1;
}

.main-container > :deep(.el-col) {
  min-width: 0;
}

.module .content + .content {
  margin-top: 14px;
}

.owner-create-fab {
  position: fixed;
  right: clamp(24px, 3vw, 48px);
  bottom: 96px;
  z-index: 30;
  display: flex;
  min-width: 128px;
  height: 48px;
  padding: 0 18px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #fff !important;
  background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700));
  border: 1px solid rgba(255, 255, 255, 0.32);
  border-radius: 16px;
  box-shadow: 0 14px 34px rgba(37, 79, 43, 0.24), 0 4px 10px rgba(37, 79, 43, 0.12);
  font-size: 14px;
  font-weight: 650;
  letter-spacing: 0.03em;
  transition: box-shadow var(--transition-fast), transform var(--transition-fast);
}

.owner-create-fab::before {
  position: absolute;
  inset: 4px;
  pointer-events: none;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 12px;
  content: "";
}

.owner-create-fab :deep(.el-icon) {
  font-size: 17px;
}

.owner-create-fab:hover {
  color: #fff;
  box-shadow: 0 18px 40px rgba(37, 79, 43, 0.3), 0 6px 14px rgba(37, 79, 43, 0.16);
  transform: translateY(-3px);
}

.view-all-link:hover {
  color: var(--color-primary-700);
  background: var(--color-primary-50);
  border-color: rgba(71, 125, 75, 0.28);
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

@media (max-width: 767px) {
  .home-banner {
    min-height: 580px;
    height: calc(100vh - 64px);
    background-attachment: scroll !important;
  }

  .banner-container {
    width: calc(100% - 28px);
    padding: 26px 18px 20px;
    border-radius: 22px;
    transform: translate(-50%, -50%);
  }

  .banner-container :deep(.el-avatar) {
    width: 112px !important;
    height: 112px !important;
  }

  .main-container > :deep(.el-col) {
    width: 100%;
    max-width: 100%;
    flex: 0 0 100%;
  }

}

@media (max-width: 1023px) {
  .owner-create-fab {
    display: none;
  }
}
</style>
