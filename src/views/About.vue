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
          <h2 class="title">友情链接</h2>
          <div class="content">
            <a href="http://www.peteralbus.com:8088/" target="_blank">疫迹</a>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "About",
  data(){
    return{
      blogContent:'欢迎访问我的博客！我的网名是PeterAlbus，是一名计算机专业的普通大学生。\n' +
          '\n' +
          '<br>'+
          '我对于计算机相关内容都比较感兴趣。小站初建成，还十分简陋，会一步步添加新的功能。\n' +
          '\n' +
          '<br>'+
          '欢迎通过电子邮箱:wuhongdb@163.com或 QQ:2997592724与我联系。'
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
</style>