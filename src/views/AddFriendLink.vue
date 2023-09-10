<template>
  <Banner title="添加友情链接" />
  <div class="main-container">
    <el-row>
      <el-col :lg="{span:11,offset:3}" :sm="15">
        <div style="width: 90%">
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
</style>
