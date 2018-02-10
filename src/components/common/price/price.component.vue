/**
* Created by guooug on 2017/6/16.
*/
<template lang="html">

  <span class="price-span">
    <slot name="before"></slot>
    <small>￥</small>{{getInteger}}<small>.{{getDecimal}}</small>
    <slot name="after"></slot>
  </span>
</template>

<script>
  export default {
    props: {
      price: {
        type: String | Number,
        default: 0
      }
    },
    computed: {
      getInteger(){
        return parseInt(this.price)
      },
      getDecimal(){
        return parseFloat(this.price).toFixed(2).toString().split('.')[1]
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" type="text/scss" scoped>
  span, small {
    color: inherit;
  }
</style>
