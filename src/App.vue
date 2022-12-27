<template>
  <Toper></Toper>
  <div class="wrap">
    <Nav></Nav>
    <div class="main">
      <router-view></router-view>
    </div>
  </div>
  
</template>

<script setup>
import axios from 'axios'
import {onMounted} from 'vue'
import Toper from './components/Toper.vue'
import Nav from './components/Nav.vue'
window.title = '忘川幽城'



onMounted(() => {
  //console.log('mounted');
})

</script>
<script>
export default {
  name: 'App'
}
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  /* background: url(./assets/bg.jpg) right top no-repeat; */
}
.wrap {
  flex: 1;
  height: 100%;
  display: flex;
  background-color: #545c64;
}
.main{
  flex: 1;
  padding:10px;
  background-color: #fff;
}
</style>