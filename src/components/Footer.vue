<template>
  <div class="footer">
    <div class="footer-container">
      <div class="footer-text">Copyright © 2021 - {{ new Date().getFullYear() }} PeterAlbus All Rights Reserved.</div>
            <div class="footer-text">
              <a href="http://beian.miit.gov.cn/" target="_blank">
                沪ICP备2021020777号
              </a>
            </div>
    </div>
    <div style="height: 61px" v-if="screenWidth<640"></div>

  </div>
  <div class="music-container">
    <MusicPlayer></MusicPlayer>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue"
import MusicPlayer from '@/components/MusicPlayer.vue'

const screenWidth = ref(document.body.clientWidth)
const resize = function (){
  screenWidth.value = document.body.clientWidth
}

onMounted(()=>{
  window.addEventListener('resize',resize)
})
</script>

<style scoped>
.footer{
  width: 100%;
  overflow: hidden;
  background: linear-gradient(135deg, #29342d 0%, #343c37 100%);
  border-top: 4px solid #326139;
  position: relative;
  text-align: center;
}

.footer-text{
  color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
  margin-bottom: 4px;
  letter-spacing: 0.025em;
}

.footer-text a:hover{
  color:#ffffff;
}

.footer-text a{
  color: rgba(255, 255, 255, 0.5);
}

.footer-container {
  width: min(90%, 880px);
  margin: 0 auto;
  overflow: hidden;
  padding: 32px 0 29px;
}

.music-container {
  position: fixed;
  width: 15%;
  right: 0;
  bottom: 120px;
}

@media (max-width: 767px) {
  .footer-container {
    padding: 25px 0 22px;
  }

  .music-container {
    width: 44%;
  }
}
</style>
