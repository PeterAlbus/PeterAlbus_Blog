<template>
  <Banner title="分类查看"/>
  <el-row class="main-container">
    <el-col :span="24">
      <el-row>
        <el-col :lg="{span:16,offset:4}">
          <el-radio-group v-model="selectType" size="large" v-if="screenWidth>=500">
            <el-radio-button :label="1">学习笔记</el-radio-button>
            <el-radio-button :label="2">生活</el-radio-button>
            <el-radio-button :label="3">ACG</el-radio-button>
            <el-radio-button :label="4">科技</el-radio-button>
            <el-radio-button :label="5">随笔</el-radio-button>
          </el-radio-group>
          <el-radio-group v-model="selectType" size="small" v-if="screenWidth<500">
            <el-radio-button :label="1">学习笔记</el-radio-button>
            <el-radio-button :label="2">生活</el-radio-button>
            <el-radio-button :label="3">ACG</el-radio-button>
            <el-radio-button :label="4">科技</el-radio-button>
            <el-radio-button :label="5">随笔</el-radio-button>
          </el-radio-group>
        </el-col>
      </el-row>
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
  let selectedBlogs = [];
  for (const i of blogList.value) {
    if (i.blogType === selectType.value) {
      selectedBlogs.push(i);
    }
  }
  selectedBlogs = selectedBlogs.reverse();
  return selectedBlogs;
});

const currentPageBlogs = computed(() => {
  return selectedBlogs.value.slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value);
});

const getType = (type:number) => {
  const types = ['学习笔记', '生活', 'ACG', '科技', '随笔'];
  return types[type - 1];
};

onMounted(() => {
  window.addEventListener('resize', resize);
  getBlogList();
});
</script>

<style scoped>
.main-container > :deep(.el-col:first-child) {
  margin-bottom: 24px;
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
}
</style>
