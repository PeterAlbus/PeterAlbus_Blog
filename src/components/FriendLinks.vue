<template>
  <div class="module">
    <h2 class="title"><el-icon style="vertical-align: -10%"><link-icon /></el-icon>友情链接</h2>
    <div class="content paragraph">
      <p v-for="item in friendLinkList"><a :href="item.linkUrl" target="_blank">{{ item.linkName }}</a></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import {Link as LinkIcon} from "@element-plus/icons-vue";
import {onMounted, ref} from "vue";
import axios from "axios";

let friendLinkList=ref([
  {
    linkId: 1,
    linkName: 'loading',
    linkUrl: '#'
  }
])

const getFriendLinkList=function () {
  axios.get('friendLink/getFriendLinkList')
      .then(res => {
        friendLinkList.value = res.data;
      })
}

onMounted(()=>{
  getFriendLinkList()
})
</script>

<style scoped>

</style>
