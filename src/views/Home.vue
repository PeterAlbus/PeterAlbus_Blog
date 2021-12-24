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
      <br/>
      <div class="module">
        <h2 class="title">置顶博文</h2>
        <div class="content" v-for="(item,index) in topBlogs">
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
      </div>
      <br/>
      <div class="module">
        <h2 class="title">最新发布</h2>
        <div class="content" v-for="(item,index) in recentBlogs">
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
  name: 'Home',
  data(){
    return {
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
