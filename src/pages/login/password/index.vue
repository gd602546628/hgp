/**
* Created by guooug on 2017/6/16.
*/
<template lang="html">
  <zyt-page >
    <div slot="main" class="page-container">
      <!--密码登录-->
      <from-component :data="data" @getSmsMsg="getSmsMsg" @submit="submit"></from-component>
    </div>
  </zyt-page>
</template>

<script>
  import Util from '@/service/common/utils/util.service'
  import {Codes} from '@/config/config'
  import LoginApi from '@/api/login/login.api'
  import FromComponent from './_form'
  export default {
    name: 'changePassword',
    data () {
      return {
        data: {
          mobile: '',
          smsCode: '',
          password: '',
          source: 0,
          type: 1
        }
      }
    },
    created(){
      if (this.$route.params.mobile) {
        this.data.mobile = this.$route.params.mobile
      }
    },
    methods: {
      back(){
        this.$router.back()
      },
      /**
       * 获取短信登录的短信验证码
       * @returns {Promise.<void>}
       */
      async getSmsMsg(params){
        let result = await LoginApi.getSmsMsg(params)
        if (result.code !== Codes.success) {
          Util.alert({message: result.mesg})
        }
      },

      async submit(params){
        let result = await LoginApi.register(params)
        if (result.code === Codes.success) {
          this.back()
        } else {
          Util.alert({
            message: result.mesg
          })
        }
      }
    },
    components: {
      'from-component': FromComponent
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" type="text/scss" scoped>
  @import "../common";

  form {
    p {
      text-align: left;
      padding: 10px;
      padding-bottom: 0px;
      font-size: 13px;
      color: map_get($ComColors, gray);
    }
    .line {
      &.msg-container {
        position: relative;
        padding-right: 110px;
        button {
          position: absolute;
          right: 10px;
          top: 10%;
          height: 80%;
          padding: 0 10px;
          border: 0px;
          border-radius: 5px;
          background: map_get($ComColors, wathet-blue);
          color: white;
          font-size: 15px;
          &[disabled] {
            background: map_get($ComColors, gray-c);;
          }
        }
      }
    }
  }
</style>
