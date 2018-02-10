/**
* Created by guooug on 2017/6/16.
*/
<template lang="html">
  <div v-if="isShow">
    <p class="title"><span v-if="isPromotion" class="promotion-tip">促销</span>{{product.prdName}}</p>
    <div class="discount-price-container">
      <price-component :price="discountPrice" class="discountPrice" v-if="showPrice"></price-component>
      <div class="product-label" v-if="product.prdLabels" v-for="item,i in product.prdLabels" :key="i">
        <span>{{item.prdLabelName}}</span>
      </div>
      <div v-if="isPromotion&&showType()" class="product-label1">{{showType()}}</div>
    </div>
    <div class="sale-stock" v-if="discountPrice!==price&&showPrice">
      <div>
        <span>原价：</span>
        <del>
          <price-component :price="price"></price-component>
        </del>
      </div>
      <!-- <div>
         <span>已售{{product.saleStock}}件</span>
       </div>-->
    </div>
    <div v-if="isOffLine">
      <p class="off-line">到店消费</p>
    </div>
  </div>
</template>

<script>
  import PriceComponent from '@/components/common/price/price.component'
  import ProductApi from '@/api/product/product.api'
  export default {
    props: {
      product: {
        type: Object,
        default: () => {
          return {}
        }
      },
      selected: {
        type: Object,
        default: () => {
          return {
            specification: {}
          }
        }
      },
      isActive: {
        default: false
      },
      showPrice: {
        default: true
      }
    },
    data(){
      return {
        timeDifference: 0
      }
    },
    computed: {
      isOffLine(){
        return !ProductApi.isOnline(this.product.prdType)
      },
      price(){
        return this.selected.specification.price
      },
      discountPrice(){
        let price = this.selected.specification.discountPrice
        if (this.isActive) {
          let activityInfo = this.selected.specification.activityInfo
          price = activityInfo.activityPrice
        }
        return parseFloat(price)
      },
      isShow(){
        return this.selected && this.selected.specification
      },
      minMaxPrice(){
        return ProductApi.getMinMaxPrice(this.product)
      },
      isPromotion(){
        return ProductApi.isPromotion(this.product)
      }
    },
    methods: {
      showType(){
        let activityInfo = this.selected.specification.activityInfo
        if (activityInfo) {
          if (activityInfo.type === 0) {
            return '限时折扣'
          } else if (activityInfo.type === 2) {
            return '限时秒杀'
          }
        }
        return ''
      }
    },
    components: {
      'price-component': PriceComponent
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" type="text/scss" scoped>
  @import '../../../assets/css/variables-primary.scss';

  .title {
    /* display: flex;
     align-items: center;*/
    line-height: 22px;
    font-size: 16px;
    padding: 10px 10px 5px 10px;
    vertical-align: top;
    .promotion-tip {
      display: inline-block;
      vertical-align: top;
      line-height: 18px;
      margin-top: 2px;
      color: white;
      padding: 0 5px;
      border-radius: 3px;
      margin-right: 5px;
      font-size: 14px;
      background-color: map_get($ComColors, ponceau);
    }
  }

  .discount-price-container {
    padding: 0px 10px;
    color: map_get($ComColors, wathet-blue);
    font-size: 18px;
    display: -webkit-flex;
    -webkit-justify-content: flex-start;
    -webkit-align-items: center;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .discountPrice{
      margin-right: 10px;
    }
    .product-label {
      font-size: 12px;
      margin: 0 10px 0 0px;
      border: 1px dashed #ffa902;
      padding: 0 4px;
      border-radius: 5px;
      color: #ffa902;
    }
    .product-label1 {
      font-size: 12px;
      /*margin: 0 0 0 10px;*/
      border: 1px dashed #ffa902;
      padding: 0 4px;
      border-radius: 5px;
      color: #ffa902;
    }
    .product-label-box {
      padding: 0 4px;
      font-size: 12px;
      border: 1px dashed #f8311e;
      margin-left: 5px;
      border-radius: 5px;
      color: #f8311e;
    }
  }

  .sale-stock {
    font-size: 12px;
    padding: 0 10px;
    display: flex;
    justify-content: space-between;
    * {
      color: map_get($ComColors, gray);
    }
  }

  .off-line {
    font-size: 12px;
    padding: 3px 10px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
</style>
