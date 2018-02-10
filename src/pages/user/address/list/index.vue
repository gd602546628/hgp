/**
* Created by guooug on 2017/6/16.
*/
<template>
  <zyt-page :hasFooter="true">
    <div slot="main">
      <div v-for="address in addressList">
        <div class="space-between chose-container">
          <div @click="setDefault(address)">
            <i class="icon chose" :class="[address.isDefault?'icon-zyt-chose':'icon-zyt-circle']"></i>
            使用该地址
          </div>
          <div @click="delAddressInPage(address.addressId)" class="delete"><i class="icon-zyt-delete icon"></i>删除</div>
        </div>
        <div class="space-between">
          <div class="address-info">
            <p>{{address.receiverName}} {{address.receiverMobile}}</p>
            <p><i class="icon-zyt-location icon"></i> {{addressStr(address)}}</p>
          </div>
          <div class="editor" @click="goToUpdateAddress(address)">
            <i class="icon-zyt-compile icon"></i>
          </div>
        </div>
      </div>
    </div>
    <div slot="footer">
      <button class="common-submit-btn" @click="goToAddAddress()">
        新增收货地址
      </button>
    </div>
  </zyt-page>
</template>
<script>
  import {mapGetters, mapActions} from 'Vuex'
  import ToastService from '@/service/toast/toast.service'
  import Util from '@/service/common/utils/util.service'
  export default {
    name: 'addressList',
    computed: {
      ...mapGetters(['userInfo', 'hasAuth']),
      addressList(){
        if (this.userInfo && this.userInfo.addressList) {
          return this.userInfo.addressList
        } else {
          return []
        }
      }
    },
    watch: {
      'hasAuth': this.init
    },
    methods: {
      ...mapActions(['getUserInfo', 'setDefaultAddress', 'delAddress']),
      init(){
        this.getUserInfo({
          address: true
        })
      },
      addressStr(address){
        if (address.provinceName) {
          return `${address.provinceName}${address.cityName}${address.countryName} ${address.detail}`
        }
        return ''
      },
      async delAddressInPage(id){
        let confirm = await Util.confirm({
          message: '是否删除该地址'
        })
        if (confirm !== 'confirm') {
          return
        }
        let result = await this.delAddress(id).catch(e => {
          ToastService.bottom(e)
        })
        ToastService.bottom(result)
      },
      async setDefault(address){
        let confirm = await Util.confirm({
          message: '是否设置为默认地址'
        })
        if (confirm !== 'confirm') {
          return
        }
        let result = await this.setDefaultAddress({
          addressId: address.addressId
        }).catch(e => {
          ToastService.bottom(e)
        })
        ToastService.bottom(result)
      },
      goToAddAddress(){
        this.$router.push({
          name: 'addAddress',
          params: {
            addressId: 0
          }
        })
      },
      goToUpdateAddress(address){
        this.$router.push({
          name: 'addAddress',
          params: {
            addressId: address.addressId
          }
        })
      }
    },
    created(){
      this.init()
    },
    components: {}
  }
</script>
<style lang="scss" rel="stylesheet/scss" type="text/scss" scoped>
  @import "../../../../assets/css/variables-primary";

  button {
    height: 49px;
  }

  .space-between {
    align-items: center;
    padding: 0 10px;
    &.chose-container {
      background-color: map_get($ComColors, e5);
      > div {
        height: 48px;
        display: flex;
        align-items: center;
      }
    }
  }

  .icon {
    font-size: 24px;
    padding-right: 5px;
  }

  .icon-zyt-chose {
    color: map_get($ComColors, yellow-f);
  }

  .delete {
    color: map_get($ComColors, wathet-blue);
    .icon-zyt-delete {
      font-size: 24px;
    }
  }

  .address-info {
    max-width: 80%;
    padding-top: 5px;
    padding-bottom: 10px;
    p {
      width: 100%;
      min-height: 25px;
      display: flex;
    }
    .icon {
      font-size: 20px;
    }
  }

  .editor {
    height: 100%;
    width: 30px;
    display: flex;
    align-items: center;
    .icon {
      font-size: 30px;
      color: map_get($ComColors, wathet-blue);
    }
  }
</style>
