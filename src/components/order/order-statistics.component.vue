<template>
  <div>
    <div class="space-between">
      <p>商品总额</p>
      <p>￥{{prdPrice | toFixed}}</p>
    </div>
    <div class="space-between">
      <p>邮寄费用</p>
      <p>￥{{postage | toFixed}}</p>
    </div>
    <div class="space-between">
      <p>优惠</p>
      <p>-￥{{discount | toFixed}}</p>
    </div>
    <div class="space-between">
      <p>实付款</p>
      <p class="price">
        <price-component :price="totalPrice"></price-component>
      </p>
    </div>
  </div>
</template>
<script>
  import PriceComponent from '@/components/common/price/price.component'
  export default{
    props: ['prdPrice', 'postage', 'discount', 'price'],
    components: {
      'price-component': PriceComponent
    },
    computed: {
      totalPrice(){
        return this.price < 0 ? 0 : this.price
      }
    }
  }
</script>
<style lang='scss' rel='stylesheet/scss' type="text/scss" scoped>
  @import "../../assets/css/variables-primary";

  .price {
    font-size: 20px;
    color: map_get($ComColors, Wathet);
  }

  .space-between {
    min-height: 20px;
    align-items: center;
  }
</style>
