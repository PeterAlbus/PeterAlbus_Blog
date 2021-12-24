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
  </div>
</template>

<script>
export default {
  name: "Footer"
}
</script>

<style scoped>
.footer{
  width: 100%;
  overflow: hidden;
  background: #373D41;
  border-top: 10px solid #4B6186;
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
</style>