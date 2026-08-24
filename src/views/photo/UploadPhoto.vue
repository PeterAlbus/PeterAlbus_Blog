<template>
  <Banner title="上传图片"></Banner>
  <el-row class="main-container upload-page">
    <div class="upload-panel">
      <el-form class="upload-form" label-position="top">
        <el-form-item label="图片名称">
          <el-input v-model="imgName" placeholder="请输入图片名称"></el-input>
        </el-form-item>
        <el-form-item label="上传图片">
          <el-upload
            class="photo-uploader"
            :action="BASE_URL + photoUrl.addPhoto"
            ref="uploadRef"
            :headers="headerObj"
            :data="upData"
            :show-file-list="false"
            :on-success="handleUploadSuccess"
            :before-upload="beforePhotoUpload"
            :auto-upload="false"
            :on-change="handleFileChange"
          >
            <div class="photo-upload-frame">
              <el-image v-if="imageUrl" :src="imageUrl" class="photo-preview" alt="待上传图片预览" fit="cover" />
              <div v-else class="upload-placeholder">
                <el-icon><Plus /></el-icon>
                <strong>选择图片</strong>
                <span>支持 JPG、PNG 和 GIF，大小不超过 50 MB</span>
              </div>
            </div>
          </el-upload>
        </el-form-item>
        <el-button class="upload-submit" type="success" @click="submitUpload">上传</el-button>
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
import { BASE_URL, photoUrl } from "@/services/urlConfig";

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

const handleUploadSuccess = () => {
  ElMessage.success("上传成功");
  router.push("/photo");
};

const handleFileChange = (file: UploadFile) => {
  if (file.raw)
    imageUrl.value = URL.createObjectURL(file.raw);
};

const beforePhotoUpload = (file: UploadRawFile) => {
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
.upload-page {
  align-items: center;
  justify-content: center;
}

.upload-panel {
  box-sizing: border-box;
  width: min(460px, calc(100vw - 32px));
  padding: 28px;
  background: rgba(255, 255, 255, 0.97);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
}

.upload-form,
.photo-uploader {
  width: 100%;
}

.upload-panel :deep(.el-form-item) {
  display: block;
  margin-bottom: 22px;
}

.upload-panel :deep(.el-form-item__label) {
  height: auto;
  margin-bottom: 8px;
  padding: 0;
  color: var(--color-heading);
  font-size: 14px;
  font-weight: 600;
  line-height: 1.5;
}

.upload-panel :deep(.el-form-item__content) {
  width: 100%;
  min-width: 0;
  line-height: normal;
}

.upload-panel :deep(.el-input__wrapper) {
  min-height: 42px;
  padding: 0 13px;
  border-radius: 11px;
}

.photo-uploader :deep(.el-upload) {
  position: relative;
  display: block;
  width: 100%;
  overflow: hidden;
  cursor: pointer;
  background: linear-gradient(145deg, #fbfdf9, #f1f5ef);
  border: 1px dashed rgba(50, 97, 57, 0.3);
  border-radius: var(--radius-md);
  transition: border-color var(--transition-fast), background-color var(--transition-fast), box-shadow var(--transition-fast);
}

.photo-uploader :deep(.el-upload:hover) {
  background: #fff;
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 4px rgba(99, 163, 92, 0.09);
}

.photo-upload-frame {
  position: relative;
  width: 100%;
  overflow: hidden;
  aspect-ratio: 16 / 10;
  border-radius: calc(var(--radius-md) - 1px);
}

.photo-preview {
  display: block;
  width: 100%;
  height: 100%;
}

.upload-placeholder {
  display: flex;
  width: 100%;
  height: 100%;
  padding: 24px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--color-text-secondary);
}

.upload-placeholder .el-icon {
  width: auto;
  height: auto;
  margin-bottom: 2px;
  color: var(--color-primary-500);
  font-size: 30px;
}

.upload-placeholder strong {
  color: var(--color-heading);
  font-size: 15px;
  line-height: 1.4;
}

.upload-placeholder span {
  color: var(--color-text-muted);
  font-size: 12px;
  line-height: 1.6;
  text-align: center;
}

.upload-submit {
  width: 100%;
  margin: 0;
  color: #fff;
  border-radius: 12px;
}

@media (max-width: 520px) {
  .upload-panel {
    width: calc(100vw - 24px);
    padding: 22px 18px;
    border-radius: var(--radius-lg);
  }

  .upload-placeholder {
    padding: 18px;
  }
}
</style>
