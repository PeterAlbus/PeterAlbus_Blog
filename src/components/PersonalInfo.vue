<template>
  <div class="module">
    <div class="content paragraph">
      <el-avatar :size="50" src="/assets/2.png"></el-avatar>
      <h4>PeterAlbus</h4>
      <p v-if="info!==''">{{ info }}</p>
      <el-tooltip class="item" effect="dark" content="发送电子邮件" placement="top">
        <a href="mailto:wuhongdb@163.com">
          <i class="fa fa-fw fa-envelope" style="font-size:20px"></i>
        </a>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="github" placement="top">
        <a href="https://github.com/PeterAlbus" target="_blank">
          <i class="fa fa-fw fa-github" style="font-size:20px"></i>
        </a>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="bilibili" placement="top">
        <a href="https://space.bilibili.com/2003822" target="_blank">
          <i class="iconfont icon-bilibili-line" style="font-size:20px"></i>
        </a>
      </el-tooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
import {toRefs} from "vue";

const props = defineProps({
  info: {
    type: String,
    default() {
      return ''
    },
  },
});

const {info} = toRefs(props);
</script>

<style scoped>

</style>
