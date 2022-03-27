<template>
  <Banner title="用户中心"></Banner>
  <div class="main-container">
    <el-button @click="logout">登出</el-button>
  </div>
</template>

<script setup lang="ts">
import Banner from '@/components/Banner.vue'
import axios from "axios";
import {ElMessage} from "element-plus";
import router from "@/router";

const logout = () => {
  axios.get('/user/logout')
      .then((res)=>{
        ElMessage.success('登出成功');
        localStorage.removeItem("token")
        router.push('/')
      })
}
</script>

<style scoped>

</style>
