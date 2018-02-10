/**
* Created by guooug on 2017/6/16.
*/
<template lang="html">
  <!--product.standard 1:多规格，0 单规格-->
  <div>
    <div @click="getCoupon()" class='tip-container' v-if="couponList.length>0">
      <span class="tip">领券</span>
      <div class="list">
        <p v-for="(coupon,index) in couponList" v-if="index<2">{{coupon.discountMoney}}元店铺优惠券</p>
      </div>
      <span class="icon-zyt-arrows-right"></span>
    </div>
    <div @click="openSelect()" class='tip-container' v-if="product.standard===1">
      <span class="tip">{{selectedTip}}</span>
      <span>{{firstName}}&#12288;</span>
      <span>{{secondName}}</span>
      <span class="icon-zyt-arrows-right"></span>
    </div>
     <div @click="openSelect()" class='tip-container' v-if="product.standard===0">
      <span class="tip">规格</span>
      <span>统一规格</span>
      <span class="icon-zyt-arrows-right"></span>
    </div>
    <!--product.prdType 0:网店，1：到店消费-->
    <div class='tip-container' v-if="isOnline">
      <span class="tip">运费</span>
      <span>{{getPostage}}</span>
    </div>
    <div class='tip-container' v-if="product.spendAmount >0|| product.spendAmount === 0">
      <span class="tip">促销</span>
       <span v-if="product.spendAmount >0">店铺内消费满{{product.spendAmount}}元 , 参与抽奖！</span>
       <span v-if="product.spendAmount === 0">消费即可参与抽奖！</span>
    </div>
  </div>
</template>

<script>
  import ProductApi from '@/api/product/product.api'
  // todo 促销 待定
  export default {
    props: {
      product: {
        type: Object,
        default: () => {
          return {}
        }
      },
      doorInfo: {
        type: Object,
        default: () => {
          return {}
        }
      },
      couponList: {
        type: Array,
        default: () => []
      },
      selected: {
        type: Object,
        default: () => {
          return {}
        }
      }
    },
    computed: {
      isOnline(){
        return ProductApi.isOnline(this.product.prdType)
      },
      /**
       * 获取邮费提示信息
       * @returns {*}
       */
      getPostage(){
        console.info(this.product, this.doorInfo)
        if (this.product.isFreePost || this.doorInfo.postage === 0) {
          return '包邮'
        } else {
          if (this.doorInfo.priceCondition) {
            return `￥${this.doorInfo.postage}，满${this.doorInfo.priceCondition}元包邮`
          } else if (this.doorInfo.postage) {
            return `￥${this.doorInfo.postage}`
          } else {
            return ''
          }
        }
      },
      selectedTip(){
        let flag = this.selected.firstPriceValue || this.selected.secondPriceValue
        if (flag) {
          return '已选择：'
        } else {
          return '请选择：'
        }
      },
      firstName(){
        return this.selected.firstPriceValue ? this.selected.firstPriceValue : this.product.firstPriceName
      },
      secondName(){
        return this.selected.secondPriceValue ? this.selected.secondPriceValue : this.product.secondPriceName
      }
    },
    methods: {
      openSelect(){
        this.$emit('openSelect', this.selected)
      },
      getCoupon(){
        this.$emit('getCoupon', this.couponList)
      }
    },
    components: {}
  }
</script>

<style lang="scss" rel="stylesheet/scss" type="text/scss" scoped>
  @import '../../../assets/css/variables-primary.scss';

  .tip-container {
    display: flex;
    align-items: flex-start;
    line-height: 20px;
    padding: 0 10px;
    padding-right: 40px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    font-size: 15px;
    position: relative;
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid map_get($ComBorderColor, dd);
    vertical-align: middle;
    .icon-zyt-arrows-right {
      font-size: 20px;
      position: absolute;
      display: block;
      right: 10px;
      height: 100%;
      top: 0px;
      display: flex;
      padding-bottom: 10px;
      align-items: center;
    }
    &:last-child{
      padding-bottom: 0px;
      margin-bottom: 0px;
      border-bottom: 0px solid map_get($ComBorderColor, dd);
      .icon-zyt-arrows-right{
        padding-bottom:0px;
      }
    }
   // border-bottom: .55px solid map_get($ComBorderColor, dd);
    .list {
      max-width: 100%;
      padding-right: 40px;
      p {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }
    .tip {
      vertical-align: middle;
      font-size: 12px;
      color: map_get($ComColors, gray);
      vertical-align: top;
      padding-right: 5px;
      display: inline-block;
    }
  }

</style>
