/**
* Created by guooug on 2017/6/16.
*/
<template>
  <zyt-page>
    <div slot="main">
      <div class="space-between" @click="updateNickName()">
        <p>昵称</p>
        <p v-if="userInfo">{{userInfo.nickName}} <i class="icon icon-zyt-arrows-right"></i></p>
      </div>
      <div class="space-between" @click="goToAddressList()">
        <p>收货地址</p>
        <p><i class="icon icon-zyt-arrows-right"></i></p>
      </div>
      <div class="btn-container" v-if="!isNative" @click="logoutFun()">
        <button>退出登录</button>
      </div>
    </div>
    <div slot="other">
      <update-name v-if="userInfo" ref="updateName" :nick-name="userInfo.nickName"></update-name>
    </div>
  </zyt-page>
</template>
<script>
  import {mapGetters, mapActions} from 'Vuex'
  import Native from '@/service/common/native/native.service'
  import UpdateName from './_updata-name'
  export default {
    name: 'accountInfo',
    computed: {
      ...mapGetters(['userInfo']),
      isNative(){
        return Native.isApp()
      }
    },
    methods: {
      ...mapActions(['logout']),
      async logoutFun(){
        await this.logout()
        this.$router.back()
      },
      updateNickName(){
        this.$refs.updateName.open()
      },
      goToAddressList(){
        this.$router.push({
          name: 'addressList'
        })
      }
    },
    components: {
      'update-name': UpdateName
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" type="text/scss" scoped>

  @import "../../../assets/css/variables-primary";

  .space-between {
    align-items: center;
    padding: 0 10px;
    height: 40px;
    border-bottom: 1px solid map_get($ComBorderColor, dd);
  }

  .btn-container {
    width: 100%;
    padding: 10px 20px;
    button {
      border-radius: 5px;
      width: 100%;
      height: 40px;
      text-align: center;
      color: white;
      font-size: 16px;
      background-color: map_get($ComColors, wathet-blue);
    }
  }

</style>
