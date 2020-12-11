<template>
  <div id="app" >
    <img src="./assets/logo1.png" height="70px" width="130px">
    <!-- <hello></hello> -->
    <router-view />

  </div>
  
</template>

<script>
// import Hello from './components/Hello'

export default {
  name: 'app',
  components: {
    // Hello
    
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  /* color: white ; */
}
</style>
