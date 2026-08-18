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
.content {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.content p {
  margin: 0;
}

.content a {
  display: block;
  overflow: hidden;
  padding: 8px 10px;
  color: var(--color-text-secondary);
  background: var(--color-surface-soft);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color var(--transition-fast), background-color var(--transition-fast), transform var(--transition-fast);
}

.content a:hover {
  color: var(--color-primary-600);
  background: var(--color-primary-50);
  transform: translateY(-1px);
}
</style>
