<template>
  <div class="banner" :style="{backgroundImage:'url('+backgroundUrl+')'}">
    <div class="banner-container">
      <div>
        <h1>{{ title }}</h1>
        <p v-if="description!==''">{{description}}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default() {
      return ''
    },
  },
  description: {
    type: String,
    default() {
      return ''
    },
  },
  backgroundUrl: {
    type: String,
    default() {
      return 'https://file.peteralbus.com/assets/blog/static/background/background-kazuha.jpg'
    },
  }
});
</script>

<style scoped>
.banner {
  position: relative;
  top: 0;
  left: 0;
  right: 0;
  height: 30vh;
  text-align: center;
  color: #fff !important;
  background-position: center center;
  background-attachment: fixed;
  background-size: cover;
  background-repeat: no-repeat;
}

.banner-container {
  position: absolute;
  width: 100%;
  margin-top: 13vh;
  line-height: 1.5;
  color: #eee;
}
</style>
