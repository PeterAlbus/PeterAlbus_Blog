<template>
  <div class="banner">
    <div class="banner-container">
      <div>
        <h1>撰写博客</h1>
      </div>
    </div>
  </div>
  <div class="main-container">
    <el-row>
      <el-col :lg="{span:16,offset:4}">
        <div class="blog-content">
          <el-form ref="blogForm" :model="blog" :rules="rules">
            <el-form-item label="标题：" prop="blogTitle">
              <el-input v-model="blog.blogTitle" placeholder="标题" prefix-icon='el-icon-notebook-2'></el-input>
            </el-form-item>
            <el-form-item label="封面图片(点击上传):" prop="goodPath">
              <el-upload
                  class="avatar-uploader"
                  list-type="picture-card"
                  action="https://www.peteralbus.com:8089/upload"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
              >
                <img style="width: 100px; height: 100px"  v-if="blog.blogImg" :src="blog.blogImg" class="avatar" alt="">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="作者：" prop="blogAuthor">
              <el-input v-model="blog.blogAuthor" placeholder="作者" prefix-icon='el-icon-notebook-2'></el-input>
            </el-form-item>
            <el-form-item label="描述：" prop="blogDescription">
              <el-input v-model="blog.blogDescription" placeholder="描述" prefix-icon='el-icon-notebook-2'></el-input>
            </el-form-item>
            <el-form-item label="分类：" prop="blogType">
              <el-radio-group v-model="blog.blogType">
                <el-radio-button :label="1">学习笔记</el-radio-button>
                <el-radio-button :label="2">生活</el-radio-button>
                <el-radio-button :label="3">ACG</el-radio-button>
                <el-radio-button :label="4">科技</el-radio-button>
                <el-radio-button :label="5">随笔</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="是否置顶：" prop="blogTop">
              <el-radio-group v-model="blog.isTop">
                <el-radio-button :label="0">不置顶</el-radio-button>
                <el-radio-button :label="1">置顶</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="内容：" prop="blogContent">
              <v-md-editor v-model="blog.blogContent"></v-md-editor>
            </el-form-item>
            <el-form-item style="text-align: center;">
              <el-button type="success" v-on:click="onSubmit('blogForm')">提交</el-button>
              <el-button type="info" v-on:click="getBlog">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "NewBlog",
  data() {
    return {
      blog:{
        blogId:this.$route.query.id,
        blogTitle:'',
        blogImg:'',
        blogType:1,
        blogDescription:'',
        blogAuthor:'PeterAlbus',
        blogContent:'',
        blogTime:'2021-07-22',
        blogLike:0,
        blogViews:0,
        isTop:0
      },
      rules: {
        blogTitle: [
          {required: true, message: '标题不可为空', trigger: 'blur'}
        ],
        blogAuthor: [
          {required: true, message: '作者不可为空', trigger: 'blur'}
        ],
        blogDescription: [
          {required: true, message: '描述不可为空', trigger: 'blur'}
        ],
        blogType: [
          {required: true, message: '必须选择类型', trigger: 'blur'}
        ],
        blogContent: [
          {required: true, message: '内容不可为空', trigger: 'blur'}
        ]
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
    handleAvatarSuccess(res, file) {
      console.log(res);
      if (res !== 'error') {
        this.blog.blogImg = res;
        this.$message.success("上传成功");
      } else this.$message.error("上传失败!");
    },
    getFriendLinkList: function (){
      let that=this;
      that.$axios.get('friendLink/getFriendLinkList')
          .then(res=>{
            that.friendLinkList=res.data;
          })
    },
    beforeAvatarUpload(file) {
      console.log(file.type);
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG/PNG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    getBlog:function (){
      let that=this;
      if(that.blog.blogId!==undefined)
      {
        that.$axios.get('queryById?id='+that.blog.blogId)
            .then(res=>{
              that.blog=res.data;
            })
      }
    },
    onSubmit(formName) {
      // 为表单绑定验证功能
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let that = this;
          if(that.blog.blogId!==undefined)
          {
            console.log('update:',that.blog);
            that.$axios.post('/update',that.$qs.stringify(that.blog))
            .then(res=>{
              if(res.data!='fail')
              {
                that.$message.success('更新成功');
                that.$router.push('/blog?id='+that.blog.blogId)
              }
              else
              {
                that.$message.error('更新失败');
              }
            })
          }
          else
          {
            console.log('new:',that.blog);
            that.$axios.post('/add',that.$qs.stringify(that.blog))
                .then(res=>{
                  if(res.data!='fail')
                  {
                    that.$message.success('发布成功');
                    that.$router.push('/blog?id='+that.blog.blogId)
                  }
                  else
                  {
                    that.$message.error('发布失败');
                  }
                })
          }
          //that.$axios.post('/business/update',that.$qs.stringify(dat))
        } else {
          return false;
        }
      });
    },
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

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 150px;
  height: 150px;
  line-height: 150px;
  text-align: center;
}
.avatar {
  width: 150px;
  height: 150px;
  display: block;
}
</style>
