<template>
  <top-nav-bar></top-nav-bar>
  <router-view/>
  <Footer></Footer>
</template>

<script>
import TopNavBar from "@/components/TopNavBar";
import Footer from "@/components/Footer";
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
</style>
