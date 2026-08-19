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
  display: grid;
  min-height: 250px;
  height: 32vh;
  overflow: hidden;
  place-items: center;
  background-position: center center;
  background-attachment: fixed;
  background-size: cover;
  background-repeat: no-repeat;
  text-align: center;
  color: #fff !important;
}

.banner::before {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(13, 27, 18, 0.24), rgba(13, 27, 18, 0.58)),
    radial-gradient(circle at center, transparent 0%, rgba(10, 20, 13, 0.18) 100%);
  content: "";
}

.banner-container {
  position: relative;
  z-index: 1;
  width: 100%;
  margin-top: 34px;
  padding: 0 24px;
  color: rgba(255, 255, 255, 0.88);
}

.banner-container h1 {
  margin: 0;
  color: #fff;
  font-size: clamp(30px, 4vw, 46px);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: 0.08em;
  text-shadow: 0 6px 22px rgba(0, 0, 0, 0.25);
}

.banner-container p {
  margin: 12px 0 0;
  font-size: 14px;
  letter-spacing: 0.04em;
}

@media (max-width: 767px) {
  .banner {
    min-height: 210px;
    height: 28vh;
    background-attachment: scroll !important;
  }

  .banner-container {
    margin-top: 0;
  }
}
</style>
