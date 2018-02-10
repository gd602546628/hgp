/**
* Created by guooug on 2017/6/16.
*/
<template lang="html">
  <zyt-page :hasHeader="true">
    <mt-header title="店铺首页" slot="header"></mt-header>
    <div slot="main">
      <div class="product-list">
        <div class="row">
          <product-line-component :product="product" v-for="product in prdList"></product-line-component>
        </div>
      </div>
    </div>
  </zyt-page>
</template>
<script>
  import ProductApi from '@/api/product/product.api'
  import ProductLine from '@/components/product/product-line.component'
  export default {
    data () {
      return {
        prdList: [],
        test: 1
      }
    },
    mounted(){
      this.getProductList()
    },
    methods: {
      async getProductList(){
        let data = await ProductApi.getProductList({
          doorId: 1895
        })
        if (data) {
          this.prdList.push(...data.prdList)
        }
        console.info(this.prdList)
      }
    },
    components: {
      'product-line-component': ProductLine
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" type="text/scss" scoped>
  .product-list {
    .row {
      padding-top: 5px;
      padding-left: 5px;
    }
  }
</style>
