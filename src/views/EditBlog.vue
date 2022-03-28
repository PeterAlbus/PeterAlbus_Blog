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
      <el-col :lg="{span:16,offset:4}" :sm="{span:20,offset:2}" :xs="{span:22,offset:1}">
        <div class="blog-content">
          <el-form ref="blogForm" :model="blog" :rules="rules">
            <el-form-item label="标题：" prop="blogTitle">
              <el-input v-model="blog.blogTitle" placeholder="标题" :prefix-icon='Document'></el-input>
            </el-form-item>
            <el-form-item label="封面图片(点击上传):" prop="goodPath">
              <el-upload
                  class="avatar-uploader"
                  action="https://www.peteralbus.com:8089/upload"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
              >
                <el-image style="width: 200px; height: 200px"  v-if="imageUrl" :src="imageUrl" class="avatar" fit="cover" alt=""/>
                <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
              </el-upload>
            </el-form-item>
            <el-form-item label="作者：" prop="blogAuthor">
              <el-input v-model="blog.blogAuthor" placeholder="作者" :prefix-icon='User'></el-input>
            </el-form-item>
            <el-form-item label="描述：" prop="blogDescription">
              <el-input v-model="blog.blogDescription" placeholder="描述" :prefix-icon='ChatLineSquare'></el-input>
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
            <div style="display: flex;justify-content: center!important;">
              <el-button type="success" @click="onSubmit(blogForm)">提交</el-button>
              <el-button type="info" v-on:click="getBlog">重置为原博客</el-button>
            </div>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import {Plus,Document,User,ChatLineSquare} from '@element-plus/icons-vue'
import {onMounted, reactive, ref} from "vue";
import { useRoute } from 'vue-router'
import qs from "qs";
import axios from "axios";
import type {
  UploadFile,
  UploadRawFile,
  UploadProgressEvent,
  FormInstance
} from 'element-plus'
import {ElMessage} from "element-plus";
import router from "@/router";
const blogForm = ref<FormInstance>()
const route = useRoute()

let imageUrl=ref('')

let blog=ref({
  blogId:route.query.id,
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
})

const rules=reactive({
  blogTitle: [
    {required: true, message: '标题不可为空', trigger: 'change'}
  ],
  blogAuthor: [
    {required: true, message: '作者不可为空', trigger: 'change'}
  ],
  blogDescription: [
    {required: true, message: '描述不可为空', trigger: 'change'}
  ],
  blogType: [
    {required: true, message: '必须选择类型', trigger: 'change'}
  ],
  blogContent: [
    {required: true, message: '内容不可为空', trigger: 'change'}
  ]
})

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

const getBlog = function (){
  if(blog.value.blogId!==undefined)
  {
    axios.get('queryById?id='+blog.value.blogId)
        .then(res=>{
          blog.value=res.data;
          imageUrl.value=blog.value.blogImg
        })
  }
}

const handleAvatarSuccess = (res: any, file: UploadFile) => {
  if (res != 'error') {
    blog.value.blogImg = res;
    imageUrl.value=blog.value.blogImg
    ElMessage.success("上传成功");
  } else ElMessage.error("上传失败!");
}

const beforeAvatarUpload = (file: UploadRawFile) => {
  const isIMG = file.type === 'image/jpeg'||file.type === 'image/png'||file.type === 'image/gif'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isIMG) {
    ElMessage.error('选择的文件不是图片！')
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过2M！')
  }
  return isIMG && isLt2M
}

const onSubmit= async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      if(blog.value.blogId!==undefined)
      {
        axios.post('/update',qs.stringify(blog.value))
            .then(res=>{
              if(res.data=='fail')
              {
                ElMessage.error('更新失败');
              }
              else if(res.data=='noPermission')
              {
                ElMessage.error('你没有权限进行此操作!');
              }
              else
              {
                ElMessage.success('更新成功');
                router.push('/blog?id='+blog.value.blogId)
              }
            })
      }
      else
      {
        axios.post('/add',qs.stringify(blog.value))
            .then(res=>{
              if(res.data=='fail')
              {
                ElMessage.error('发布失败');
              }
              else if(res.data=='noPermission')
              {
                ElMessage.error('你没有权限进行此操作!');
              }
              else
              {
                ElMessage.success('发布成功');
                router.push('/blog?id='+blog.value.blogId)
              }
            })
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}

onMounted(()=>{
  getFriendLinkList()
  getBlog()
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
}
</style>
