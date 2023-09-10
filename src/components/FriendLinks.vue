<template>
  <div class="module">
    <h2 class="title"><el-icon style="vertical-align: -10%"><Link /></el-icon> 友情链接</h2>
    <div class="content paragraph">
      <p v-for="item in friendLinkList" :key="item.linkId">
        <a :href="item.linkUrl" target="_blank">{{ item.linkName }}</a>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {fetchFriendLinkList} from "@/services/friendLinkApi";

const friendLinkList=ref([
  {
    linkId: 1,
    linkName: 'loading',
    linkUrl: '#'
  }
])

const getFriendLinkList=function () {
  fetchFriendLinkList()
      .then(res=>{
        friendLinkList.value=res.data
      })
}

onMounted(()=>{
  getFriendLinkList()
})
</script>

<style scoped>

</style>
