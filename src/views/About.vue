<template>
  <div class="banner">
    <div class="banner-container">
      <div>
        <h1>个人介绍</h1>
      </div>
    </div>
  </div>
  <div class="main-container">
    <el-row>
      <el-col :lg="{span:11,offset:3}" :sm="15">
        <div class="module">
          <div class="blog-header">
            <h1>个人简介</h1>
            <p><i class="fa fa-user"></i> PeterAlbus</p>
          </div>
          <div class="blog-content">
            <v-md-editor v-model="blogContent" mode="preview"></v-md-editor>
          </div>
        </div>
      </el-col>
      <el-col :lg="{span:6}" :sm="9">
        <div class="module">
          <div class="content paragraph">
            <el-avatar :size="50" src="/assets/2.png"></el-avatar>
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
          <h2 class="title"><el-icon style="vertical-align: -10%"><link-icon /></el-icon>友情链接</h2>
          <div class="content paragraph">
            <p v-for="item in friendLinkList"><a :href="item.linkUrl" target="_blank">{{ item.linkName }}</a></p>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {Link} from "@element-plus/icons-vue";
export default {
  components:{LinkIcon:Link},
  name: "About",
  data(){
    return{
      blogContent:'欢迎访问我的博客！我的网名是PeterAlbus，是一名计算机专业的普通大学生。\n' +
          '\n' +
          '<br>'+
          '我对于计算机相关内容都比较感兴趣。小站初建成，还十分简陋，会一步步添加新的功能。\n' +
          '\n' +
          '<br>'+
          '欢迎通过电子邮箱:wuhongdb@163.com或 QQ:2997592724与我联系。',
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
    this.getFriendLinkList()
  },
  methods:{
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
