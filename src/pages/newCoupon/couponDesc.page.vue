<template>
  <zyt-page :hasFooter="true">
    <div slot="main" v-if="coupon">
      <div class="blankDiv"></div>
      <div class="couponWrap">
        <div class="coupon-wrap" v-if="coupon">
          <div class="coupon-item" :class="{isOffLine:coupon.type==1}">
            <div class="topic-img" :style="{backgroundImage:'url('+topicImg(coupon)+')'}"></div>
            <div class="item-content">
              <div class="item-content-door">
                <div class="name" v-html="coupon.doorName"></div>
                <div class="distance" v-if="coupon.distance">{{distance(coupon)}}</div>
              </div>
              <p class="price1" :class="{isOffLine:coupon.type==1}">
                <i v-if="coupon.category==0" :class="{isOffLine:coupon.type==1}"> 满{{coupon.money}}元可用</i>
                <i v-if="coupon.category==1" :class="{isOffLine:coupon.type==1}">无门槛使用</i>
              </p>
              <!--<pre class="content-sc">{{coupon.scName}}</pre>-->
              <div class="content-sc">有限期至：<span>{{coupon.endTime}}</span></div>
              <!--<span class="mail-type" v-if="coupon.type==0" :class="{isOffLine:coupon.type==1}">网店使用</span>
              <span class="mail-type" v-if="coupon.type==1" :class="{isOffLine:coupon.type==1}">到店使用</span>-->
            </div>
            <div class="item-button">
              <div class="button-wrap1 right-button">
                <span>¥</span>
                <span>{{coupon.discountMoney}}</span>
              </div>
            </div>
          </div>
          <div class="blankDiv2"></div>
        </div>
      </div>
      <!--导航-->
      <div class="cvnPrdDtl-addbox" v-if="coupon.companyInfo">
        <div class="cvnPrdDtl-navigation" @click.prevent="navigation(coupon.companyInfo)">
          <div class="cvnPrdDtl-input">
            {{ coupon.companyInfo.provinceName + coupon.companyInfo.cityName + coupon.companyInfo.districtName +
          coupon.companyInfo.address
            }}
          </div>
        </div>
        <div class="button-position2" @click="doorTel()">
          <span></span>
          <a class="cvnPrdDtl-button">
            <i class="icon-zyt-phone2"></i>
          </a>
        </div>
      </div>
      <div class="blankDiv"></div>
      <!--商品信息-->

      <div>
        <div class="couponDetail-content-head">优惠券说明:</div>
        <div class="desc-container">
          <div>优惠券名称：{{coupon.name}}</div>
          <!--<p v-if="couponCode">优惠码：{{couponCode}}</p>-->
          <p v-if="coupon.category==0">使用条件：满{{coupon.money}}元可用</p>
          <p v-else>使用条件：无门槛使用</p>
          <p v-if="coupon.startTime">使用期限：{{coupon.startTime.split(' ')[0]}}~{{coupon.endTime.split(' ')[0]}}</p>
          <p class="pBtn">
            <span class="doorName">发布商家：{{coupon.doorName}}</span>
            <span class="go-look-look" @click="goDetail(coupon)">去逛逛</span>
          </p>
        </div>
      </div>

      <div class="couponDetail-splitBar"></div>
      <div class="blankDiv" v-if="coupon.explain"></div>
      <!--订单信息-->
      <div class="per-order-card per-order-card1">
        <div class="couponDetail-content2" v-if="coupon.explain">
          <div class="couponDetail-content-head">使用说明:</div>
          <!-- <div class="couponDetail-content-middle" v-html="coupon.explain"></div> -->
          <div class="couponDetail-content-middle" v-ueditor v-html="coupon.explain"></div>
        </div>
      </div>
    </div>
    <div slot="footer">
      <div class="footer">

        <div v-if="!isMyCouponInfo">
          <div v-if="coupon.receive">
            <button :disabled="receiving" @click.stop="submit()">立即使用</button>
          </div>
          <div v-if="!coupon.receive">
            <button :disabled="receiving" v-if="coupon.num>0&&coupon.canReceive&&!coupon.receive"
                    @click.stop="submit()">立即领取
            </button>
            <button :disabled="true"
                    v-if="!coupon.canReceive&&coupon.num>0&&!coupon.startInterval"
            >{{coupon.receiveTime}} 开抢
            </button>
            <div v-if="!coupon.canReceive&&coupon.num>0&&coupon.startInterval" class="interval-wrap">
              <div class="title">开抢倒计时</div>
              <div class="interval">
                <span class="times">{{coupon.intervalMinute}}</span>
                <span class="dot">:</span>
                <span class="times">{{coupon.intervalSecond}}</span>
              </div>
            </div>
            <button v-if="coupon.num===0" class="btnDisabled">已领完</button>
          </div>
        </div>

        <div v-if="isMyCouponInfo">
          <button :disabled="receiving" v-if="statusNum===0" @click="submit()">立即使用</button>
          <button v-if="statusNum===1" class="btnDisabled">
            于{{CouponInfo.useTime | dateFormat('yyyy-MM-dd hh:mm')}}使用
          </button>
          <button v-if="statusNum===2" class="btnDisabled">
            已失效
          </button>
        </div>

      </div>
    </div>
    <div slot="mask">
      <!--电话弹框-->
      <div v-if="popupVisible">
        <mt-popup class="popup" v-model="popupVisible" position="bottom">
          <div class="telBox">
            <div class="couponDetail-tel" v-for="item in tel">
              <a :href="'tel:' + item">{{ item }}</a>
            </div>
          </div>
          <div class="blankDiv"></div>
          <div @click="offDoorTel()" class="button">
            取消
          </div>
        </mt-popup>
      </div>
    </div>
  </zyt-page>
</template>
<script>
  import couponCategory from '@/components/couponCategory/couponCategory.component'
  import servantSort from '@/components/servantSort/servantSort.component'
  import couponService from '@/service/coupon/coupon.service'
  import coupon from '@/components/coupon/coupon.component'
  import locationService from '@/service/common/location/location'
  import { Config, Codes } from '@/config/config'
  import { mapGetters, mapMutations } from 'vuex'
  import Toast from '@/service/toast/toast.service'
  import Util from '@/service/common/utils/util.service'
  import NavigationServices from '@/service/navigation/navigation.service'
  import TimeService from '@/service/time/time.service'
  /* eslint-disable*/
  export default {
    name: 'wxCouponCenterDesc',
    components: {
      'couponCategory': couponCategory,
      'servant-sort': servantSort,
      'coupon': coupon
    },
    data () {
      return {
        params: {
          'couponIds': [parseInt(this.$route.params.couponId)]
        },
        userParams: {
          'userCouponId': this.$route.params.userCouponId,
          'userId': null
        },
        coupon: [],
        couponCode: null,
        popupVisible: false,
        tel: null,
        isMyCouponInfo: false,
        CouponInfo: null,
        statusNum: null,
        receiving: false // 领取中
      }
    },
    computed: {
      ...mapGetters(['userInfo', 'hasAuth'])
    },
    created () {
      this.init()
    },
    methods: {
      ...mapMutations(['removeInclude', 'addExclude']),
      async getCouponDetail () { // 获取优惠劵详情
        this.params.couponIds = [parseInt(this.$route.params.couponId)]
        let data = await couponService.getCouponDetail(this.params, {showLoading: true})
        if (data.length === 0) {
          console.log('没有数据')
        }
        data.data[0]['receive'] = false
        data.data[0].canReceive = false
        data.data[0].receiveTime = data.data[0].robTime || null
        data.data[0].startInterval = false
        data.data[0].intervalMinute = '00'
        data.data[0].intervalSecond = '00'
        this.coupon = data.data[0]
        /*if(this.coupon.num===0){ // 已领完
          await Util.alert({message:'优惠券已经被领取完了，去看看别的优惠吧', confirmButtonText: '我知道了'})
          this.$router.push({
            name: 'couponCenter'
          })
        } else {
        }*/

        if (this.coupon.telephone && this.coupon.telephone != '') {
          this.tel = this.coupon.telephone.split(',')
        } else {
          this.tel = this.coupon.companyInfo.phone.split(',')
        }
        if (this.hasAuth) {
          let data = await couponService.getReceivedCoupon([this.coupon])
        }
        /*  if(!this.coupon.receive&&this.coupon.num===0){
            await Util.alert({message:'优惠券已经被领取完了，去看看别的优惠吧', confirmButtonText: '我知道了'})
            this.removeInclude('wxCouponCenterDetail')
            this.removeInclude('wxCouponCenterDesc')
            this.addExclude('wxCouponCenterDesc')
            this.addExclude('wxCouponCenterDetail')
            this.$router.push({
              name: 'couponCenter'
            })
          } */
        if (parseInt(this.$route.params.num) === 1 && this.coupon.num === 0) {
          await Util.alert({message: '优惠券已经被领取完了，去看看别的优惠吧', confirmButtonText: '我知道了'})
          this.removeInclude('wxCouponCenterDetail')
          this.removeInclude('wxCouponCenterDesc')
          this.addExclude('wxCouponCenterDesc')
          this.addExclude('wxCouponCenterDetail')
          this.$router.push({
            name: 'couponCenter'
          })
        }
        this.initTimer(this.coupon)
      },
      initTimer (coupon) { // 设置开抢倒计时
        let nowTime = new Date(TimeService.sysTime())
        let nowTimes = nowTime.getHours() * 3600 + nowTime.getMinutes() * 60 + nowTime.getSeconds()
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
            if (coupon.receiveDisTime === 0) {
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
      },
      async getLocation () {
        let position = await locationService.getLocation().catch(() => {
          throw new Error(false)
        })
        this.params.position.latitude = position.latitude
        this.params.position.longitude = position.longitude
        return true
      },
      topicImg (coupon) { // 图片添加前缀
        if (!coupon.topicImg) {
          return null
        }
        if (coupon.topicImg.indexOf('http') >= 0) {
          return coupon.topicImg
        } else {
          return Config.imgPrefix + coupon.topicImg
        }
      },
      distance (coupon) {
        let distance = coupon.distance
        let str = ''
        if (typeof distance === 'number') {
          if (distance < 1000) {
            return Math.floor(distance) + 'm'
          } else {
            let result = Math.floor(distance / 1000) + '.' + str.substring.call(Math.floor(distance % 1000), 0, 1) + 'km'
            return result
          }
        } else {
          return null
        }
      },
      doorTel () {
        this.popupVisible = true
      },
      offDoorTel () {
        this.popupVisible = false
      },
      async init () {
        this.getCouponDetail()
        this.getUserCouponInfo()
      },
      async goDetail (item) {
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
      async receiveCoupon () {
        if (this.receiving) {
          return
        }
        this.receiving = true
        let data = await couponService.receiveCoupon({
          couponId: this.$route.params.couponId
        }).catch(e => {
          setTimeout(() => {
            this.receiving = false
          }, 500)
        })
        setTimeout(() => {
          this.receiving = false
        }, 500)
        if (data.code === Codes.success) {
          this.coupon['receive'] = true
          this.coupon.num--
          Toast.success('领取成功')
        } else {
          if (data.code === Codes.couponNoNum) { // 优惠券不存在
            await Util.alert({message: '优惠券已经被领取完了，去看看别的优惠吧', confirmButtonText: '我知道了'})
            this.coupon.num = 0
            this.removeInclude('wxCouponCenterDetail')
            this.addExclude('wxCouponCenterDetail')
            this.removeInclude('wxCouponCenterDesc')
            this.addExclude('wxCouponCenterDesc')
            this.$router.push({
              name: 'couponCenter'
            })
          } else {
            Util.alert({
              message: data.mesg
            })
          }
        }
      },
      async goToDetail () {
        let coupon = this.coupon
        if (parseInt(coupon.type) === 0) {
          this.$router.push({name: 'indexDoor', params: {index: 0, doorId: coupon.doorId}})
        } else {
          let userCouponId = this.$route.params.userCouponId
          userCouponId = parseInt(userCouponId)
          if (userCouponId && userCouponId > 250) {
          } else {
            let data = await couponService.getUserCouponId({
              couponId: coupon.id
            })
            if (data.code === Codes.success) {
              userCouponId = data.data
            } else {
              return
            }
          }
          this.$router.push({
            name: 'wxCouponCenterDetail',
            params: {
              userCouponId: userCouponId,
              couponId: coupon.id
            }
          })
        }
      },
      async submit () {
        if (!this.coupon['receive']) {
          this.receiveCoupon()
        } else {
          this.goToDetail()
        }
      },
      async getUserCouponInfo () {
        if (parseInt(this.$route.params.num) === 0) {
          this.isMyCouponInfo = true
          let userCouponId = this.$route.params.userCouponId
          let data = await couponService.getUserCouponInfo({
            userCouponId: userCouponId
          })
          if (data.code === Codes.success) {
            this.CouponInfo = data.data
            this.statusNum = data.data.status
            this.couponCode = data.data.couponCode
          }
        } else {
          this.isMyCouponInfo = false
        }
      },
      dateReplace (val) { // 将-时间替换为/时间
        if (val) {
          var dataTime = val.replace(/-/g, '/')
          val = dataTime.substring(0, 10)
          try {
            return new Date(val).replace()
          } catch (e) {
            return val
          }
        }
      },
      navigation (companyInfo) {
        NavigationServices.navigation({
          destinationLat: companyInfo.lattitude,
          destinationLng: companyInfo.longitude,
          destinationName: companyInfo.companyName,
          region: companyInfo.cityName
        })
      }
    }
  }
</script>
<style lang='scss' rel='stylesheet/scss' scoped type="text/scss">
  @import '../../assets/css/variables-primary.scss';

  .popup {
    width: 100%;
    .telBox {
      .couponDetail-tel {
        height: 35px;
        border-top: 1px solid #d9d9d9;
        text-align: center;
        a {
          display: inline-block;
          width: 100%;
          height: 100%;
          line-height: 35px;
          color: #0164a6;
          text-decoration: none;
        }
      }
    }
    .button {
      width: 100%;
      min-height: 35px;
      height: 35px;
      line-height: 35px;
      text-align: center;
    }
  }

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
        padding-right: 15px;
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
          i {
            color: #64b3f8;
            &.isOffLine {
              color: #b9995a;
            }
          }
          span {
            font-size: 22px;
            font-weight: 600;
          }
        }
        .price1 {
          margin-top: 10px;
          margin-bottom: 2px;
        }
        .item-content-door {
          margin-bottom: 0;
          padding: 0;
          //  position: relative;
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
        .button-wrap {
          height: 100%;
          position: relative;
          padding-top: 10px;
          .number {
            text-align: center;
            padding-bottom: 8px;
            color: #ffffff
          }
          .receive {
            background-color: map_get($ComColors, wathet-blue)
          }
          i {
            font-style: normal;
            text-align: center;
            display: inline-block;
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
          }
        }
        .right-button {
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          span {
            color: white;
            font-weight: bold;
            &:first-of-type {
              font-size: 14px;
              margin-top: 6px;
              margin-right: 2px;
            }
            &:last-of-type {
              font-size: 24px;
            }
          }
        }
      }
    }
  }

  .blankDiv {
    background: #efefef;
    height: 8px;
  }

  .blankDiv2 {
    background: #efefef;
    height: 3px;
  }

  .couponWrap {
    z-index: 2;
    background: #efefef;
  }

  .cvnPrdDtl-addbox {
    border-bottom: solid 1px #efefef;
    height: 46px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .cvnPrdDtl-navigation {
      width: calc(100% - 61px);
      display: flex;
      .button-position1 {
        padding: 0px 10px 0px 14px;
        text-align: center;
        i {
          font-size: 30px;
          color: #0164a6;
        }
      }
      .cvnPrdDtl-input {
        font-size: 14px;
        height: 20px;
        line-height: 20px;
        color: #343434;
        padding-left: 6px;
        border-left: solid 4px #0164a6;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
      }
    }
    .button-position2 {
      padding-right: 14px;
      display: flex;
      align-items: center;
      span {
        width: 1px;
        height: 22px;
        margin: 0px 14px 0px 10px;
        display: inline-block;
        background-color: #dddddd;
      }
      .cvnPrdDtl-button {
        text-decoration: none;
        i {
          font-size: 29px;
          color: #0164a6;
        }
      }
    }
  }

  .per-order-card {
    padding: 4px 10px 0 10px;
    margin-bottom: 0px !important;
    margin-left: 0px !important;
    margin-right: 0px !important;
    border: none;
    .per-order-card-item {
      background-color: #fff;
      border: none;
      font-size: 14px;
      color: #2d2d2d;
      padding: 8px 0;
      border-bottom: 1px solid #ddd;
      display: flex;
      justify-content: space-between;
      .common-order-row-state {
        padding-right: 6px;
        font-size: 11px;
        color: #ff3c3c;
      }
    }
    .QRCode {
      width: 170px;
      margin: 20px auto;
      margin-bottom: 12px;
      padding: 12px;
      border: 1px solid #efefef;
      border-radius: 5px;
    }
    .per-order-code {
      text-align: center;
      margin-bottom: 10px;
      font-size: 14px;
      color: #343434;
      padding-left: 0px;
      span {
        color: #525252;
        font-size: 12px;
      }
    }
    .couponDetail-content-middle {
      position: relative;
      white-space: normal;
      font-size: 13px;
      color: #343434;
      line-height: 22px;
      div {
        font-size: 14px;
        color: #343434;
        height: 20px;
        line-height: 20px;
        border-left: solid 4px #0164a6;
        span {
          font-size: 13px;
          color: #525252;
          line-height: 25px;
        }
      }
    }
    .couponDetail-content1, .couponDetail-content2 {
      padding: 0 8px 10px 8px;
      .couponDetail-content-head {
        height: 38px;
        font-size: 15px;
        line-height: 38px;
        color: #343434;
      }
    }
    .couponDetail-content2 {
      padding: 0 8px 10px 0px;
      .couponDetail-content-head {
        height: 38px;
        font-size: 14px;
        line-height: 38px;
        color: #343434;
      }
      .couponDetail-content-middle {
        margin-left: 10px;
      }
    }
  }

  .per-order-card1 {
    padding-left: 0px;
    > div.couponDetail-content-middle {
      > div {
        padding-left: 6px;
        display: flex;
        align-items: center;
      }
    }
    .couponDetail-content2 {
      .couponDetail-content-head {
        height: 20px;
        line-height: 20px;
        padding-left: 6px;
        margin-bottom: 6px;
        margin-top: 6px;
        display: flex;
        align-items: center;
        border-left: solid 4px #0164a6;
      }
    }
  }

  .couponDetail-content-head {
    height: 20px;
    line-height: 20px;
    padding-left: 6px;
    margin-bottom: 6px;
    margin-top: 6px;
    display: flex;
    align-items: center;
    border-left: solid 4px #0164a6;
  }

  .desc-container {
    padding: 0 10px 10px 10px;
    line-height: 20px;
    p {
      text-decoration: none;
    }
    .pBtn {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .doorName {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 79%;
        display: block;
      }
      .go-look-look {
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid #066cc2;
        width: 60px;
        padding-top: 1px;
        font-size: 12px;
        color: #ffffff;
        background: #066cc2;
        border-radius: 3px;
        margin-left: 10px;
      }
    }
  }

  .footer {
    /*  position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;*/
    button {
      height: 49px;
      width: 100%;
      text-align: center;
      background-color: #0164a6;
      color: white;
      font-size: 16px;
    }
    .btnDisabled {
      background-color: #9F9E9E;
      opacity: .4;
      cursor: default !important;
      // pointer-events: none;
    }
    .share-button {
      display: flex;
      align-items: center;
      justify-content: center;
      button:nth-child(1) {
        border-right: 1px solid #ffffff;
      }
    }
    .interval-wrap {
      height: 49px;
      width: 100%;
      background-color: #066cc2;
      color: white;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      .title {
        margin-right: 10px;
      }
      .interval {
        display: flex;
        align-items: center;
        justify-content: center;
        .times {
          width: 26px;
          height: 26px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0164a6;
          font-weight: bold;
          background: #ffffff;
          border-radius: 4px;
        }
        .dot {
          font-size: 18px;
          font-weight: bold;
          margin: 0 6px;
        }
      }
    }
  }

  .button-use {
    background-color: map_get($ComColors, wathet-blue);
    color: #ffffff !important;
  }

  button[disabled] {
    opacity: .6;
  }
</style>
