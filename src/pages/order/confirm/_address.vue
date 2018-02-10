/**
* Created by guooug on 2017/6/16.
*/
<template lang="html">
  <div v-if="isOnline" class="address-container space-between" @click="click()">
    <div v-if="address.receiverMobile" class="padding">
      <p class="mobile-name">{{address.receiverName}} {{address.receiverMobile}}</p>
      <p><i class="icon-zyt-location icon"></i>{{addressStr}}</p>
    </div>
    <div v-else class="add-address padding">
      添加收货地址
    </div>
    <div class="icon-container">
      <i class="icon icon-zyt-arrows-right"></i>
    </div>
  </div>
</template>
<script>
  //  这是一个过渡界面，所有的参数都由前一个界面提供，如果获取不到数据（用户刷新，则退回到上一个界面）
  import {mapActions, mapGetters} from 'Vuex'
  export default {
    props: {
      isOnline: {
        type: Boolean,
        default: false
      },
      address: {
        type: Object,
        default: () => {
          return {}
        }
      }
    },
    computed: {
      ...mapGetters(['userInfo']),
      addressStr(){
        if (this.address.provinceName) {
          return `${this.address.provinceName}${this.address.cityName}${this.address.countryName} ${this.address.detail}`
        }
        return ''
      }
    },
    methods: {
      ...mapActions(['getUserInfo']),
      click(){
        if (this.address && this.address.receiverMobile) {
          this.goToAddressList()
        } else {
          this.goToAddAddressList()
        }
      },
      goToAddressList(){
        this.$router.push({
          name: 'addressList'
        })
      },
      goToAddAddressList(){
        this.$router.push({
          name: 'addAddress',
          params: {
            addressId: 0 // 新增收货地址
          }
        })
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" type="text/scss" scoped>

  @import "../../../assets/css/variables-primary";

  .footer {
    height: 49px;
  }

  .order-statistics {
    padding: 10px;
  }

  .address-container {
    align-items: center;
    vertical-align: middle;
    position: relative;
    min-height: 50px;
    margin-bottom: 3px;
    &:after {
      width: 100%;
      content: '';
      display: block;
      position: absolute;
      bottom: -3px;
      left: 0;
      height: 3px;
      background-image: url('../../../assets/img/me/tiao.png');
      background-repeat: repeat-x;
      background-position: bottom;
    }
    .mobile-name {
      font-size: 16px;
      padding: 3px 0;
    }
  }

  .space-between {
    .icon-container {
      min-width: 30px;
      width: 30px;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .padding {
    padding: 5px 10px;
  }
</style>
