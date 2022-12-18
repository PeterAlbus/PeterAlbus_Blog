<template>
  <div class="banner">
    <div class="banner-container">
      <div>
        <h1>博客详情</h1>
      </div>
    </div>
  </div>
  <div class="main-container">
    <el-row>
      <el-col :lg="{span:11,offset:3}" :sm="15">
        <div class="blog-header">
          <h1 style="padding: 8px 20px 2px;">{{blog.blogTitle}}</h1>
          <p style="padding: 0 5px 5px 5px"><i class="fa fa-user"></i> {{blog.blogAuthor}}&emsp;<i class="fa fa-calendar"></i> 发布于{{blog.blogTime}} <i class="fa fa-eye"></i> {{blog.blogViews}}次访问</p>
        </div>
        <div class="blog-content">
          <v-md-preview :text="blog.blogContent" ref="mdRef"></v-md-preview>
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
                    v-for="anchor in titleList"
                    :style="{ padding: `2px 20px 2px ${anchor.indent * 20 + 20}px` }"
                    class="anchor"
                    @click="handleAnchorClick(anchor)"
                >
                  <a style="cursor: pointer"><el-icon class="arrow-icon" style="vertical-align: -15%"><arrow-right /></el-icon> {{ anchor.title }}</a>
                </div>
              </el-scrollbar>
            </div>
          </div>
          <Comment :blogId="blog.blogId"></Comment>
          <div class="module">
            <h2 class="title"><el-icon style="vertical-align: -10%"><share-icon /></el-icon> 分享本页面</h2>
            <div class="content paragraph">
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
import {onMounted, ref ,nextTick} from "vue";
import {useRoute} from "vue-router";
import {ArrowRight,Notebook,Share as shareIcon} from "@element-plus/icons-vue";
import axios from "axios";
import PersonalInfo from '@/components/PersonalInfo.vue'
import Comment from '@/components/Comment.vue'
import type {vMdEditor} from "@kangc/v-md-editor"


const route=useRoute()
let mdRef=ref<InstanceType<typeof vMdEditor>>()
let titleList:any=ref([])

let hideCatalogue=ref(true)

let blog=ref({
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
  if(blog.value.blogId!==undefined)
  {
    axios.get('queryById?id='+blog.value.blogId)
        .then(res=>{
          blog.value=res.data;
          blog.value.blogViews+=1;
          if(!localStorage.getItem('ipAddress')||localStorage.getItem('ipAddress')=='127.0.0.1') {
            axios.get('https://ip.useragentinfo.com/json')
                .then((res)=>{
                  localStorage.setItem('ipAddress',res.data.ip||'127.0.0.1')
                  axios.get('/visitBlog?blogId='+blog.value.blogId+"&ipAddress="+localStorage.getItem('ipAddress'));
                })
          }
          else {
            axios.get('/visitBlog?blogId='+blog.value.blogId+"&ipAddress="+localStorage.getItem('ipAddress'));
          }
          document.title = blog.value.blogTitle+'——PeterAlbus的博客'
          let meta:any=document.querySelector('meta[name="description"]')
          if(!meta)
          {
            meta.setAttribute('content',blog.value.blogDescription)
          }
          nextTick(getTitles)
        })
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
    lineIndex: el.getAttribute('data-v-md-line'),
    indent: hTags.indexOf(el.tagName),
  }));
}

const handleAnchorClick=(anchor:any)=>{
  const { lineIndex } = anchor;

  const heading = mdRef.value?.$el.querySelector(`[data-v-md-line="${lineIndex}"]`);

  if (heading) {
    mdRef.value?.scrollToTarget({
      target: heading,
      scrollContainer: window,
      top: 60,
    });
  }
}

let friendLinkList=ref([
  {
    linkId:1,
    linkName:'loading',
    linkUrl:'#'
  }
])

const getFriendLinkList=function () {
  axios.get('friendLink/getFriendLinkList')
      .then(res => {
        friendLinkList.value = res.data;
      })
}

onMounted(()=>{
  getBlog()
  getFriendLinkList()
})
</script>



<style scoped>
.banner {
  position: relative;
  top: 0;
  left: 0;
  right: 0;
  height: 30vh;
  background: url("../assets/background.jpg") fixed center center;
  text-align: center;
  color: #fff !important;
}

.banner-container {
  position: absolute;
  width: 100%;
  margin-top: 13vh;
  line-height: 1.5;
  color: #eee;
}

.blog-content{
  text-align: left;
  word-wrap:break-word;
  width: 90%;
  margin: 0 auto;
}

.blog-header{
  background-color: #f7f7f7;
  width: 90%;
  margin: 0 auto;
}

.blog-header p{
  font-size: 14px;
  color: #245440;
}

.anchor{
  text-align: left;
  transition: transform 0.3s ease .1s;
}

.anchors a:hover{
  color: #63a35c;
}

.anchor:hover{
  transform: translateX(+5px);
  background-color: #f1f1f1;
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
    border-radius: 5px 5px 0 0;
  }

  .anchors .content{
    border-radius: 0 0 5px 5px;
  }

  .anchors {
    box-shadow: 0 3px 8px 6px rgba(7,17,27,0.05);
    border-radius: 5px;
  }


  .anchors:hover{
    box-shadow: 0 6px 16px 12px rgba(7,17,27,0.25);
  }

}
</style>
