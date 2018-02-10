/**
* Created by guooug on 2017/6/16.
*/
<template lang="html">
  <div>
    <div class="right-menu-icon" ref="rightMenu" :class="className" :style="style" @click="openOrClose()"><i
      class="menu-icon icon-zyt-menu2"></i>
    </div>
    <mt-popup class="popup" v-model="popupVisible" position="right">
      <i class="topIcon icon-zyt-triangle-up"></i>
      <div class="list1"></div>
      <div class="list">
        <div class="item" @click="goToDoor(1)"><i class="icon icon-zyt-home"></i><span>首页</span></div>
        <div class="item" @click="goToCart()">
          <i class="icon-zyt-shopping-cart"><span class="tip" v-if="cartPrdNum>0">{{cartPrdNum}}</span></i>
          <span>购物车</span>
        </div>
        <div class="item" @click="goToMe()"><i class="icon-zyt-myself"></i><span>我的</span></div>
        <div class="item" @click="goToDoor(2)"><i class="icon-zyt-home3"></i><span>商家网站</span></div>
      </div>
    </mt-popup>
  </div>
</template>

<script>
  import {mapGetters} from 'Vuex'
  import Util from '@/service/common/utils/util.service'
  import ProductApi from '@/api/product/product.api'
  import UserApi from '@/api/user/user.api'
  import {Codes} from '@/config/config'
  export default {
    props: {
      scrollTop: {
        type: Number,
        default: 0
      }
    },
    data () {
      return {
        popupVisible: false,
        className: {},
        style: {},
        top: 44,
        opacityHeight: 150,
        doorId: this.$route.params.doorId,
        doorInfo: null, // 店铺信息,
        cartPrdNum: 0 // 购物车的数量
      }
    },
    watch: {
      scrollTop(val){
        if (val > this.top) {
          this.className = {
            show: true
          }
        } else {
          this.className = {
            show: false
          }
        }
        let opacity = val / this.opacityHeight
        opacity = opacity > 0.6 ? 0.6 : opacity
        this.style = {
          opacity: opacity
        }
      },
      'cartState': function () {
        this.getCartPrdNum()
      }
    },
    computed: {
      ...mapGetters(['hasAuth', 'cartState'])
    },
    methods: {
      openOrClose(){
        this.popupVisible = !this.popupVisible
        this.className.active = this.popupVisible
      },
      async getDoorInfo(){ // 获取店铺信息
        this.doorId = parseInt(this.$route.params.doorId)
        let data = await ProductApi.getDoorInfo({
          doorId: this.doorId
        })
        if (data) {
          this.doorInfo = data
        }
      },
      goToDoor(num){ // num；1跳转店铺首页 2：商家网站站点
        this.openOrClose()
        if (num === 1) {
          this.$router.push({name: 'indexDoor', params: {index: 0, doorId: this.$route.params.doorId}})
        } else {
          if (this.doorInfo.siteUrl) {
            Util.openUrl(this.doorInfo.siteUrl)
          } else {
            this.$router.push({name: 'indexDoor', params: {index: 0, doorId: this.$route.params.doorId}})
          }
        }
      },
      goToCart(){ // 跳转购物车
        this.openOrClose()
        this.$router.push({name: 'cart', params: {index: 2, doorId: this.$route.params.doorId}})
      },
      goToMe(){ // 跳转我的
        this.openOrClose()
        this.$router.push({name: 'me', params: {index: 3, doorId: this.$route.params.doorId}})
      },
      async getCartPrdNum(){
        if (this.hasAuth) {
          let data = await UserApi.getCartPrdNum().catch(e => {
          })
          if (data.code === Codes.success) {
            this.cartPrdNum = parseInt(data.data)
          }
        }
      }
    },
    created(){
      this.getDoorInfo()
      this.getCartPrdNum()
    },
    deactivated(){
      this.popupVisible = false
    },
    components: {}
  }
</script>

<style lang="scss" rel="stylesheet/scss" type="text/scss" scoped>
  .popup {
    width: 138px;
    border-radius: 10px;
    background: transparent;
    top: 136px;
    right: 6px;
    .topIcon {
      font-size: 26px;
      color: #000;
      opacity: 0.5;
      filter: alpha(opacity=50);
      position: relative;
      z-index: 1;
      right: -111px;
      top: -3px;
    }
    .list1 {
      width: 100%;
      height: 176px;
      background-color: #000;
      opacity: 0.5;
      filter: alpha(opacity=50);
      border-radius: 10px;
      margin-top: -12px;
    }
    .list {
      position: relative;
      z-index: 1;
      margin-top: -176px;
      border-radius: 10px;
      .item {
        height: 44px;
        display: flex;
        align-items: center;
        border-bottom: solid 1px #797879;
        padding-left: 28px;
        i {
          position: relative;
          margin-right: 10px;
          font-size: 22px;
          color: white;
          .tip {
            position: absolute;
            display: inline-block;
            padding: 2px 2px;
            font-size: 12px;
            background-color: red;
            color: white;
            border-radius: 50%;
            top: -8px;
            right: -12px;
            min-width: 16px;
            text-align: center;
          }
        }
        span {
          font-size: 15px;
          color: white;
        }
      }
      .item:last-child {
        border: none;
      }
    }
  }

  .right-menu-icon {
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 7px;
    right: 10px;
    width: 30px;
    height: 30px;
    z-index: 9999;
    opacity: 0;
    pointer-events: none;
    &.show {
      pointer-events: auto;
    }
    &.active {
      opacity: 1 !important;
    }
    .menu-icon {
      color: white;
    }
    &:after {
      content: '';
      display: block;
      position: absolute;
      height: 100%;
      width: 100%;
      background: black;
      opacity: .5;
      border-radius: 50%;
      top: 0px;
      left: 0px;
      z-index: -1;
    }
  }
</style>
