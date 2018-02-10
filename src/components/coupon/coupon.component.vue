<template>
  <div>
    <div class="coupon-wrap" v-if="coupon" v-for="coupon in couponList">
      <div class="coupon-item" :class="{isOffLine:coupon.couponType==1}">
        <div class="topic-img" :style="{backgroundImage:'url('+topicImg(coupon)+')'}"
             @click.stop="goDoor(coupon)"></div>
        <div class="item-content" @click.stop="goDetail(coupon)">
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
        <div class="item-button" v-if="!coupon.receive"
             @click.stop="receiveCoupon(coupon)"
        >
          <div class="button-wrap">
            <p class="number">剩余{{coupon.num}}</p>
            <i :class="{isOffLine:coupon.couponType==1}"
               v-show="coupon.num!=0&&coupon.canReceive">立即领取</i>
            <i :class="{offLineDone:coupon.couponType==1,lineDone:coupon.couponType==0}"
               v-show="coupon.num==0">已领完</i>

            <p v-if="!coupon.canReceive&&!coupon.startInterval&&coupon.receiveTime&&coupon.num>0" class="receiveTime">
              {{coupon.receiveTime && coupon.receiveTime.substring(0, 5)}}开抢</p>

            <div v-if="!coupon.canReceive&&coupon.startInterval&&coupon.num>0" class="receive-interval">
              <p class="interval-title">开抢倒计时</p>
              <div class="interval-time">
                <span class="times">{{coupon.intervalMinute}}</span>
                <span class="dot">:</span>
                <span class="times">{{coupon.intervalSecond}}</span>
              </div>
            </div>
            <div class="water-wrap" v-show="coupon.num==0">
              <span class="icon-zyt-receive-done receive-done"></span>
            </div>
          </div>
        </div>
        <div class="item-button" v-if="coupon.receive"
             @click.stop="goUse(coupon,$event)"
        >
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
  import {mapGetters, mapActions, mapState} from 'vuex'
  import Util from '@/service/common/utils/util.service'
  import TimeService from '@/service/time/time.service'

  export default {
    props: ['couponList', 'isDistance'],
    data() {
      return {
        receiveClickFlag: false
      }
    },
    computed: {
      ...mapGetters(['hasAuth']),
      ...mapState(['isAuditingIosApp'])
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
      topicImg(coupon) { // 图片添加前缀
        if (!coupon.topicImg) {
          return null
        }
        if (coupon.topicImg.indexOf('http') >= 0) {
          return coupon.topicImg
        } else {
          return Config.imgPrefix + coupon.topicImg
        }
      },
      distance(coupon) {
        if (this.isDistance) {
          return coupon.distance
        }
        let distance = coupon.distance
        if (typeof distance === 'number') {
          if (distance < 1000) {
            return Math.floor(distance) + 'm'
          } else if (distance) {
            let result = (distance / 1000).toFixed(1) + 'km'
            return result
          }
        } else {
          return null
        }
      },
      getReceivedCoupon(couponList) {
        if (this.hasAuth) {
          couponService.getReceivedCoupon(couponList, this.hasAuth.userId)
        }
      },
      async receiveCoupon(item) {
        let couponParams = {}
        if (item.num <= 0 && item.canReceive) {
          this.showAlert('优惠券已经被领取完了，去看看别的优惠吧')
        }
        if (item.num <= 0 || !item.canReceive) return
        if (!this.hasAuth) { // 没登录则登录，不执行后续操作
          await this.getUserToken({forceLogin: true})
          return
        }
        if (this.receiveClickFlag) return
        this.receiveClickFlag = true
        if (this.couponList.oldId){
          couponParams = { // 正常优惠券
            couponId: item.couponId,
            type: 0, // 0-普通入口，1-活动入口
            oldId: JSON.parse(this.couponList.oldId)
          }
        } else {
          couponParams = { // 正常优惠券
            couponId: item.couponId,
            type: 0 // 0-普通入口，1-活动入口
          }
        }
        if (item.isActivity && parseInt(item.isActivity) === 1) { // 优惠券活动
          couponParams.type = 1
          couponParams.couponActivityId = item.couponActivityId
        } else { // 正常优惠券
          couponParams.type = 0
        }
        let data = await couponService.receiveCoupon(couponParams)
        this.receiveClickFlag = false
        switch (data.code) {
          case Codes.success:
            item.receive = true
            item.num--
            this.showConfirm('领取成功', '立即使用', '确定', this.goUse, item)
            break
          case Codes.hasReceive:
            this.showAlert('您已领取过该优惠券了，给别人留一点吧')
            break
          case Codes.couponNoNum:
            item.num = 0
            this.showAlert('优惠券已经被领取完了，去看看别的优惠吧')
            break
          default:
            Util.alert(data.mesg)
            break
        }
      },
      showAlert(message) {
        Util.alert(message, '')
      },
      showConfirm(message, ok, cancel, okCall, params) {
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
      async goUse(coupon) {
        if (parseInt(coupon.couponType) === 0) { // 线上券
          this.goDoor(coupon)
        } else { // 线下券
          let data = await couponService.getUserCouponId({
            couponId: coupon.couponId
          })
          if (data.code === Codes.success) {
            this.$router.push({
              name: 'wxCouponCenterDetail',
              params: {
                userCouponId: data.data,
                couponId: coupon.couponId
              }
            })
          }
        }
      },
      async goDetail(coupon) { // 跳转优惠券详情
        console.info(coupon)
        if (coupon.isActivity && parseInt(coupon.isActivity) === 1) { // 优惠券活动
          this.$router.push({
            name: 'couponActivityDetail',
            params: {
              userCouponId: 250,
              couponId: coupon.couponId,
              couponActivityId: coupon.couponActivityId
            }
          })
          return
        } else { // 正常优惠券
        }
        this.$router.push({
          name: 'wxCouponCenterDesc',
          params: {
            userCouponId: 250,
            couponId: coupon.couponId,
            num: 1
          }
        })
      },
      async goDoor(item) {
        //  审核的版本不让跳转
        if (this.isAuditingIosApp) {
          return
        }
        let doorInfo = await couponService.getDoorInfo({
          doorId: item.doorId
        })
        if (parseInt(doorInfo.data.isHasPrd) === 1) {
          this.$router.push({
            name: 'indexDoor',
            params: {doorId: item.doorId}
          })
        } else {
          window.location.href = doorInfo.data.siteUrl
        }
      },
      initTimer(couponList) { // 设置开抢倒计时
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
            coupon.startInterval = coupon.receiveDisTime <= 1800
            coupon.timer = setInterval(() => {
              // 每次倒计时都重新获取当前时间，防止锁屏后js不执行
              let nowTime = new Date(TimeService.sysTime())
              let nowTimes = nowTime.getHours() * 3600 + nowTime.getMinutes() * 60 + nowTime.getSeconds()
              coupon.receiveDisTime = receiveTimes - nowTimes
              if (coupon.receiveDisTime <= 0) {
                coupon.canReceive = true
                clearInterval(coupon.timer)
                return
              }
              coupon.startInterval = coupon.receiveDisTime <= 1800
              coupon.receiveDisTime--
              let m = Math.floor(coupon.receiveDisTime / 60)
              let s = coupon.receiveDisTime - m * 60
              m = m < 10 ? '0' + m : m
              s = s < 10 ? '0' + s : s
              coupon.intervalMinute = m
              coupon.intervalSecond = s
            }, 1000)
          }
        })
      }
    }
  }
</script>
<style lang='scss' rel='stylesheet/scss' scoped>
  .coupon-wrap {
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
            font-size: 14px;
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
        width: 23%;
        position: relative;
        height: 75px;
        z-index: 2;
        position: relative;
        .button-wrap {
          height: 100%;
          position: relative;
          //padding-top: 10px;
          z-index: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          .receiveTime {
            color: #ffffff;
            font-size: 14px;
            text-align: center;
            font-weight: 600;
          }
          .receive-interval {
            position: relative;
            top: -6px;
            .interval-title {
              color: #fbec4f;
              font-size: 10px;
              text-align: center;
            }
            .interval-time {
              display: flex;
              justify-content: center;
              margin-top: 4px;
              .times {
                width: 22px;
                height: 22px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #ffffff;
                border-radius: 2px;
                color: #b9995a;
              }
              .dot {
                color: #ffffff;
                font-size: 14px;
                margin: 0 4px;
              }
            }
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
            font-style: normal;
            text-align: center;
            display: inline-block;
            // position: absolute;
            // left: 50%;
            // margin-left: -35px;
            display: flex;
            align-items: center;
            justify-content: center;
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
            top: -10px;
            left: -10px;
            height: 50px;
            width: 50px;
            overflow: hidden;
            .has-receive, .receive-done {
              color: #ffffff;
              position: absolute;
              top: -4px;
              left: -4px;
              font-size: 40px;
              z-index: 0;
              opacity: 0.3;
            }
          }
        }
      }
    }
  }
</style>
