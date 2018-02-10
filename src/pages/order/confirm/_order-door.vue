/**
* Created by guooug on 2017/6/16.
*/
<template lang="html">
  <div>
    <p class="door-name" @click="goToDoorInfo(order.doorId)"><i class="icon icon-zyt-store2"></i>{{order.doorName}}
    </p>
    <div class="row" v-for="prd in order.prdList" @click="goToPrdInfo(order.doorId,prd.prdId,order.from)">
      <div class="col img-container">
        <img-component :img-src="prd.prdImg"></img-component>
      </div>
      <div class="col info-container">
        <p class="title">{{prd.prdName}}</p>
        <p class="smaller">{{prd.firstPriceValue}} {{prd.secondPriceValue}}</p>
        <div class="space-between smaller">
          <p>X{{prd.num}}</p>
          <price-component :price="getPrice(prd.discountPrice, prd.num)" class="price-container"></price-component>
        </div>
      </div>
    </div>
    <div v-if="order.couponList.length>0">
      <div class="space-between user-coupon" @click="openPopup()">
        <p class="tip">{{couponName}}</p>
        <p>立即使用<i class="icon icon-zyt-arrows-right"></i></p>
      </div>
    </div>
    <div class="blankDiv"></div>
  </div>
</template>
<script>
  import ImgComponent from '@/components/common/img/img.component'
  import PriceComponent from '@/components/common/price/price.component'
  //  这是一个过渡界面，所有的参数都由前一个界面提供，如果获取不到数据（用户刷新，则退回到上一个界面）
  export default {
    props: {
      order: {
        type: Object
      },
      index: {
        type: Number,
        default: 0
      }
    },
    data(){
      return {
        coupons: [],
        popupVisible: false
      }
    },
    computed: {
      totalCommodity(){
        let price = 0
        this.order.prdList.forEach(prd => {
          price += this.getPrice(prd.discountPrice, prd.num)
        })
        console.info(2222222, price)
        return price
      },
      couponName(){
        let selects = this.order.couponList.filter(coupon => {
          return coupon.selected
        })
        if (selects.length > 0) {
          if (selects.length > 1) {
            return `${selects[0].couponName} X ${selects.length}`
          }
          return selects[0].couponName
        } else {
          return '有可用的优惠券或代金券'
        }
      }
    },
    methods: {
      goToPrdInfo(doorId, prdId, from){
        if (from === 'prdInfo') {
          this.$router.back()
        } else {
          this.$router.replace({
            name: 'productInfo',
            params: {
              doorId: doorId,
              prdId: prdId
            }
          })
        }
      },
      goToDoorInfo(doorId){
        this.$router.replace({
          name: 'indexDoor',
          params: {
            index: 0,
            doorId: doorId
          }
        })
      },
      getPrice(price, num){
        price = parseFloat(price)
        num = parseFloat(num)
        price *= num
        return price
      },
      openPopup(){
        this.$emit('openPopup', this.totalCommodity, this.index)
      }
    },
    components: {
      'img-component': ImgComponent,
      'price-component': PriceComponent
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" type="text/scss" scoped>
  @import "../../../assets/css/variables-primary";

  .row {
    padding: 5px 10px;
    border-bottom: 1px solid map_get($ComBorderColor, dd);
    &:last-child {
      border-bottom: 0px solid map_get($ComBorderColor, dd);
    }
    .img-container {
      width: 70px;
      max-width: 70px;
    }
    .info-container {
      padding-left: 10px;
      .title {
        font-size: 14px;
      }
      .smaller {
        font-size: small;
      }
      .space-between {
        padding-top: 5px;
      }
    }
    .price-container {
      font-size: 16px;
      color: map_get($ComColors, Wathet);
    }
  }

  .door-name {
    padding: 5px 10px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid map_get($ComBorderColor, dd);
    .icon {
      font-size: 24px;
      margin-right: 10px;
    }
  }

  .user-coupon {
    padding: 10px;
    .icon {
      margin-left: 10px;
    }
    .tip {
      color: map_get($ComColors, Wathet);;
    }
  }
</style>
