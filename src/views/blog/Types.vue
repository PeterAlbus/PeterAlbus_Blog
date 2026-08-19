<template>
  <Banner title="分类查看"/>
  <el-row class="main-container">
    <el-col :span="24">
      <div class="category-filter-scroll">
        <div class="category-filter" role="tablist" aria-label="文章分类">
          <button
            v-for="type in blogTypes"
            :key="type.value"
            type="button"
            role="tab"
            :aria-selected="selectType === type.value"
            :class="['category-tab', { 'is-active': selectType === type.value }]"
            @click="selectCategory(type.value)"
          >
            {{ type.label }}
          </button>
        </div>
        <label class="mobile-category-select" for="mobile-blog-category">
          <span>分类</span>
          <span class="mobile-select-control">
            <select
              id="mobile-blog-category"
              v-model.number="selectType"
              aria-label="选择文章分类"
              @change="handleCategoryChange"
            >
              <option v-for="type in blogTypes" :key="type.value" :value="type.value">
                {{ type.label }}
              </option>
            </select>
            <i aria-hidden="true" />
          </span>
        </label>
      </div>
    </el-col>
    <el-col :lg="{span:11,offset:3}" :sm="15">
      <div class="module">
        <h2 class="title">博文列表</h2>
        <el-card v-for="item in currentPageBlogs" :key="item.blogId"
                 shadow="hover" :body-style="{ padding: '0px' }">
          <el-row class="blog-card-row">
            <el-col :span="8">
              <el-image :src="item.blogImg" fit="cover" class="blog-cover"></el-image>
            </el-col>
            <el-col :span="16">
              <div class="blog-description">
                <router-link :to="{ path: '/blog',query:{id:item.blogId}}">
                  <h4 class="blog-title-row"><span class="blog-title-text">{{item.blogTitle}}</span><el-tag class="blog-title-tag" size="small">{{getType(item.blogType)}}</el-tag></h4>
                </router-link>
                <p class="blog-summary">{{item.blogDescription}}</p>
                <p class="info">
                  <span type="info"><el-icon style="vertical-align: -10%"><Avatar /></el-icon>{{ item.blogAuthor }}</span>
                  <span type="info"><el-icon style="vertical-align: -10%"><Clock /></el-icon>{{ item.blogTime }}</span>
                  <span type="info"><el-icon style="vertical-align: -10%"><StarFilled /></el-icon>{{ item.blogLike }}</span>
                </p>
              </div>
            </el-col>
          </el-row>
        </el-card>
        <div class="pagination-panel">
          <el-pagination v-if="screenWidth>=600"
              layout="total, sizes, prev, pager, next, jumper"
              :page-sizes="[5,10,20]"
              v-model:current-page="currentPage"
              v-model:page-size="pageSize"
              :total="selectedBlogs.length">
          </el-pagination>
          <el-pagination v-if="screenWidth<600"
                         layout="prev, pager, next"
                         :page-sizes="[5,10,20]"
                         v-model:current-page="currentPage"
                         v-model:page-size="pageSize"
                         :total="selectedBlogs.length">
          </el-pagination>
        </div>
      </div>
    </el-col>
    <el-col :lg="{span:6}" :sm="9">
      <div class="sticky-box">
        <PersonalInfo></PersonalInfo>
        <FriendLinks></FriendLinks>
      </div>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import FriendLinks from "@/components/FriendLinks.vue"
import PersonalInfo from "@/components/PersonalInfo.vue"
import Banner from "@/components/Banner.vue";
import { computed, onMounted, Ref, ref } from "vue";
import { fetchBlogList } from "@/services/blogApi";

const screenWidth:Ref<number> = ref(document.body.clientWidth);

const resize = () => {
  screenWidth.value = document.body.clientWidth;
};

const selectType:Ref<number> = ref(1);
const currentPage:Ref<number> = ref(1);
const pageSize:Ref<number> = ref(10);
const blogTypes = [
  { value: 0, label: '全部' },
  { value: 1, label: '学习笔记' },
  { value: 2, label: '生活' },
  { value: 3, label: 'ACG' },
  { value: 4, label: '科技' },
  { value: 5, label: '随笔' }
];
const blogList:Ref = ref([
  {
    blogId:1,
    blogTitle:'本站介绍',
    blogImg:'https://file.peteralbus.com/assets/blog/imgs/cover/cover1.jpg',
    blogType:1,
    blogDescription:'本站是如何建立的？',
    blogAuthor:'PeterAlbus',
    blogContent:'',
    blogTime:'2021-7-19',
    blogLike:18,
    blogViews:200,
    isTop:1
  }
]);

const getBlogList = () => {
  fetchBlogList().then(res => {
    blogList.value = res.data;
  });
};

const selectedBlogs = computed(() => {
  let selectedBlogs:Array<any> = [];
  for (const i of blogList.value) {
    if (i.blogType === selectType.value || selectType.value == 0) {
      selectedBlogs.push(i);
    }
  }
  selectedBlogs = selectedBlogs.reverse();
  return selectedBlogs;
});

const currentPageBlogs = computed(() => {
  return selectedBlogs.value.slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value);
});

const selectCategory = (type:number) => {
  if (selectType.value === type) return;
  selectType.value = type;
  currentPage.value = 1;
};

const handleCategoryChange = () => {
  currentPage.value = 1;
};

const getType = (type:number) => {
  return blogTypes.find((item) => item.value === type)?.label ?? '';
};

onMounted(() => {
  window.addEventListener('resize', resize);
  getBlogList();
});
</script>

<style scoped>
.main-container > :deep(.el-col:first-child) {
  margin-bottom: 20px;
}

.category-filter-scroll {
  width: 100%;
  padding: 0 20px 4px;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scroll-snap-type: x proximity;
  scrollbar-width: none;
}

.category-filter-scroll::-webkit-scrollbar {
  display: none;
}

.mobile-category-select {
  display: none;
}

.category-filter {
  display: flex;
  width: max-content;
  max-width: calc(100% - 40px);
  margin: 0 auto;
  padding: 6px;
  gap: 6px;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid var(--color-border);
  border-radius: 13px;
  box-shadow: 0 6px 18px rgba(30, 54, 36, 0.06), 0 1px 2px rgba(30, 54, 36, 0.04);
  backdrop-filter: blur(14px);
}

.category-tab {
  position: relative;
  min-width: 70px;
  height: 36px;
  padding: 0 13px;
  overflow: hidden;
  color: var(--color-text-secondary);
  background: rgba(250, 251, 249, 0.86);
  border: 1px solid var(--color-border);
  border-radius: 9px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.025em;
  white-space: nowrap;
  transition:
    color var(--transition-fast),
    background-color var(--transition-fast),
    border-color var(--transition-fast),
    box-shadow var(--transition-normal),
    transform var(--transition-normal);
}

.category-tab::after {
  position: absolute;
  right: 18%;
  bottom: 3px;
  left: 18%;
  height: 2px;
  border-radius: 99px;
  background: currentColor;
  content: "";
  opacity: 0;
  transform: scaleX(0.45);
  transition: opacity var(--transition-fast), transform var(--transition-normal);
}

.category-tab:hover:not(.is-active) {
  color: var(--color-primary-700);
  background: var(--color-primary-50);
  border-color: var(--color-border-strong);
  box-shadow: 0 4px 10px rgba(30, 54, 36, 0.06);
  transform: translateY(-1px);
}

.category-tab:active {
  transform: translateY(0) scale(0.985);
}

.category-tab:focus-visible {
  outline: 3px solid rgba(99, 163, 92, 0.2);
  outline-offset: 2px;
}

.category-tab.is-active {
  color: #fff;
  background: linear-gradient(145deg, var(--color-primary-600), var(--color-primary-700));
  border-color: rgba(40, 80, 50, 0.55);
  box-shadow: 0 6px 14px rgba(50, 97, 57, 0.19), inset 0 1px 0 rgba(255, 255, 255, 0.18);
  transform: translateY(-1px);
}

.category-tab.is-active::after {
  opacity: 0.42;
  transform: scaleX(1);
}

.pagination-panel {
  display: flex;
  justify-content: center;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

@media (max-width: 767px) {
  .main-container > :deep(.el-col) {
    width: 100%;
    max-width: 100%;
    flex: 0 0 100%;
  }

  .category-filter-scroll {
    padding: 0 12px 4px;
    overflow: visible;
    scroll-snap-type: none;
  }

  .category-filter {
    display: none;
  }

  .mobile-category-select {
    display: flex;
    width: min(100%, 420px);
    min-height: 48px;
    margin: 0 auto;
    padding: 6px 7px 6px 12px;
    align-items: center;
    gap: 12px;
    color: var(--color-text-secondary);
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid var(--color-border);
    border-radius: 13px;
    box-shadow: 0 6px 18px rgba(30, 54, 36, 0.06), 0 1px 2px rgba(30, 54, 36, 0.04);
    backdrop-filter: blur(14px);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.04em;
  }

  .mobile-select-control {
    position: relative;
    min-width: 0;
    flex: 1;
  }

  .mobile-select-control select {
    width: 100%;
    height: 34px;
    padding: 0 34px 0 12px;
    color: var(--color-primary-700);
    appearance: none;
    background: var(--color-primary-50);
    border: 1px solid var(--color-border-strong);
    border-radius: 9px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 650;
    outline: none;
    transition: border-color var(--transition-fast), box-shadow var(--transition-fast), background-color var(--transition-fast);
  }

  .mobile-select-control select:focus {
    background: #fff;
    border-color: var(--color-primary-500);
    box-shadow: 0 0 0 3px rgba(99, 163, 92, 0.12);
  }

  .mobile-select-control i {
    position: absolute;
    top: 50%;
    right: 13px;
    width: 7px;
    height: 7px;
    border-right: 2px solid var(--color-primary-600);
    border-bottom: 2px solid var(--color-primary-600);
    pointer-events: none;
    transform: translateY(-70%) rotate(45deg);
  }
}
</style>
