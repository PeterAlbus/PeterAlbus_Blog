<template>
  <Banner title="博客详情"></Banner>
  <div class="main-container">
    <el-row>
      <el-col :lg="{span:11,offset:3}" :sm="15">
        <div class="blog-header">
          <div class="blog-heading-row">
            <h1>{{blog.blogTitle}}</h1>
            <el-button
              v-if="isSiteOwner"
              class="owner-content-action"
              type="primary"
              color="#63a35c"
              :icon="EditPen"
              @click="editCurrentBlog"
            >
              编辑文章
            </el-button>
          </div>
          <p><i class="fa fa-user"></i> {{blog.blogAuthor}}&emsp;<i class="fa fa-calendar"></i> 发布于{{blog.blogTime}} <i class="fa fa-eye"></i> {{blog.blogViews}}次访问</p>
        </div>
        <div class="blog-content">
          <mavon-editor v-model="blog.blogContent" ref="mdRef"
                        :boxShadow="false" :subfield="false"
                        defaultOpen="preview" :editable="false"
                        codeStyle="xcode" :toolbarsFlag="false"
                        :toolbars="{}" :shortCut="false"
          />
        </div>
      </el-col>
      <el-col :lg="{span:6}" :sm="9">
        <PersonalInfo></PersonalInfo>
        <div class="sticky-box">
          <div class="module anchors" :class="{'hide-small-screen':hideCatalogue}" v-if="titleList.length!==0">
            <h2 class="title"><el-icon style="vertical-align: -10%"><notebook /></el-icon> 目录</h2>
            <div class="content" style="padding: 10px">
              <el-scrollbar max-height="30vh">
                <div
                    v-for="anchor in titleList" :key="anchor.id"
                    :style="{ padding: `2px 20px 2px ${anchor.indent * 20 + 20}px` }"
                    class="anchor"
                    @click="handleAnchorClick(anchor)"
                >
                  <a style="cursor: pointer"><el-icon class="arrow-icon" style="vertical-align: -15%"><arrow-right /></el-icon> {{ anchor.title }}</a>
                </div>
              </el-scrollbar>
            </div>
          </div>
          <Comment :blogId="blog.blogId as string"></Comment>
          <div class="module share-module">
            <h2 class="title"><el-icon style="vertical-align: -10%"><share-icon /></el-icon> 分享本页面</h2>
            <div class="content paragraph share-panel">
              <Share
                  :url="'https://www.peteralbus.com/#/blog?id='+blog.blogId"
                  :title="blog.blogTitle"
                  source="PeterAlbus的博客"
                  :description="blog.blogDescription"
                  :image="blog.blogImg"
                  :twitter="true"
                  :google="true"
              ></Share>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
  <div class="fixed-buttons hide-big-screen">
    <el-button type="success" :icon="Notebook" circle @click="hideCatalogue=!hideCatalogue" v-if="titleList.length!==0"/>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref ,nextTick } from "vue";
import {useRoute, useRouter} from "vue-router";
import {ArrowRight, EditPen, Notebook, Share as shareIcon} from "@element-plus/icons-vue";
import PersonalInfo from '@/components/PersonalInfo.vue'
import Comment from '@/components/Comment.vue'
import Banner from "@/components/Banner.vue";
import { fetchBlogById, getIpAddress, visitBlog } from "@/services/blogApi";
import { useUserStore } from "@/stores/user";
import VueMavonEditor from "mavon-editor";
import "mavon-editor/dist/css/index.css";
import { Share } from "vue3-social-share";
import "vue3-social-share/lib/index.css";

const MavonEditor = VueMavonEditor.mavonEditor;

const route=useRoute()
const router=useRouter()
const userStore=useUserStore()
const mdRef=ref<any>()
const titleList:any=ref([])

const hideCatalogue=ref(true)
const isSiteOwner = computed(() => userStore.userIdentity === 0)

const blog=ref({
  blogId:route.query.id,
  blogTitle:'稍等，数据正在请求中',
  blogImg:'https://file.peteralbus.com/assets/blog/imgs/cover/cover1.jpg',
  blogType:1,
  blogDescription:'这里显示的是默认数据',
  blogAuthor:'PeterAlbus',
  blogContent:'# 提示\n' +
      '如果很长时间都依旧显示本文字，检查你的互联网是否突然中断，或联系PeterAlbus，他可能忘记开服务器后端了',
  blogTime:'2021-7-19',
  blogLike:18,
  blogViews:200,
  isTop:1
})

const getBlog=()=>{
  if(typeof blog.value.blogId == 'string')
  {
    fetchBlogById(blog.value.blogId).then(res => {
      blog.value = res.data;
      if(!localStorage.getItem('ipAddress')||localStorage.getItem('ipAddress')=='127.0.0.1') {
        getIpAddress().then(res => {
          localStorage.setItem('ipAddress', res.data.ip || '127.0.0.1')
        })
      }
      visitBlog(blog.value.blogId,localStorage.getItem('ipAddress')||'').then((res)=>{
        if(res.data) blog.value.blogViews += 1;
      })
      document.title = blog.value.blogTitle+'——PeterAlbus的博客'
      const meta:any=document.querySelector('meta[name="description"]')
      if(!meta)
      {
        meta.setAttribute('content',blog.value.blogDescription)
      }
      nextTick(getTitles)
    });
  }
}

const getTitles=()=>{
  const anchors=mdRef.value?.$el.querySelectorAll('h1,h2,h3,h4,h5,h6')
  const titles = Array.from(anchors).filter((title:any) => !!title.innerText.trim());
  if (!titles.length) {
    titleList.value = [];
    return;
  }
  const hTags = Array.from(new Set(titles.map((title:any) => title.tagName))).sort();
  titleList.value = titles.map((el:any) => ({
    title: el.innerText,
    id: el.querySelectorAll('a')[0].id,
    indent: hTags.indexOf(el.tagName),
  }));
  titleList.value = titleList.value.slice(titleList.value.length / 2)
}

const handleAnchorClick=(anchor:any)=>{
  // document.getElementById(anchor.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  const target:HTMLElement|null = document.getElementById(anchor.id)
  if(!target) return
  let offsetTop:number = target.offsetTop || 0;
  let parentElement:HTMLElement|null = target.offsetParent as HTMLElement;
  while (parentElement) {
    offsetTop += parentElement.offsetTop;
    parentElement = parentElement.offsetParent as HTMLElement;
  }
  window.scrollTo({
    top: offsetTop - 60,
    behavior: 'smooth'
  })
}

const editCurrentBlog = () => {
  if (typeof route.query.id !== "string") return;
  router.push({ path: "/editBlog", query: { id: route.query.id } });
}

onMounted(()=>{
  getBlog()
})
</script>



<style scoped>
.blog-content{
  overflow: hidden;
  text-align: left;
  word-wrap:break-word;
  width: 90%;
  margin: 0 auto 18px;
  background: rgba(255, 255, 255, 0.98);
  border: 1px solid var(--color-border);
  border-radius: 0 0 var(--radius-lg) var(--radius-lg);
  box-shadow: var(--shadow-md);
}

.blog-header{
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #f4f8f2, #fff);
  width: 90%;
  margin: 0 auto;
  padding: 22px 24px 18px;
  border: 1px solid var(--color-border);
  border-bottom: 0;
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  text-align: left;
}

.blog-header::before {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 5px;
  background: linear-gradient(180deg, var(--color-primary-400), var(--color-primary-700));
  content: "";
}

.blog-header h1 {
  min-width: 0;
  margin: 0 !important;
  padding: 0 !important;
  font-size: clamp(24px, 3vw, 34px);
  line-height: 1.35;
  overflow-wrap: anywhere;
}

.blog-heading-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
}

.owner-content-action {
  min-width: 108px;
  min-height: 40px;
  flex: 0 0 auto;
  margin: 2px 0 0;
  color: #fff;
  border-radius: 12px;
}

.blog-header p{
  margin: 8px 0 0;
  padding: 0 !important;
  font-size: 12px;
  color: var(--color-text-secondary);
}

.anchor{
  text-align: left;
  border-radius: var(--radius-sm);
  transition: transform var(--transition-fast), background-color var(--transition-fast);
}

.anchors a:hover{
  color: #63a35c;
}

.anchor:hover{
  transform: translateX(3px);
  background-color: var(--color-primary-50);
}

.share-module {
  z-index: 5;
}

.share-panel {
  overflow: visible;
}

.share-panel :deep(.wechat-qrcode) {
  z-index: 20;
  border-color: var(--color-border);
  border-radius: 12px;
  box-shadow: 0 12px 30px rgba(30, 54, 36, 0.18);
}

.share-panel :deep(.wechat-qrcode h4) {
  border-radius: 11px 11px 0 0;
}

.fixed-buttons{
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  position: fixed;
  right: 10px;
  bottom: 80px;
  z-index: 101;
  height: 200px;
  width: 32px;
}

@media screen and (max-width: 767px){
  .anchors{
    position: fixed;
    bottom: 80px;
    padding: 0;
    right: 60px;
    width: 70%;
    max-width: 300px;
    z-index: 102;
    transform-origin: right bottom;
    transition-property:opacity,transform;
    transition-duration:0.3s;
    transition-timing-function:ease;
  }

  .anchors .title{
    border-radius: var(--radius-md) var(--radius-md) 0 0;
  }

  .anchors .content{
    border-radius: 0 0 var(--radius-md) var(--radius-md);
  }

  .anchors {
    box-shadow: 0 3px 8px 6px rgba(7,17,27,0.05);
    border-radius: var(--radius-lg);
  }


  .anchors:hover{
    box-shadow: 0 6px 16px 12px rgba(7,17,27,0.25);
  }

  .main-container :deep(.el-col) {
    width: 100%;
    max-width: 100%;
    flex: 0 0 100%;
  }

  .blog-header,
  .blog-content {
    width: calc(100% - 24px);
  }

  .blog-header {
    padding: 18px 17px 15px;
  }

  .blog-heading-row {
    align-items: flex-start;
    gap: 12px;
  }

  .owner-content-action {
    min-width: 42px;
    width: 42px;
    height: 42px;
    padding: 0;
    font-size: 0;
  }

  .owner-content-action :deep(.el-icon) {
    margin: 0;
    font-size: 17px;
  }
}
</style>
