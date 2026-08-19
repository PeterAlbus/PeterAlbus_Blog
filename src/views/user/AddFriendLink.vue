<template>
  <Banner title="添加友情链接" />
  <div class="main-container">
    <el-row>
      <el-col :lg="{span:11,offset:3}" :sm="15">
        <div class="friend-form">
          <el-form>
            <el-form-item label="友情链接名称">
              <el-input v-model="friendLink.linkName"></el-input>
            </el-form-item>
            <el-form-item label="友情链接地址">
              <el-input v-model="friendLink.linkUrl"></el-input>
            </el-form-item>
            <el-button v-on:click="submitLink" type="success" round>添加</el-button>
          </el-form>
        </div>
      </el-col>
      <el-col :lg="{span:6}" :sm="9">
        <PersonalInfo />
        <FriendLinks />
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, Ref, ref } from "vue";
import { addFriendLink, fetchFriendLinkList } from "@/services/friendLinkApi";
import Banner from "@/components/Banner.vue";
import PersonalInfo from "@/components/PersonalInfo.vue";
import FriendLinks from "@/components/FriendLinks.vue";

const friendLink: any = reactive({
  linkName: "",
  linkUrl: "#"
});

const friendLinkList: Ref = ref([
  {
    linkId: 1,
    linkName: "loading",
    linkUrl: "#"
  }
]);

const getFriendLinkList = () => {
  fetchFriendLinkList().then(res => {
    friendLinkList.value = res.data;
  });
};

const submitLink = () => {
  addFriendLink(friendLink).then(res => {
    getFriendLinkList()
  })
};

onMounted(() => {
  getFriendLinkList();
});
</script>

<style scoped>
.friend-form {
  width: 90%;
  margin: 0 auto;
  padding: clamp(22px, 4vw, 36px);
  background: rgba(255, 255, 255, 0.97);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
}

@media (max-width: 767px) {
  .main-container :deep(.el-col) {
    width: 100%;
    max-width: 100%;
    flex: 0 0 100%;
  }

  .friend-form {
    width: calc(100% - 24px);
    margin-bottom: 18px;
    padding: 20px 16px;
    border-radius: var(--radius-lg);
  }
}
</style>
