/**
* Created by guooug on 2017/6/16.
*/
<template lang="html">
  <div class="HighestOffer" v-if="HighestOffer">
        <span
          v-if="(!HighestOffer.doorActivityList || HighestOffer.doorActivityList == null) && (HighestOffer.maxDiscountPrice && HighestOffer.maxDiscountPrice !== null)">今日最高优惠<strong
          class="newMList-strong">¥{{HighestOffer.maxDiscountPrice}}</strong>元</span>
    <div class="door-activity-list"
         v-if="HighestOffer.doorActivityList !== null && HighestOffer.doorActivityList.length > 0">
          <span v-if="HighestOffer.doorActivityList[0].spendAmount && HighestOffer.doorActivityList[0].spendAmount>0">消费满<strong
            class="newMList-strong">¥{{HighestOffer.doorActivityList[0].spendAmount}}</strong>获得{{HighestOffer.doorActivityList[0].drawNum}}次抽奖机会</span>
      <span
        v-if="HighestOffer.doorActivityList[0].spendAmount<=0 || HighestOffer.doorActivityList[0].spendAmount==null">消费即可获得{{HighestOffer.doorActivityList[0].drawNum}}次抽奖机会</span>
      <button @click="openUrl(HighestOffer.doorActivityList[0].drawUrl)">查看奖品</button>
    </div>
  </div>
</template>
<script>
  import PriceComponent from '@/components/common/price/price.component'
  import ImgComponent from '@/components/common/img/img.component'
  export default {
    props: {
      prdList: {
        type: Array,
        default: () => {
          return []
        }
      }
    },
    computed: {},
    methods: {
      click(product){
        this.$emit('productClick', product)
      }
    },
    components: {
      'price-component': PriceComponent,
      'img-component': ImgComponent
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" type="text/scss" scoped>
  .product-table {
    .row {
      padding-top: 5px;
      padding-left: 5px;
      .col {
        padding-right: 5px;
        padding-bottom: 10px;
        img {
          width: 100%;
        }
      }
    }
  }
</style>
