/**
* Created by guooug on 2017/6/16.
*/
<template lang="html">
  <zyt-page :hasFooter="true">
    <div slot="main">
      <div class="coupon-container">
        <!--        <div class="header">
                  <mt-header title="选择优惠券">
                    <mt-button icon="back" slot="left" @click="closePopup()"></mt-button>
                  </mt-header>
                </div> -->
        <div class="main">
          <div class="row" v-for="coupon in couponList">
            <button class="select col" :disabled="disabled(coupon)" @click="select(coupon)">
              <i class="icon icon-zyt-chose" v-if="coupon.selected"></i>
              <i class="icon icon-zyt-circle" v-else></i>
            </button>
            <div class="col row">
              <div class="col coupon-info ">
                <img :src="coupon.topicImg | imgPrefix" alt="">
                <div>
                  <p>{{coupon.couponName}}</p>
                  <p>
                    <small>{{desc(coupon)}}</small>
                  </p>
                  <p>
                    <small>{{time(coupon)}}</small>
                  </p>
                </div>
              </div>
              <p class="col discount-money " :disabled="disabled(coupon)">￥{{coupon.disCountMoney}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div slot="footer">
      <button @click="closePopup()" class="common-submit-btn">立即使用</button>
    </div>
  </zyt-page>
</template>
<script>
  //  这是一个过渡界面，所有的参数都由前一个界面提供，如果获取不到数据（用户刷新，则退回到上一个界面）
  export default {
    name: 'selectCoupon',
    data(){
      return {
        couponList: this.$route.params.couponList,
        totalCommodity: this.$route.params.totalCommodity
      }
    },
    mounted(){
      if (!this.couponList || !this.totalCommodity) {
        this.$router.back(-2)
      }
      this.totalCommodity = parseFloat(this.totalCommodity)
    },
    computed: {
      price(){
        let price = this.totalCommodity
        let selects = this.couponList.filter(coupon => coupon.selected)
        selects.forEach(coupon => {
          price -= coupon.disCountMoney
        })
        return price
      }
    },
    methods: {
      closePopup(){
        this.$router.back()
      },
      select(coupon){
        coupon.selected = !coupon.selected
      },
      disabled(coupon){
        // 如果选中了，就直接返回false
        if (coupon.selected === true) {
          return false
        }
        if (coupon.category === 0) {
          if (coupon.money && this.price < coupon.money) {
            return true
          }
        }
        let selects = this.couponList.filter(item => {
          return item.selected
        })
        if (selects.length > 0) {
          return coupon.couponId !== selects[0].couponId
        }
        return false
      },
      desc(coupon){
        if (coupon.category === 0) {
          return `满${coupon.money}元使用`
        } else {
          return '无门槛使用'
        }
      },
      time(coupon){
        let start = coupon['startTime'].split(' ')[0]
        let end = coupon['endTime'].split(' ')[0]
        return `(${start}~${end})`
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" type="text/scss" scoped>
  @import "../../../assets/css/variables-primary";

  .container {
    position: fixed;
  }

  .coupon-container {
    .main {
      padding: 5px;
      margin-bottom: 49px;
      padding-bottom: 1px;
      background-color: map_get($ComColors, gray-ef);
      .row {
        height: 66px;
        margin: 5px;
        margin-top: 0px;
        &.col {
          margin: 0px;
          background-image: url("../../../assets/img/coupon/quan01.png");
          background-repeat: no-repeat;
          background-size: 100% 100%;
        }
        .col {
          display: flex;
          align-items: center;
        }
        img {
          width: 60px;
          height: 60px;
          padding: 3px;
          margin-left: 5px;
        }
        button[disabled] {
          opacity: .5;
        }
      }
      .select {
        max-width: 30px;
        padding: 5px;
        .icon {
          color: map_get($ComColors, yellow-f);
          font-size: 26px;
        }
        &[disabled] {
          .icon {
            color: #333333;
          }
        }
      }
      .discount-money {
        max-width: 25%;
        width: 25%;
        color: white;
        text-align: center;
        justify-content: center;
        font-size: 18px;
        position: relative;
        margin-right: 5px;
        &[disabled] {
          opacity: .5;
        }
      }
      .coupon-info {
        width: 75%;
        max-width: 75%;
        position: relative;
        padding-right: 5px;
        div {
          width: 65%;
        }
        p {
          width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }

  .mint-popup {
    width: 100%;
    height: 100%;
  }
  .common-submit-btn{
    height: 49px;
  }
</style>
