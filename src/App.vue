<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <tasks />
</template>

<script>
import tasks from './components/tasks.vue'


export default {
  name: 'App',
  components: {
    tasks
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
