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
          <h1>{{blog.blogTitle}}</h1>
          <p><i class="fa fa-user"></i> {{blog.blogAuthor}}&emsp;<i class="fa fa-calendar"></i> 发布于{{blog.blogTime}} <i class="fa fa-eye"></i> {{blog.blogViews}}次访问</p>
        </div>
        <div class="blog-content">
          <v-md-editor v-model="blog.blogContent" mode="preview"></v-md-editor>
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
        <div class="module">
          <h2 class="title">分享本页面</h2>
          <div class="content paragraph">
            <Share
                :url="'https://www.peteralbus.com/%23/blog?id%3D'+blog.blogId"
                :title="blog.blogTitle"
                source="PeterAlbus的博客"
                :description="blog.blogDescription"
                :image="blog.blogImg"
                :twitter="true"
                :google="true"
            ></Share>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "Blog",
  data() {
    return {
      blog:{
        blogId:this.$route.query.id,
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
      },
      friendLinkList:[
        {
          linkId:1,
          linkName:'loading',
          linkUrl:'#'
        }
      ]
    };
  },
  created() {
    this.getBlog()
    this.getFriendLinkList()
  },
  methods:{
    getBlog:function (){
      let that=this;
      if(that.blog.blogId!==undefined)
      {
        that.$axios.get('queryById?id='+that.blog.blogId)
            .then(res=>{
              that.blog=res.data;
              that.blog.blogViews+=1;
              that.$axios.post('/update',that.$qs.stringify(that.blog));
              document.title = that.blog.blogTitle+'——PeterAlbus的博客'
              document.querySelector('meta[name="description"]').setAttribute('content',that.blog.blogDescription)
            })
      }
    },
    getFriendLinkList: function (){
      let that=this;
      that.$axios.get('friendLink/getFriendLinkList')
          .then(res=>{
            that.friendLinkList=res.data;
          })
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

.blog-content{
  text-align: left;
}

.blog-header{
  margin-bottom: 1px;
  padding: 8px 20px 12px;
  background-color: #f7f7f7;
}

.blog-header p{
  font-size: 14px;
  color: #4B6186;
}
</style>
