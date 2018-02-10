/**
* Created by guooug on 2017/6/16.
*/
<template lang="html">
  <div class="row">
    <div class="col icon-container" @click="goToDoor()">
      <p class="icon icon-zyt-store1"></p>
      <p class="title">店铺</p>
    </div>
    <div class="col icon-container" @click="collect()">
      <p class="icon" :class="collectStyle"></p>
      <p class="title">{{isCollected?'取消收藏':'收藏'}}</p>
    </div>
    <div class="col ">
      <button class="add-cart" @click="addCart()" :disabled="disabledAddCart">加入购物车</button>
    </div>
    <div class="col">
      <button class="buy" @click="buy()" :disabled="disabledBuy">
        立即购买
      </button>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      isCollected: {
        type: Boolean,
        default: false
      },
      disabledAddCart: { // 控制加入购物车按钮
        type: Boolean,
        default: false
      },
      disabledBuy: { // 控制购买按钮
        type: Boolean,
        default: false
      }
    },
    computed: {
      collectStyle(){
        if (this.isCollected) {
          return {
            'icon-zyt-star-white': true
          }
        } else {
          return {
            'icon-zyt-collect': true
          }
        }
      }
    },
    methods: {
      collect(){
        this.$emit('collect')
      },
      addCart(){
        this.$emit('addCart')
      },
      buy(){
        this.$emit('buy')
      },
      goToDoor(){
        this.$emit('goToDoor')
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" type="text/scss" scoped>
  @import '../../../assets/css/variables-primary.scss';

  .row {
    width: 100%;
    height: 49px;
    border-top: 1px solid map_get($ComBorderColor, dd);
    .icon-container {
      .icon-zyt-star-white {
        color: map_get($ComColors, yellow-f);;
      }
      width: 70px;
      max-width: 70px;
      text-align: center;
      &:first-child {
        border-right: 1px solid map_get($ComBorderColor, dd);
      }
      .icon {
        padding-top: 3px;
        font-size: 28px;
      }
      .title {
        font-size: 12px;
      }
    }
    .col {
      height: 100%;
    }
    button {
      height: 100%;
      color: white;
      border: 0px;
      font-size: 14px;
      width: 100%;
      &.add-cart {
        background-color: map_get($ComColors, yellow-f);
      }
      &.buy {
        border-left: 1px solid map_get($ComBorderColor,dd);
        background-color: map_get($ComColors, wathet-blue);
      }
      &[disabled] {
        background-color: map_get($ComColors, gray-a);
      }
    }
  }
</style>
