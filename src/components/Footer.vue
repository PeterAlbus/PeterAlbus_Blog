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

let screenWidth = ref(document.body.clientWidth)
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
  background: #373D41;
  border-top: 10px solid #326139;
  position: relative;
  text-align: center;
}

.footer-text{
  color: #73777a;
  font-size: 14px;
  margin-bottom: 5px;
}

.footer-text a:hover{
  color:#ffffff;
}

.footer-text a{
  color: #73777a;
}

.footer-container {
  width: 60%;
  margin: 0 auto;
  overflow: hidden;
  padding: 30px 0;
}

.music-container {
  position: fixed;
  width: 15%;
  right: 0;
  bottom: 120px;
}
</style>
