/**
* Created by guooug on 2017/6/16.
*/
<template>
  <div class="topBox">
    <div class="bgbox">
      <div class="left">
        <div class="imgBox">
          <div>
            <img :src="getHeaderImg()">
          </div>
        </div>
        <span v-if="hasAuth">{{userInfo.nickName}}</span>
        <span v-else @click="login">点击登录</span>
      </div>
      <div v-if="hasAuth" class="right" @click="goToAccountInfo()">
        <div>账户管理 <i class="icon-zyt-arrows-right"></i></div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'Vuex'
  import defaultHeaderImg from '@/assets/img/me/pic.png'
  import {Config} from '@/config/config'

  export default {
    computed: {
      ...mapGetters(['userInfo', 'hasAuth'])
    },
    methods: {
      ...mapActions(['getUserToken']),
      getHeaderImg() {
        if (this.hasAuth) {
          if (this.userInfo.headImg) {
            if (this.userInfo.headImg.indexOf('http') !== -1) {
              this.userInfo.headImg
            } else {
              return `${Config.imgPrefix}site/${this.userInfo.headImg}`
            }
            return this.userInfo.headImg
          }
          return defaultHeaderImg
        }
        return defaultHeaderImg
      },
      goToAccountInfo() {
        this.$router.push({
          name: 'accountInfo'
        })
      },
      login() {
        this.getUserToken({
          forceLogin: true
        })
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" type="text/scss" scoped>
  .topBox {
    .bgbox {
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-image: url("../../../assets/img/me/bg.png");
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
      .left {
        display: flex;
        align-items: center;
        & > span {
          font-size: 14px;
          color: white;
          margin-left: 14px;
          margin-top: 20px;
        }
        .imgBox {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-left: 13px;
          margin-top: 16px;
          div {
            border: solid 3px rgba(255, 255, 255, 0.28);
            border-radius: 50%;
            img {
              border-radius: 50%;
              display: block;
              width: 50px;
              height: 50px;
              border: none;
            }
          }
        }
      }
      .right {
        display: flex;
        align-items: center;
        margin-right: 24px;
        margin-top: 20px;
        color: white;
        heigt: 20px;
        line-height: 20px;
        i {
          margin-left: 8px;
          font-size: 16px;
        }
      }
    }
  }
</style>
