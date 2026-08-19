<template>
  <div class="module">
    <div class="content paragraph">
      <el-avatar :size="50" src="https://file.peteralbus.com/assets/blog/imgs/blog_avatar.png"></el-avatar>
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
.content {
  padding: 24px 18px 20px;
  background:
    linear-gradient(180deg, rgba(232, 240, 229, 0.7) 0, rgba(255, 255, 255, 0.95) 72px);
}

.content h4 {
  margin: 8px 0 4px;
  font-size: 16px;
}

.content p {
  margin: 0 0 12px;
  color: var(--color-text-secondary);
  font-size: 12px;
}

.content a {
  display: inline-grid;
  width: 36px;
  height: 36px;
  margin: 4px 2px 0;
  color: var(--color-primary-700);
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: 50%;
  box-shadow: var(--shadow-sm);
  place-items: center;
  transition: color var(--transition-fast), transform var(--transition-fast), box-shadow var(--transition-fast);
}

.content a:hover {
  color: var(--color-primary-500);
  box-shadow: 0 7px 18px rgba(30, 54, 36, 0.12);
  transform: translateY(-2px);
}
</style>
