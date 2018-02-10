<template>
  <zyt-page :hasHeader="true">
    <div slot="header">
      header
    </div>
    <div slot="main">
      {{state}}
      <div v-if="userInfo">{{userInfo}}</div>
      <div v-for="(item,i) in new Array(2)" @click="test()">{{i}} test</div>
      <p @click="goDemo()" style="color: red;">跳转Demo页</p>
      <div v-for="(item,i) in new Array(30)" @click="clear()">{{i}} test</div>
    </div>

  </zyt-page>

</template>
<script>
  import {mapActions, mapGetters} from 'vuex'
  import {MountPage} from '@/components/page'
  export default {
    data(){
      return {
        state: 'start'
      }
    },
    created(){
      console.info(MountPage)
    },
    computed: {
      ...mapGetters(['userInfo'])
    },
    methods: {
      ...mapActions(['getUserToken']),
      goDemo () {
        this.$router.push('/demo')
      },
      async test1(t, flag = false){
        this.state = 'eee'
        let userInfo = await this.getUserToken({
          forceLogin: flag
        }).catch((data) => {
          console.info(data, userInfo)
        })
        console.info(userInfo)
        if (userInfo && userInfo.token) {
          this.state = 'success'
        } else {
          this.state = 'failure'
        }
      },
      test(){
        this.test1(1, true)
      }
    }
  }
</script>
<style lang='scss' rel='stylesheet/scss' scoped></style>
