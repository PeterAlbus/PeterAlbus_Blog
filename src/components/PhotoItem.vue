<template>
  <div class="photo-item">
    <div class="photo-delete-button"
         v-if="userStore.userId"
         @click="deletePhoto">
      删除
    </div>
    <el-image :src="imgThumb"
              :alt="imgName"
              style="width: 100%"
              :preview-src-list="[imgSrc]"
              :hide-on-click-modal="true"
              fit="cover" lazy>
      <template #placeholder>
        <div class="image-slot">
          加载中<span class="dot">...</span>
        </div>
      </template>
    </el-image>
    <span class="paragraph">{{imgName}}</span>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { ElMessage, ElMessageBox } from "element-plus";
import { deletePhotoById } from "@/services/photoApi";

const userStore = useUserStore();
const props = defineProps({
  imgId: {
    type: String,
    default() {
      return ''
    },
  },
  imgThumb: {
    type: String,
    default() {
      return ''
    },
  },
  imgSrc: {
    type: String,
    default() {
      return ''
    },
  },
  imgName: {
    type: String,
    default() {
      return ''
    },
  }
});

const emits = defineEmits(['deletePhoto']);

const deletePhoto = () => {
  ElMessageBox.confirm(
    '确认删除这张图片吗?',
    '警告',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      deletePhotoById(props.imgId.toString()).then(() => {
        ElMessage({
          type: 'success',
          message: "删除成功！",
        })
        emits('deletePhoto')
      })
    })
    .catch()
}
</script>

<style scoped>
.photo-item {
  position: relative;
}

.photo-item .photo-delete-button {
  position: absolute;
  right: 5px;
  bottom: 3px;
  width: 30px;
  height: 20px;
  z-index: 2;
  display: none;
  cursor: pointer;
  background: red;
  border-radius: 4px;
  color: white;
  font-size: 12px;
}

.photo-item:hover .photo-delete-button {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
