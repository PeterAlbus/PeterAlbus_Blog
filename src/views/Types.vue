<template>
  <div class="banner">
    <div class="banner-container">
      <div>
        <h1>分类查看</h1>
      </div>
    </div>
  </div>
  <el-row class="main-container">
    <el-col :span="24">
      <el-row>
        <el-col :lg="{span:16,offset:4}">
          <el-radio-group v-model="selectType">
            <el-radio-button :label="1">学习笔记</el-radio-button>
            <el-radio-button :label="2">生活</el-radio-button>
            <el-radio-button :label="3">ACG</el-radio-button>
            <el-radio-button :label="4">科技</el-radio-button>
            <el-radio-button :label="5">随笔</el-radio-button>
          </el-radio-group>
        </el-col>
      </el-row>
    </el-col>
    <el-col :lg="{span:11,offset:3}" :sm="15">
      <div class="module">
        <h2 class="title">博文列表</h2>
        <el-card v-for="item in currentPageBlogs" shadow="hover" :body-style="{ padding: '0px' }">
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
        <div style="background-color: white">
          <el-pagination v-if="screenWidth>=600"
              layout="total, sizes, prev, pager, next, jumper"
              :page-sizes="[5,10,20]"
              v-model:current-page="currentPage"
              v-model:page-size="pageSize"
              :total="selectedBlogs.length">
          </el-pagination>
          <el-pagination v-if="screenWidth<600"
                         layout="prev, pager, next"
                         :page-sizes="[5,10,20]"
                         v-model:current-page="currentPage"
                         v-model:page-size="pageSize"
                         :total="selectedBlogs.length">
          </el-pagination>
        </div>
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
  name: "Types",
  data(){
    return {
      screenWidth: document.body.clientWidth,
      selectType:1,
      currentPage:1,
      pageSize:10,
      blogList:[
        {
          blogId:1,
          blogTitle:'本站介绍',
          blogImg:'https://www.peteralbus.com:8440/assets/blog/imgs/cover/cover1.jpg',
          blogType:1,
          blogDescription:'本站是如何建立的？',
          blogAuthor:'PeterAlbus',
          blogContent:'',
          blogTime:'2021-7-19',
          blogLike:18,
          blogViews:200,
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
    window.addEventListener('resize',this.resize)
  },
  methods:{
    resize(){
      this.screenWidth = document.body.clientWidth
    },
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
    selectedBlogs: function (){
      let slectedBlogs=[];
      for(let i of this.blogList)
      {
        if(i.blogType===this.selectType)
        {
          slectedBlogs.push(i);
        }
      }
      slectedBlogs=slectedBlogs.reverse();
      return slectedBlogs;
    },
    currentPageBlogs:function (){
      return this.selectedBlogs.slice((this.currentPage-1)*this.pageSize,this.currentPage*this.pageSize)
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
</style>
