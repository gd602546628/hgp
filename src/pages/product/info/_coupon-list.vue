/**
* Created by guooug on 2017/6/16.
*/
<template lang="html">
  <div class="container" :class="{show:show}">
    <div class="main coupon-list-popup">
      <p class="title">店铺优惠券
        <button @click="close()" class="icon-zyt-close-mark"></button>
      </p>
      <div class="list">
        <div class="item row" v-for="(coupon,index) in couponList" :key="index">
          <div class="col col-main">
            <div class="price">
              <p>￥<span>{{coupon.discountMoney}}</span></p>
              <span class="right">{{couponType(coupon)}}</span>
            </div>
            <p v-if="coupon.category===1||!coupon.money">无门槛使用</p>
            <p v-else>满{{coupon.money}}使用</p>
            <p>有效期至：{{coupon.endTime}}</p>
          </div>
          <div class="col col-btn" v-if="coupon.receive">已领取</div>
          <div class="col col-btn" @click="receiveCoupon(coupon,index)" v-if="!coupon.receive">立即领取</div>
        </div>
      </div>
    </div>
    <div class="bg" @click="close()" @touchmove.prevent></div>
  </div>
</template>

<script>
  export default {
    props: {
      couponList: {
        type: Array,
        default: () => []
      }
    },
    data(){
      return {
        show: false
      }
    },
    methods: {
      couponType(coupon){
        if (coupon.couponType === 0) {
          return '网店使用'
        } else {
          return '到店使用'
        }
      },
      receiveCoupon(coupon){
        this.$emit('receiveCoupon', coupon)
      },
      open(){
        this.show = true
      },
      close(){
        this.show = false
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" type="text/scss" scoped>
  @import '../../../assets/css/variables-primary.scss';

  .container {
    &.show {
      top: 0;
    }
    .bg {
      pointer-events: none;
      z-index: -1;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: black;
      opacity: 0;
      transition: all .4s cubic-bezier(.55, 0, .1, 1);
    }
  }

  .show {
    .bg {
      z-index: 998;
      pointer-events: auto;
      opacity: .4;
    }
    .main {
      height: 320px;
    }
  }

  .main {
    overflow: hidden;
    height: 0px;
    transition: all .4s cubic-bezier(.55, 0, .1, 1);
    width: 100%;
    bottom: 0px;
    background-color: white;
    z-index: 999;
    position: absolute;
    .title {
      text-align: center;
      font-size: 16px;
      line-height: 44px;
      position: relative;
      button {
        position: absolute;
        line-height: 44px;
        right: 10px;
        top: 0;
        font-size: 20px;
        background-color: transparent;
        border: 0px;
      }
    }
    .list {
      position: absolute;
      width: 100%;
      bottom: 0px;
      top: 44px;
      padding: 0 10px;
      overflow: scroll;
      -webkit-overflow-scrolling: touch;
      overflow-scrolling: touch;
      .item {
        border-radius: 5px;
        background-color: map_get($ComColors, e5);
        margin-bottom: 10px;
        font-size: 12px;
        display: flex;
        justify-content: center;
        align-items: center;
        * {
          color: map_get($ComColors, wathet-blue);
        }
        .price {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          padding-bottom: 5px;
          p span {
            font-size: 24px;
          }
          .right {
            padding-right: 20px;
          }
        }
        .col-main {
          padding: 5px 0 5px 10px;
          border-right: 1px dotted;
          //border-right: .55px dotted;
          position: relative;
          &:before {
            position: absolute;
            display: block;
            content: '';
            top: -5px;
            right: -6px;
            height: 10px;
            width: 12px;
            background-color: white;
            border-radius: 50%;
          }
          &:after {
            position: absolute;
            display: block;
            content: '';
            bottom: -5px;
            right: -6px;
            height: 10px;
            width: 12px;
            background-color: white;
            border-radius: 50%;
          }
        }
        .col-btn {
          width: 100px;
          max-width: 100px;
          text-align: center;
        }
      }
    }
  }

  .icon-zyt-close-mark {
    font-size: 16px;
  }
</style>
