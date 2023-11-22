<template>
  <Banner title="上传图片"></Banner>
  <el-row class="main-container" style="justify-content: center;align-items: center">
    <div style="width: 250px">
      <el-form>
        <el-form-item label="图片名称">
          <el-input v-model="imgName"></el-input>
        </el-form-item>
        <el-form-item label="上传图片">
          <el-upload
            class="avatar-uploader"
            action="https://www.peteralbus.com/api/photo/upload"
            ref="uploadRef"
            :headers="headerObj"
            :data="upData"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :auto-upload="false"
            :on-change="onFileChange"
          >
            <el-image style="width: 178px; height: 178px" v-if="imageUrl" :src="imageUrl" class="avatar"
                      alt="" fit="cover" />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
        <el-button v-on:click="submitUpload">上传</el-button>
      </el-form>
    </div>
  </el-row>
</template>

<script setup lang="ts">
import { Plus } from "@element-plus/icons-vue";
import { computed, ref } from "vue";
import type { ElUpload, UploadFile, UploadRawFile } from "element-plus";
import { ElMessage } from "element-plus";
import Banner from "@/components/Banner.vue";
import { useRouter } from "vue-router";

const router = useRouter();
const uploadRef = ref<InstanceType<typeof ElUpload>>();


const imgName = ref("");
const imageUrl = ref("");
const token = localStorage.getItem("token") || "";
const headerObj = {
  satoken_peteralbus_blog: token
};

const submitUpload = () => {
  uploadRef.value?.submit();
};

const handleAvatarSuccess = (res: any, file: UploadFile) => {
  ElMessage.success("上传成功");
  router.push("/photo");
};

const onFileChange = (file: UploadFile, fileList: UploadFile[]) => {
  if (file.raw)
    imageUrl.value = URL.createObjectURL(file.raw);
};

const beforeAvatarUpload = (file: UploadRawFile) => {
  const isIMG = file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/gif";
  const isLt50M = file.size / 1024 / 1024 < 50;

  if (!isIMG) {
    ElMessage.error("选择的文件不是图片！");
  }
  if (!isLt50M) {
    ElMessage.error("图片大小不能超过50M！");
  }
  return isIMG && isLt50M;
};

const upData = computed(() => {
  return { imgName: imgName.value };
});
</script>

<style scoped>
</style>
