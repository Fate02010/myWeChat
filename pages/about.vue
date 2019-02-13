<template>
  <section class="container">
    <img src="../static/img/logo.png" alt="Nuxt.js Logo" class="logo"/>
  </section>
</template>
<script>
  import {mapState} from 'vuex'

  export default {
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
      const wx = window.wx;
      const url = window.location.href;
      this.$store.dispatch('getWechatSignature', url)
        .then(res => {
          if (res.data.success) {
            console.log('服务端返回');
            console.log(res.data.params);
            const params = res.data.params;
            wx.config({
              debug: true,
              appId: params.appId,
              timestamp: params.timestamp,
              nonceStr: params.noncestr,
              signature: params.signature,
              jsApiList: [
                'chooseImage',
                'previewImage',
                'uploadImage',
                'downloadImage',
                'onMenuShareTimeline',
                'hideAllNonBaseMenuItem',
                'showMenuItems'
              ]
            });

            wx.ready(() => {
              wx.hideAllNonBaseMenuItem();
              console.log('success');
            })
          }
        })

    }

  }
</script>

<style scoped>
  .title {
    margin-top: 50px;
  }

  .info {
    font-weight: 300;
    color: #9aabb1;
    margin: 0;
    margin-top: 10px;
  }

  .button {
    margin-top: 50px;
  }
</style>
