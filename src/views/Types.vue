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
      <br/>
      <div class="module">
        <h2 class="title">博文列表</h2>
        <div class="content" v-for="(item,index) in selectedBlogs">
          <el-row style="height: 150px">
            <el-col :span="8">
              <el-image :src="item.blogImg" fit="cover" style="height: 140px;max-width: 150px;padding: 5px"></el-image>
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
        </div>
        <div style="background-color: white">
          <el-pagination
              background
              layout="prev, pager, next"
              :current-page="currentPage"
              :page-size="pageSize"
              :total="blogList.length">
          </el-pagination>
        </div>
      </div>
    </el-col>
    <el-col :lg="{span:6}" :sm="9">
      <br/>
      <div class="module">
        <div class="content">
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
      <br/>
      <div class="module">
        <h2 class="title">友情链接</h2>
        <div class="content">
          <a href="http://www.peteralbus.com:8088/" target="_blank">疫迹</a>
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
    }
  },
  created() {
    this.getBlogList();
  },
  methods:{
    getBlogList: function (){
      let that=this;
      that.$axios.get('queryAll')
          .then(res=>{
            console.log(res);
            that.blogList=res.data;
          })
    }
  },
  computed:{
    selectedBlogs: function (){
      let slectedBlogs=[];
      for(let i of this.blogList)
      {
        if(i.blogType==this.selectType)
        {
          slectedBlogs.push(i);
        }
      }
      slectedBlogs=slectedBlogs.reverse();
      return slectedBlogs.slice((this.currentPage-1)*this.pageSize,this.currentPage*this.pageSize);
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
  background: url("../assets/background.jpg") no-repeat fixed center center;
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

.title {
  position: relative;
  margin: 0;
  padding: 6px 20px;
  height: 20px;
  border-bottom: 1px solid #eaeaea;
  border-radius: 5px 5px 0 0;
  background-color: #f7f7f7;
  font-weight: 400;
  font-size: 15px;
  line-height: 20px;
  text-align: left;

}

.content {
  position: relative;
  margin-bottom: 1px;
  padding: 6px 20px;
  background-color: #fff;
  border-radius: 0 0 5px 5px;
}

.module{
  position: relative;
  margin: 0 auto;
  width: 90%;
}

.blog-description{
  text-align: left;
}

.info{
  height: 20px;
}

.info span{
  font-size: smaller;
}
</style>