<template>
  <div>
    商家PC底部
  </div>
</template>

<script>
  import test from '../../../src/api/test';
  export default {
    name: 'HelloWorld',
    mounted () {
      test.call(this,{})
    },
    data () {
      return {
        msg: 'Welcome to Your Vue.js App'
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  /*@import "./less/index.less";*/
</style>
