<template>
  <el-config-provider :locale="locale">
    <TopNavBar />
    <RouterView />
    <Footer />
  </el-config-provider>
</template>

<script setup lang="ts">
import TopNavBar from "@/components/TopNavBar.vue";
import Footer from "@/components/Footer.vue";
import { RouterView } from "vue-router";
import zhCn from "element-plus/dist/locale/zh-cn.mjs"
import { ref } from "vue";

const locale = ref(zhCn)
</script>

<style scoped>
</style>
