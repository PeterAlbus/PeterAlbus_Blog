<template>
  <top-nav-bar></top-nav-bar>
  <router-view/>
  <Footer></Footer>
</template>

<script>
import TopNavBar from "@/components/TopNavBar.vue";
import Footer from "@/components/Footer.vue";
export default {
  name:'App',
  components: {Footer, TopNavBar}
}

</script>

<style lang="scss">
/***************** CSS重置 *******************/
html,body,div,span,h1,h2,h3,h4,h5,h6,ul,ol,li,p{
  margin: 0;
  padding: 0;
}

a {
  text-decoration: none;
}

.router-link-active {
  text-decoration: none;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.main-container{
  padding-top: 20px;
  padding-bottom: 20px;
  margin: 0;
  background-color: #eeeeee;
  min-height: 60vh;
}

.main-container a{
  color: black;
}

.main-container a:hover{
  color: #4B6186;
}

.module{
  position: relative;
  margin: 0 auto;
  width: 90%;
}

.paragraph{
  padding: 10px;
}

//用于博客列表
.blog-cover{
  height: 170px;
  width: 100%;
}

.title {
  position: relative;
  margin: 0;
  padding: 6px 20px;
  height: 20px;
  border-bottom: 1px solid #eaeaea;
  border-radius: 5px 5px 5px 5px;
  background-color: #f7f7f7;
  font-weight: 400;
  font-size: 15px;
  line-height: 20px;
  text-align: left;
}

.content {
  position: relative;
  background-color: #fff;
  border-radius: 5px 5px 5px 5px;
}

.module{
  position: relative;
  margin: 0 auto;
  width: 90%;
  padding: 8px;
}

.blog-description{
  text-align: left;
  height: 150px;
  padding: 10px;
}

.info{
  height: 20px;
}

.info span{
  font-size: smaller;
}
</style>
