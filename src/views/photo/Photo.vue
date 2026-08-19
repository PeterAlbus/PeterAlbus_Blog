<template>
  <Banner title="照片墙" description="会收录一些图片。点击可查看原图。"></Banner>
  <div class="main-container">
    <el-row>
      <el-col :lg="{span:11,offset:3}" :sm="15">
        <div class="photo-gallery-shell">
          <div v-if="isSiteOwner" class="photo-admin-bar">
            <div class="photo-admin-copy">
              <strong>照片管理</strong>
              <span>共 {{ photos.length }} 张照片</span>
            </div>
            <router-link class="photo-upload-link" to="/uploadPhoto">
              <el-icon><Upload /></el-icon>
              上传照片
            </router-link>
          </div>

          <div v-if="photos.length" class="photo-gallery">
            <el-card
              v-for="(item, index) in photos"
              :key="item.imgId"
              class="photo"
              shadow="never"
              :body-style="{ padding: '0px' }"
            >
              <PhotoItem
                :img-name="item.imgName"
                :img-id="item.imgId"
                :img-src="item.imgSrc"
                :img-thumb="item.imgThumb"
                :preview-src-list="photoPreviewList"
                :preview-index="index"
                @delete-photo="getPhotoList"
              />
            </el-card>
          </div>
          <el-empty v-else description="暂时还没有照片" />
        </div>
      </el-col>
      <el-col :lg="{span:6}" :sm="9">
        <div class="sticky-box">
          <PersonalInfo info="若有侵权，深表歉意。可联系删除"></PersonalInfo>
          <FriendLinks></FriendLinks>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import FriendLinks from "@/components/FriendLinks.vue"
import PersonalInfo from "@/components/PersonalInfo.vue"
import Banner from '@/components/Banner.vue'
import PhotoItem from "@/components/PhotoItem.vue";
import { computed, onMounted, ref } from "vue";
import { fetchPhotoList } from "@/services/photoApi";
import { useUserStore } from "@/stores/user";
import { Upload } from "@element-plus/icons-vue";

interface Photo {
  imgId: string;
  imgSrc: string;
  imgThumb: string;
  imgName: string;
}

const userStore = useUserStore();
const isSiteOwner = computed(() => userStore.userIdentity === 0);

const photoList = ref<Photo[]>([
  {
    imgId:'1',
    imgSrc:'https://file.peteralbus.com/assets/blog/imgs/cover/cover1.jpg',
    imgThumb:'https://file.peteralbus.com/assets/blog/imgs/cover/cover1.jpg',
    imgName:'loading'
  },
  {
    imgId:'2',
    imgSrc:'https://file.peteralbus.com/assets/blog/imgs/cover/8a0be7eaef3c44469200443affd26d33',
    imgThumb:'https://file.peteralbus.com/assets/blog/imgs/cover/cover1.jpg',
    imgName:'loading'
  },
  {
    imgId:'3',
    imgSrc:'https://file.peteralbus.com/assets/blog/imgs/cover/79f797340075430abcdc9b80fc908f66',
    imgThumb:'https://file.peteralbus.com/assets/blog/imgs/cover/cover1.jpg',
    imgName:'loading'
  },
])

const getPhotoList= ()=>{
  fetchPhotoList().then((res)=>{
    photoList.value=res.data
  })
};

onMounted(()=>{
  getPhotoList()
})

const photos = computed(() => [...photoList.value].reverse());
const photoPreviewList = computed(() => photos.value.map((item) => item.imgSrc));
</script>

<style scoped>
.photo-gallery-shell {
  width: 90%;
  margin: 0 auto;
}

.photo-admin-bar {
  display: flex;
  min-height: 64px;
  margin-bottom: 16px;
  padding: 10px 12px 10px 18px;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.photo-admin-copy {
  display: grid;
  min-width: 0;
  gap: 2px;
}

.photo-admin-copy strong {
  color: var(--color-heading);
  font-size: 15px;
  line-height: 1.4;
}

.photo-admin-copy span {
  color: var(--color-text-muted);
  font-size: 12px;
  line-height: 1.4;
}

.photo-upload-link {
  display: inline-flex;
  min-height: 40px;
  padding: 0 15px;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: #fff;
  background: var(--color-primary-500);
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(71, 125, 75, 0.18);
  font-size: 13px;
  font-weight: 600;
  transition: color var(--transition-fast), background-color var(--transition-fast), transform var(--transition-fast);
}

.photo-upload-link:hover {
  color: #fff;
  background: var(--color-primary-600);
  transform: translateY(-1px);
}

.photo-gallery {
  column-count: 3;
  column-gap: 16px;
}

.photo {
  display: inline-block;
  width: 100%;
  margin: 0 0 16px;
  padding: 0;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  break-inside: avoid;
  transition: border-color var(--transition-fast), box-shadow var(--transition-normal), transform var(--transition-normal);
}

.photo:hover {
  border-color: rgba(71, 125, 75, 0.24);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.photo :deep(.el-image) {
  display: block;
  overflow: hidden;
  min-height: 110px;
  background: var(--color-primary-50);
}

.photo :deep(.el-image__inner) {
  transition: transform 500ms cubic-bezier(0.2, 0.8, 0.2, 1), filter var(--transition-normal);
}

.photo:hover :deep(.el-image__inner) {
  filter: saturate(1.06);
  transform: scale(1.035);
}

.image-slot {
  display: grid;
  min-height: 120px;
  color: var(--color-text-muted);
  font-size: 12px;
  place-items: center;
}

@media (max-width: 767px) {
  .main-container :deep(.el-col.el-col-15),
  .main-container > .el-row > :deep(.el-col) {
    width: 100%;
    max-width: 100%;
    flex: 0 0 100%;
  }

  .photo-gallery-shell {
    width: calc(100% - 24px);
  }

  .photo-admin-bar {
    min-height: 60px;
    margin-bottom: 12px;
    padding: 9px 9px 9px 14px;
  }

  .photo-upload-link {
    min-height: 38px;
    padding: 0 12px;
  }

  .photo-gallery {
    column-count: 2;
    column-gap: 12px;
  }

  .photo {
    margin-bottom: 12px;
  }
}
</style>
