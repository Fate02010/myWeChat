/**
* Created by 麦锦超 on 2018/11/4.
*/
<template>
  <section class="container">
    <h1>认证界面</h1>
  </section>
</template>

<script>
  export default {
    name: "",
    asyncData({req}) {
      return {
        name: req ? 'server' : 'client'
      }
    },
    head() {
      return {
        title: `测试页面`
      }
    },
    beforeMount() {
      const url = window.location.href;
      console.log(url);
      this.$store.dispatch('getUserByOAuth', encodeURIComponent(url))
        .then(res => {
           if(res.data.success) {
             console.log(res.data);
           }
        })

    }

  }
</script>

<style scoped>

</style>
