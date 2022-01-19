<template>
  <div class="home-banner">
    <div class="banner-container">
      <div>
        <el-avatar :size="150" :src="require('../assets/2.png')"></el-avatar>
        <h2>欢迎来到PeterAlbus的个人博客</h2>
        <br>
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
        <el-card class="content" v-for="(item,index) in topBlogs" shadow="hover" :body-style="{ padding: '0px' }">
          <el-row style="height: 170px">
            <el-col :span="8">
              <el-image :src="item.blogImg" fit="cover" class="blog-cover"></el-image>
            </el-col>
            <el-col :span="16">
              <div class="blog-description">
                <router-link :to="{ path: '/blog',query:{id:item.blogId}}">
                  <h4>{{item.blogTitle}}&emsp;<el-tag size="mini">{{getType(item.blogType)}}</el-tag></h4>
                </router-link>
                <p style="height: 110px">{{item.blogDescription}}</p>
                <p class="info">
                  <span type="info"><i class="el-icon-user-solid"></i>{{item.blogAuthor}}</span>
                  <span type="info"><i class="el-icon-alarm-clock"></i>{{item.blogTime}}</span>
                  <span type="info"><i class="el-icon-star-on"></i>{{item.blogLike}}</span>
                </p>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </div>

      <div class="module">
        <h2 class="title">最新发布</h2>
        <el-card class="content" v-for="item in recentBlogs" shadow="hover" :body-style="{ padding: '0px' }">
          <el-row style="height: 170px">
            <el-col :span="8">
              <el-image :src="item.blogImg" fit="cover" class="blog-cover"></el-image>
            </el-col>
            <el-col :span="16">
              <div class="blog-description">
                <router-link :to="{ path: '/blog',query:{id:item.blogId}}">
                  <h4 style="height: 40px"><span style="white-space: nowrap">{{item.blogTitle}}&emsp;</span><el-tag size="mini">{{getType(item.blogType)}}</el-tag></h4>
                </router-link>
                <p style="height: 90px;overflow: hidden">{{item.blogDescription}}</p>
                <p class="info">
                  <span type="info"><i class="el-icon-user-solid"></i>{{item.blogAuthor}}</span>
                  <span type="info"><i class="el-icon-alarm-clock"></i>{{item.blogTime}}</span>
                  <span type="info"><i class="el-icon-star-on"></i>{{item.blogLike}}</span>
                </p>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </div>
    </el-col>
    <el-col :lg="{span:6}" :sm="9">
      <div class="module">
        <div class="content paragraph">
          <el-avatar :size="50" :src="require('../assets/2.png')"></el-avatar>
          <h4>PeterAlbus</h4>
          <el-tooltip class="item" effect="dark" content="发送电子邮件" placement="top">
            <a href="mailto:wuhongdb@163.com">
              <i class="fa fa-fw fa-envelope" style="font-size:20px"></i>
            </a>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="github" placement="top">
            <a href="https://github.com/PeterAlbus" target="_blank">
              <i class="fa fa-fw fa-github" style="font-size:20px"></i>
            </a>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="bilibili" placement="top">
            <a href="https://space.bilibili.com/2003822" target="_blank">
              <i class="iconfont icon-bilibili-line" style="font-size:20px"></i>
            </a>
          </el-tooltip>
        </div>
      </div>

      <div class="module">
        <h2 class="title">友情链接</h2>
        <div class="content paragraph">
          <p v-for="item in friendLinkList"><a :href="item.linkUrl" target="_blank">{{ item.linkName }}</a></p>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'Home',
  data(){
    return {
      blogList:[
        {
          blogId:1,
          blogTitle:'稍等，数据请求中',
          blogImg:'https://www.peteralbus.com:8440/assets/blog/imgs/cover/cover1.jpg',
          blogType:1,
          blogDescription:'如果长时间仍显示本文字，请检查网络或联系PeterAlbus',
          blogAuthor:'PeterAlbus',
          blogContent:'',
          blogTime:'2021-7-19',
          blogLike:999,
          blogViews:999,
          isTop:1
        }
      ],
      friendLinkList:[
        {
          linkId:1,
          linkName:'loading',
          linkUrl:'#'
        }
      ]
    }
  },
  created() {
    this.getBlogList()
    this.getFriendLinkList()
  },
  methods:{
    getBlogList: function (){
      let that=this;
      that.$axios.get('queryAll')
      .then(res=>{
        that.blogList=res.data;
      })
    },
    getFriendLinkList: function (){
      let that=this;
      that.$axios.get('friendLink/getFriendLinkList')
          .then(res=>{
            that.friendLinkList=res.data;
          })
    }
  },
  computed:{
    topBlogs: function (){
      let topBlogs=[];
      for(let i of this.blogList)
      {
        if(i.isTop==1)
        {
          topBlogs.push(i);
        }
      }
      return topBlogs.reverse();
    },
    recentBlogs: function (){
      let recentBlogs=this.blogList.reverse();
      return recentBlogs.slice(0, 10);
    },
    getType: function (){
      return function (type){
        let types=['学习笔记','生活','ACG','科技','随笔']
        return types[type-1];
      }
    }
  }
}
</script>

<style scoped>
.home-banner {
  position: relative;
  top: 0;
  left: 0;
  right: 0;
  height: 100vh;
  background: url("../assets/background.jpg") no-repeat fixed center center;
  text-align: center;
  color: #fff !important;
  animation: header-effect 1s !important;
}

.banner-container {
  position: absolute;
  width: 100%;
  padding-top: 20px;
  margin-top: 35vh;
  line-height: 1.5;
  color: #eee;
  background: rgba(34, 44, 63, 0.5) !important;
  box-shadow: 3px 3px 6px 3px rgba(0, 0, 0, .3);
}

.banner-container a{
  color: white;
}

.banner-container a:hover{
  color: black;
}

@keyframes header-effect{
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
