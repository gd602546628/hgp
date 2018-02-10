<template>
  <div class="container col col-6">
    <img-component :img-src="product.prdImg[0]"></img-component>
    <p>{{product.prdName}}</p>
    <div>
      <price-component :price="product.discountPrice"></price-component>
      <del>￥{{product.costPrice}}</del>
    </div>
  </div>
</template>
<script>
  import PriceComponent from '@/components/common/price/price.component'
  import ImgComponent from '@/components/common/img/img.component'
  export default {
    props: {
      product: {
        type: Object,
        default: () => {
          return {}
        }
      }
    },
    computed: {},
    data(){
      return {}
    },
    mounted(){
      console.info(this)
    },
    methods: {
      getHeight(){
        return {
          height: '100px'
        }
      }
    },
    components: {
      'price-component': PriceComponent,
      'img-component': ImgComponent
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped type="text/scss">
  .container {
    padding-right: 5px;
    padding-bottom: 10px;
    img {
      width: 100%;
    }
  }
</style>
