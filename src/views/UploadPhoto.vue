<template>
  <div class="banner">
    <div class="banner-container">
      <div>
        <h1>上传图片</h1>
      </div>
    </div>
  </div>
  <el-row class="main-container" style="justify-content: center;align-items: center">
    <div style="width: 250px">
      <el-form>
        <el-form-item label="图片名称">
          <el-input v-model="imgName"></el-input>
        </el-form-item>
        <el-form-item label="上传图片">
          <el-upload
              class="avatar-uploader"
              action="https://www.peteralbus.com:8089/photo/upload/"
              ref="uploadRef"
              :data="upData"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              :auto-upload="false"
              :on-change="onFileChange"
          >
            <img style="width: 178px; height: 178px"  v-if="imageUrl" :src="imageUrl" class="avatar" alt="">
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-button v-on:click="submitUpload">上传</el-button>
      </el-form>
    </div>
  </el-row>

</template>

<script setup lang="ts">
import {Plus} from '@element-plus/icons-vue'
import {computed, onMounted, ref} from "vue";
import type {ElUpload, UploadFile, UploadProgressEvent, UploadRawFile} from "element-plus";
import {ElMessage} from "element-plus";
import axios from "axios";
import router from "@/router";

const uploadRef=ref<InstanceType<typeof ElUpload>>()


let imgName=ref('')
let imageUrl=ref('')
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

const submitUpload = ()=>{
  uploadRef.value!.submit();
}

const handleAvatarSuccess = (res: UploadProgressEvent, file: UploadFile) => {
  ElMessage.success("上传成功")
  router.push('/photo')
}

const onFileChange = (file: UploadFile, fileList: UploadFile[])=>{
  imageUrl.value = URL.createObjectURL(file.raw!)
}

const beforeAvatarUpload = (file: UploadRawFile) => {
  const isIMG = file.type === 'image/jpeg'||file.type === 'image/png'||file.type === 'image/gif'
  const isLt10M = file.size / 1024 / 1024 < 10

  if (!isIMG) {
    ElMessage.error('选择的文件不是图片！')
  }
  if (!isLt10M) {
    ElMessage.error('图片大小不能超过10M！')
  }
  return isIMG && isLt10M
}

const upData=computed(()=>{
  return {imgName: imgName.value}
})

onMounted(()=>{
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
</style>
