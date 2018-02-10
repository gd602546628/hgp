<template>
  <div>
    <div class="coupon-wrap" v-if="coupon" v-for="coupon in couponList">
      <div class="coupon-item" :class="{isOffLine:coupon.couponType==1}" @click.stop="goToDesc(coupon)">
        <div class="topic-img" :style="{backgroundImage:'url('+topicImg(coupon)+')'}"></div>
        <div class="item-content">
          <div class="item-content-door">
            <div class="name" v-html="coupon.doorName"></div>
            <div class="distance" v-if="coupon.distance">{{distance(coupon)}}</div>
          </div>
          <p class="price1" :class="{isOffLine:coupon.couponType==1}">
            <span>{{coupon.discountMoney}}</span>
            <i v-if="coupon.category==0" :class="{isOffLine:coupon.couponType==1}"> 满{{coupon.money}}元可用</i>
            <i v-if="coupon.category==1" :class="{isOffLine:coupon.couponType==1}">无门槛使用</i>
          </p>
          <pre class="content-sc" v-html="coupon.scName"></pre>
          <span class="mail-type" v-if="coupon.couponType==0" :class="{isOffLine:coupon.couponType==1}">网店使用</span>
          <span class="mail-type" v-if="coupon.couponType==1" :class="{isOffLine:coupon.couponType==1}">到店使用</span>
        </div>
        <div class="item-button" v-if="!coupon.receive" @click="receiveCoupon(coupon,$event)">
          <div class="button-wrap">
            <p class="number">剩余{{coupon.num}}</p>
            <i :class="{isOffLine:coupon.couponType==1}"
               v-show="coupon.num!=0&&coupon.canReceive">立即领取</i>
            <i :class="{offLineDone:coupon.couponType==1,lineDone:coupon.couponType==0}"
               v-show="coupon.num==0&&coupon.canReceive">已领完</i>
            <p v-show="!coupon.canReceive" class="receiveTime">{{coupon.receiveTime}}开抢</p>
            <div class="water-wrap" v-show="coupon.num==0">
              <span class="icon-zyt-receive-done receive-done"></span>
            </div>
          </div>
        </div>
        <div class="item-button" v-if="coupon.receive" @click="goDetail(coupon,$event)">
          <div class="button-wrap">
            <p class="number">剩余{{coupon.num}}</p>
            <i class="receive" :class="{isOffLine:coupon.couponType==1}"
            >去使用</i>
            <!-- <i :class="{offLineDone:coupon.couponType==1,lineDone:coupon.couponType==0}"
                v-show="coupon.num==0"
             >已领完</i>-->
            <div class="water-wrap">
              <span class="icon-zyt-has-receive has-receive" v-show="coupon.num!=0"></span>
              <span class="icon-zyt-receive-done receive-done" v-show="coupon.num==0"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>
<script>
  import {Config, Codes} from '@/config/config'
  import couponService from '@/service/coupon/coupon.service'
  import {mapGetters, mapActions} from 'vuex'
  import Util from '@/service/common/utils/util.service'
  import TimeService from '@/service/time/time.service'
  export default{
    props: ['couponList', 'isDistance'],
    data(){
      return {}
    },
    computed: {
      ...mapGetters(['hasAuth'])
    },
    watch: {
      'couponList': function (curVal, oldVal) {
        let result = []
        for (let i = 0; i < curVal.length; i++) {
          let flag = false
          for (let j = 0; j < oldVal.length; j++) {
            if (curVal[i] === oldVal[j]) {
              flag = true
              break
            }
          }
          if (!flag) {
            result.push(curVal[i])
          }
        }
        this.initTimer(result)
        this.getReceivedCoupon(result)
      },
      'hasAuth': function () {
        this.getReceivedCoupon(this.couponList)
      }
    },
    methods: {
      ...mapActions(['getUserToken']),
      topicImg(coupon){ // 图片添加前缀
        if (!coupon.topicImg) {
          return null
        }
        if (coupon.topicImg.indexOf('http') >= 0) {
          return coupon.topicImg
        } else {
          return Config.imgPrefix + coupon.topicImg
        }
      },
      distance(coupon){
        if (this.isDistance) {
          return coupon.distance
        }
        let distance = coupon.distance
        let str = ''
        if (typeof distance === 'number') {
          if (distance < 1000) {
            return Math.floor(distance) + 'm'
          } else {
            let a = Math.floor(distance % 1000)
            a = a > 100 ? a : 0
            let result = Math.floor(distance / 1000) + '.' + str.substring.call(a, 0, 1) + 'km'
            return result
          }
        } else {
          return null
        }
      },
      getReceivedCoupon(couponList){
        if (this.hasAuth) {
          couponService.getReceivedCoupon(couponList)
        }
      },
      async receiveCoupon(item, $event){
        if (item.num <= 0 || !item.canReceive) return
        if ($event) {
          $event.stopPropagation()
        }
        if (!this.hasAuth) { // 没登录则登录，不执行后续操作
          await this.getUserToken({forceLogin: true})
          return
        }
        let data = await couponService.receiveCoupon({couponId: item.couponId, type: 0})
        switch (data.code) {
          case Codes.success:
            item.receive = true
            item.num--
            this.showConfirm('领取成功', '立即使用', '确定', this.goDetail, item)
            break
          case Codes.hasReceive:
            this.showAlert('您已领取过该优惠券了，给别人留一点吧')
            break
          default:
            Util.alert(data.mesg)
            break
        }
      },
      showConfirm(message, ok, cancel, okCall, params){
        Util.confirm({
          message: message,
          confirmButtonText: ok,
          cancelButtonText: cancel,
          showCancelButton: true
        }).then(() => {
          okCall(params)
        }).catch(() => {
        })
      },
      showAlert(message){
        Util.alert(message, '')
      },
      goDoor(item, $event){
        if ($event) {
          $event.stopPropagation()
        }
      },
      async goDetail(item, $event){ // 跳转优惠券详情
        if ($event) {
          $event.stopPropagation()
        }
        if (item.couponType === 0) { // 线上
          this.goDoor(item)
        } else if (item.couponType === 1) { // 线下
          let data = await couponService.getUserCouponId({couponId: item.couponId})
          if (data.code === Codes.success && data.data) {
            this.$router.push(
              {
                name: 'wxCouponCenterDetail',
                params: {
                  couponId: item.couponId,
                  userCouponId: data.data,
                  secondWebView: true
                }
              })
          }
        }
      },
      goOrReceive(item, $event){
        if ($event) {
          $event.stopPropagation()
        }
        if (item.num > 0) {
          if (item.receive) {
            this.goDetail(item)
          } else {
            this.receiveCoupon(item)
          }
        }
      },
      async goToDesc(coupon){
        this.$router.push({
          name: 'wxCouponCenterDesc',
          params: {
            couponId: coupon.couponId || coupon.id,
            userCouponId: coupon.userCouponId || 250,
            secondWebView: true,
            num: 1 // num传1后 userCouponId就用不到了
          }
        })
      },
      initTimer(couponList){ // 设置开抢倒计时
        let nowTime = new Date(TimeService.sysTime())
        let nowTimes = nowTime.getHours() * 3600 + nowTime.getMinutes() * 60 + nowTime.getSeconds()
        couponList.forEach(coupon => {
          if (!coupon.receiveTime) {
            coupon.canReceive = true
            return
          }
          let receiveTimeArr = coupon.receiveTime.split(':').map(item => {
            return (parseInt(item))
          })
          let receiveTimes = receiveTimeArr[0] * 3600 + receiveTimeArr[1] * 60 + receiveTimeArr[2]
          if (receiveTimes < nowTimes) {
            coupon.canReceive = true
          } else {
            coupon.receiveDisTime = receiveTimes - nowTimes
            coupon.timer = setInterval(() => {
              if (coupon.receiveDisTime === 0) {
                coupon.canReceive = true
                clearInterval(coupon.timer)
                return
              }
              coupon.receiveDisTime--
            }, 1000)
          }
        })
      }
    }
  }
</script>
<style lang='scss' rel='stylesheet/scss' scoped type="text/scss">
  .coupon-wrap {
    overflow: hidden;
    .coupon-item {
      display: flex;
      padding: 8px 8px;
      background-repeat: no-repeat;
      background-size: 100% 90px;
      box-sizing: border-box;
      margin: 0px 8px 5px 8px;
      position: relative;
      background-image: url("../../assets/img/coupon/quan01.png");
      &.isOffLine {
        background-image: url("../../assets/img/coupon/quan04.png");
      }
      .topic-img {
        width: 66px;
        height: 66px;
        text-align: center;
        overflow: hidden;
        background-size: 100% 100%;
        background-position: center;
        background-repeat: no-repeat;
        border-radius: 5px;
        margin-top: 4px;
        margin-left: 2px;
      }
      .item-content {
        flex: 1;
        margin-left: 10px;
        position: relative;
        padding-top: 5px;
        overflow: hidden;
        .price1, .price2 {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-bottom: 0;
          padding: 0;
          margin-top: 4px;
          width: 90%;
          color: #64b3f8;
          font-size: 12px;
          &.isOffLine {
            color: #b9995a;
          }
          span {
            font-size: 22px;
            font-weight: 600;
          }
        }
        .item-content-door {
          margin-bottom: 0;
          padding: 0;
          display: flex;
          .name {
            color: #343434;
            font-size: 13px;
            font-weight: bold;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            flex: 1;
          }
          .distance {
            margin: 0 10px 0 10px;
            height: 20px;
            line-height: 20px;
            padding: 0px 8px;
            border-radius: 10px;
            background-color: #efefef;
            color: #88888d;
            font-size: 12px;
          }
        }
        .content-sc {
          margin-right: 80px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 12px;
        }
        .mail-type {
          position: absolute;
          right: 10px;
          top: 58px;
          display: inline-block;
          font-size: 12px;
          color: #64b3f8;
          &.isOffLine {
            color: #b9995a;
          }
        }
      }
      .item-button {
        width: 22%;
        position: relative;
        height: 75px;
        z-index: 2;
        position: relative;
        .button-wrap {
          height: 100%;
          position: relative;
          padding-top: 10px;
          z-index: 1;
          .receiveTime {
            color: #ffffff;
            font-size: 14px;
            text-align: center;
            font-weight: 600;
          }
          .number {
            text-align: center;
            padding-bottom: 8px;
            color: #ffffff;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 14px;
            position: relative;
            z-index: 1;
          }
          .receive {
            background-color: #fbec4f !important;
          }
          i {
            z-index: 10;
            font-style: normal;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            left: 50%;
            margin-left: -35px;
            height: 24px;
            width: 70px;
            font-size: 12px;
            border-radius: 20px;
            border-width: 2.5px !important;
            background-color: #ffffff;
            color: #64b3f8;
            border: solid 2px #4a9ef3;
            &.isOffLine {
              background-color: #ffffff;
              color: #b9995a;
              border: solid 2px #a38140;
            }
            &.offLineDone {
              background-color: #a38140;
              border: solid 2px #a38140;
              color: #b9995a;
            }
            &.lineDone {
              background-color: #4a9ef3;
              border: solid 2px #4a9ef3;
              color: #8bc7fc;
            }
          }
          .water-wrap {
            position: absolute;
            top: -20px;
            left: -20px;
            height: 70px;
            width: 70px;
            overflow: hidden;
            z-index: 0;
            .has-receive, .receive-done {
              color: #ffffff;
              position: absolute;
              top: -4px;
              left: -4px;
              font-size: 70px;
              z-index: 0;
              opacity: 0.3;
            }
          }
        }
      }
    }
  }
</style>

