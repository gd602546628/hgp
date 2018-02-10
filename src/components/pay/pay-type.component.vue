/**
* Created by guooug on 2017/6/16.
*/

<template lang="html">
  <div class="pay-type-container">
    <div v-if="hasAliPay" @click="change(0)">
      <div class="blankDiv"></div>
      <div class="row pay-type">
        <div class="col col-left">
          <i class="icon icon-zyt-zhifubao"></i>
        </div>
        <p class="col">支付宝支付</p>
        <div class="col col-right">
          <i class="icon icon-zyt-select" :class="selected(0)"></i>
        </div>
      </div>
    </div>
    <div v-if="hasWxPay" @click="change(1)">
      <div class="blankDiv"></div>
      <div class="row pay-type">
        <div class="col col-left">
          <i class="icon icon-zyt-weixin"></i>
        </div>
        <div class="col">
          <p>微信支付</p>
          <p class="smaller">推荐安装微信5.0及以上版本的用户使用</p>
        </div>
        <div class="col col-right">
          <i class="icon icon-zyt-select" :class="selected(1)"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Native from '@/service/common/native/native.service'
  import WeixinService from '@/service/weixin/weixin.service'
  export default {
    props: ['value'],
    data(){
      return {
        currentValue: this.value
      }
    },
    computed: {
      hasAliPay(){
        return Native.isApp() || !WeixinService.isWeixin()
      },
      hasWxPay(){
        return Native.isApp() || WeixinService.isWeixin()
      }
    },
    methods: {
      change(val){
        this.currentValue = val
      },
      selected(val){
        return {
          selected: this.currentValue === val
        }
      }
    },
    watch: {
      value(val){
        this.currentValue = val
      },
      currentValue(val) {
        this.$emit('input', val)
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" type="text/scss" scoped>
  @import "../../assets/css/variables-primary";

  .pay-type-container {
    .pay-type {
      padding: 5px 10px;
      .col-left {
        font-size: 30px;
        max-width: 30px;
      }
      .col-right {
        font-size: 24px;
        max-width: 30px;
        .selected {
          color: map_get($ComColors, wathet-blue);
        }
      }
      .smaller {
        font-size: 10px;
      }
      &:last-child {
        border-bottom: 1px solid map_get($ComBorderColor, dd);
      }
    }
  }

</style>
