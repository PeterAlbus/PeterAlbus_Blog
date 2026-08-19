<template>
  <div class="photo-item">
    <div class="photo-media">
      <el-image
        ref="photoImageRef"
        class="photo-image"
        :src="imgThumb"
        :alt="imgName"
        :preview-src-list="effectivePreviewList"
        :initial-index="previewIndex"
        :hide-on-click-modal="true"
        preview-teleported
        fit="cover"
        lazy
      >
        <template #placeholder>
          <div class="image-slot">
            加载中<span class="dot">...</span>
          </div>
        </template>
      </el-image>

      <div class="photo-actions">
        <button class="photo-action photo-preview-action" type="button" :aria-label="`预览照片：${imgName}`" @click.stop="openPreview">
          <el-icon><View /></el-icon>
          <span class="photo-action-label">预览</span>
        </button>
        <button
          v-if="isSiteOwner"
          class="photo-action photo-delete-action"
          type="button"
          :aria-label="`删除照片：${imgName}`"
          :disabled="deleting"
          @click.stop="deletePhoto"
        >
          <el-icon><Delete /></el-icon>
          <span class="photo-action-label">删除</span>
        </button>
      </div>
    </div>
    <div class="photo-caption">
      <span class="photo-name" :title="imgName">{{imgName}}</span>
      <span class="photo-preview-hint"><el-icon><View /></el-icon>查看</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { ElMessage, ElMessageBox } from "element-plus";
import { deletePhotoById } from "@/services/photoApi";
import { computed, ref, type PropType } from "vue";
import { Delete, View } from "@element-plus/icons-vue";

const userStore = useUserStore();
const photoImageRef = ref<any>();
const deleting = ref(false);
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
  },
  previewSrcList: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  previewIndex: {
    type: Number,
    default: 0,
  }
});

const emits = defineEmits(['deletePhoto']);
const isSiteOwner = computed(() => userStore.userIdentity === 0);
const effectivePreviewList = computed(() => props.previewSrcList.length ? props.previewSrcList : [props.imgSrc]);

const openPreview = () => {
  const image = photoImageRef.value?.$el?.querySelector(".el-image__inner") as HTMLElement | undefined;
  image?.click();
};

const deletePhoto = async () => {
  try {
    await ElMessageBox.confirm(
      `“${props.imgName}”删除后将无法恢复。`,
      '删除照片',
      {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'photo-delete-confirm',
      }
    );
  } catch {
    return;
  }

  deleting.value = true;
  try {
    await deletePhotoById(props.imgId);
    ElMessage.success("照片已删除");
    emits('deletePhoto');
  } finally {
    deleting.value = false;
  }
}
</script>

<style scoped>
.photo-item {
  position: relative;
}

.photo-media {
  position: relative;
  overflow: hidden;
  background: var(--color-primary-50);
}

.photo-image {
  display: block;
  width: 100%;
  cursor: zoom-in;
}

.photo-actions {
  position: absolute;
  right: 10px;
  bottom: 10px;
  z-index: 3;
  display: flex;
  gap: 8px;
  opacity: 0;
  pointer-events: none;
  transform: translateY(7px);
  transition: opacity var(--transition-fast), transform var(--transition-fast);
}

.photo-item:hover .photo-actions,
.photo-item:focus-within .photo-actions {
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0);
}

.photo-action {
  display: inline-flex;
  min-width: 64px;
  height: 34px;
  padding: 0 11px;
  align-items: center;
  justify-content: center;
  gap: 5px;
  color: #fff;
  background: rgba(27, 47, 33, 0.78);
  border: 1px solid rgba(255, 255, 255, 0.24);
  border-radius: 11px;
  box-shadow: 0 7px 18px rgba(5, 14, 8, 0.2);
  backdrop-filter: blur(10px);
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: background-color var(--transition-fast), transform var(--transition-fast);
}

.photo-action:hover {
  background: rgba(40, 80, 50, 0.92);
  transform: translateY(-1px);
}

.photo-delete-action {
  background: rgba(146, 48, 48, 0.84);
}

.photo-delete-action:hover {
  background: rgba(169, 49, 49, 0.96);
}

.photo-action:disabled {
  opacity: 0.6;
  cursor: wait;
}

.photo-caption {
  display: flex;
  min-height: 44px;
  padding: 9px 11px 10px;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.photo-name {
  min-width: 0;
  overflow: hidden;
  color: var(--color-text-secondary);
  font-size: 12px;
  line-height: 1.5;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.photo-preview-hint {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 3px;
  color: var(--color-text-muted);
  font-size: 11px;
}

:global(.photo-delete-confirm) {
  color: #fff !important;
  background: #c94c4c !important;
  border-color: #c94c4c !important;
}

@media (max-width: 767px) {
  .photo-actions {
    right: 7px;
    bottom: 7px;
    gap: 6px;
    opacity: 1;
    pointer-events: auto;
    transform: none;
  }

  .photo-action {
    width: 34px;
    min-width: 34px;
    height: 34px;
    padding: 0;
    border-radius: 10px;
  }

  .photo-action-label {
    display: none;
  }

  .photo-caption {
    min-height: 40px;
    padding: 8px 9px;
  }

  .photo-preview-hint {
    display: none;
  }
}
</style>
