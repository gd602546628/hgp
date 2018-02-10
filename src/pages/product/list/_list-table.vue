/**
* Created by guooug on 2017/6/16.
*/
<template lang="html">
  <div class="product-table">
    <div class="row">
      <div class="col col-6" :product="product" v-for="product in prdList" @click="click(product)">
        <img-component :img-src="product.prdImg[0]"></img-component>
        <div>
          <p>{{product.prdName}}</p>
          <price-component :price="product.discountPrice"></price-component>
          <del>￥{{product.costPrice}}</del>
        </div>
      </div>
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
