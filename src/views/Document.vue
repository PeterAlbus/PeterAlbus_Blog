<template>
  <div class="banner">
    <div class="banner-container">
      <div>
        <h1>归档</h1>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Document"
}
</script>

<style scoped>
.banner {
  position: relative;
  top: 0;
  left: 0;
  right: 0;
  height: 30vh;
  background: url("../assets/background.jpg") no-repeat fixed center center;
  text-align: center;
  color: #fff !important;
}

.banner-container {
  position: absolute;
  width: 100%;
  margin-top: 13vh;
  line-height: 1.5;
  color: #eee;
}
</style>