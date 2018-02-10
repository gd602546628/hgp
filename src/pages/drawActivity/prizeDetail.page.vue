<template>
  <zyt-page :hasFooter="true">
    <div slot="main" v-if="prizeInfo">
      <!--优惠券-->
      <div class="prize-coupon" v-if="prizeInfo.prizeType==1&&coupon">
        <div class="coupon-wrap">
          <div class="coupon-item">
            <div class="topic-img" :style="{backgroundImage:'url('+topicImg(coupon.topicImg)+')'}"></div>
            <div class="content">
              <div class="name">{{coupon.doorName}}</div>
              <div v-if="coupon.category==1">无门槛使用</div>
              <div v-if="coupon.category==0">满{{coupon.money}}元可用</div>
              <div class="time">有效期至：{{coupon.endTime}}</div>
            </div>
            <div class="button">
              <span>￥</span>
              <p>{{coupon.discountMoney}}</p>
            </div>
          </div>
        </div>
        <div class="door-info">
          <div class="info">
            <p class="name">{{coupon.companyInfo.companyName}}</p>
            <p class="address">
              {{coupon.companyInfo.provinceName}}{{coupon.companyInfo.cityName}}{{coupon.companyInfo.districtName}}{{coupon.companyInfo.address}}</p>
          </div>
          <div class="phone" @click.stop="offDoorTel()">
            <i class="icon-zyt-phone"></i>
          </div>
        </div>
        <div class="split"></div>
        <div class="coupon-info">
          <h2>优惠券说明</h2>
          <div>优惠券名称：{{coupon.name}}</div>
          <div v-if="couponCode">优惠码：{{couponCode}}</div>
          <div v-if="coupon.category==1">使用条件：无门槛使用</div>
          <div v-if="coupon.category==0">使用条件：满{{coupon.money}}使用</div>
          <div>使用期限：{{coupon.startTime}}-{{coupon.endTime}}</div>
          <div>发布商家：{{coupon.doorName}}</div>
        </div>
        <!--电话弹框-->
        <mt-popup class="popup" v-model="popupVisible" position="bottom">
          <div class="telBox">
            <div class="couponDetail-tel" v-for="item in tel">
              <a :href="'tel:' + item">{{ item }}</a>
            </div>
          </div>
          <div class="blankDiv"></div>
          <div @click.stop="offDoorTel()" class="button">
            取消
          </div>
        </mt-popup>
      </div>

      <!--商品-->
      <div class="prize-goods" v-if="prizeInfo.prizeType==2">
        <div class="header">
          <div class="img" :style="{backgroundImage:'url('+topicImg(prizeInfo.prizeImg)+')'}"></div>
          <div class="info">
            <p class="info-title">{{prizeInfo.prizeLevelName}}</p>
            <p class="info-name">{{prizeInfo.prizeName}}</p>
          </div>
        </div>
        <div class="split"></div>
        <div class="door-info">
          <div class="header" @click.stop="goDoor()">
            <img :src="prizeInfo.logo|imgPrefix" @error="noLogo($event)">
            <p>{{prizeInfo.doorName}}</p>
            <i class="icon-zyt-arrows-right"></i>
          </div>
          <div class="receive-type">
            <div class="title">奖品领取方式:</div>
            <div class="content">
              <mt-radio
                v-model="receiveParams.receiveStyle"
                :options="options">
              </mt-radio>
            </div>
          </div>
          <div class="door-address" v-if="receiveParams.receiveStyle==2" @click="navigation()">
            <p>{{prizeInfo.awardAddressName + prizeInfo.detailAddress}}</p>
            <i class="icon-zyt-location"></i>
          </div>
        </div>
        <div class="split"></div>
        <div class="receive-address"
             v-if="receiveParams.receiveStyle!=2"
             @click.stop="toChoiceAddress()">
          <div v-for="address in userInfo.addressList" v-if="address.isDefault==1">
            <p class="people">收货人：{{address.receiverName}} {{address.receiverMobile}}</p>
            <p class="address">
              收货地址：{{address.provinceName + address.cityName + address.countryName + address.detail}}</p>
          </div>
          <div v-if="noDefault" class="noDefault"> 您的收货地址为空，点击添加收货地址</div>
        </div>
        <div class="split"></div>
        <div class="prize-dis">
          <div v-ueditor v-html="prizeInfo.advMsgContent"></div>
        </div>
      </div>

    </div>
    <div slot="footer" class="footer-button"
         :class="{disable:getStatus().status==2||getStatus().status==4||getStatus().status==5||getStatus().status==6}"
         @click.stop="buttonClick()">
      {{getStatus().text}}
    </div>
  </zyt-page>
</template>
<script>
  import myService from '@/service/me/me.service'
  import couponService from '@/service/coupon/coupon.service'
  import {Config, Codes} from '@/config/config'
  import {mapGetters, mapActions} from 'vuex'
  import drawService from '@/api/draw/draw.api'
  import Util from '@/service/common/utils/util.service'
  import NavigationServices from '@/service/navigation/navigation.service'
  import TimeService from '@/service/time/time.service'
  export default{
    name: 'prizeDetail',
    data(){
      return {
        prizeInfo: null,
        coupon: null,
        couponCode: null,
        couponStatus: null,
        couponUseTime: null,
        options: [], // 领取方式选项
        receiveParams: {
          drawId: null,
          prizeId: null,
          receiveStyle: '0',
          winRecordId: null
        },
        popupVisible: false,
        tel: []
      }
    },
    created(){
      this.init()
    },
    computed: {
      ...mapGetters(['userInfo']),
      noDefault(){
        let result = false
        if (this.userInfo.addressList.length === 0) {
          result = true
        }
        this.userInfo.addressList.forEach(item => {
          if (parseInt(item.isDefault === 1)) {
            result = true
          }
        })
        return result
      }
    },
    methods: {
      ...mapActions(['getUserInfo']),
      async init(newVal, oldVal){
        if (this.$route.name !== 'prizeDetail') {
          return
        }
        await this.getPrizeInfo()
        if (parseInt(this.prizeInfo.prizeType) === 1) { // 奖品类型为优惠券获取优惠券详情
          await this.getCouponDetail()
        }
        this.receiveParams.prizeId = this.$route.params.prizeId
        this.receiveParams.drawId = this.$route.params.drawId
        this.receiveParams.winRecordId = this.$route.params.winRecordId
        await this.getUserInfo({
          address: true
        })
      },
      async getPrizeInfo(){
        let data = await myService.getCheckPrizeInfo({
          prizeId: this.$route.params.prizeId,
          winRecordId: this.$route.params.winRecordId
        })
        if (!data) {
          return
        }
        this.prizeInfo = data
        this.optionsFormat()
      },
      async getCouponDetail(){
        let data = await couponService.getCouponDetail({
          couponIds: [this.prizeInfo.couponId]
        })
        this.coupon = data.data[0]
        if (this.coupon.telephone && this.coupon.telephone !== '') {
          this.tel = this.coupon.telephone.split(',')
        } else {
          this.tel = this.coupon.companyInfo.phone.split(',')
        }
        if (parseInt(this.$route.params.userCouponId) !== -1) { // 有userCouponID时获取优惠码
          let couponCode = await couponService.getUserCouponInfo({userCouponId: this.$route.params.userCouponId})
          if (couponCode.data) {
            this.couponCode = couponCode.data.couponCode
            this.couponStatus = parseInt(couponCode.data.status)
            this.couponUseTime = couponCode.data.useTime
          } else {
            this.couponCode = null
            this.couponStatus = null
          }
        } else {
          this.couponCode = null
          this.couponStatus = null
        }
      },
      topicImg(url){ // 图片添加前缀
        if (!url) {
          return null
        }
        return Config.imgPrefix + url
      },
      optionsFormat(){ // 领取方式选项格式化
        if (!this.prizeInfo || this.prizeInfo.receiveStyle === null) return
        let options = this.prizeInfo.receiveStyle.split(',')
        let result = []
        options.forEach(item => {
          let a = {}
          if (parseInt(item) === 0) {
            a.label = '快递包邮'
            a.value = '0'
          } else if (parseInt(item) === 1) {
            a.label = '快递,邮费到付'
            a.value = '1'
          } else if (parseInt(item) === 2) {
            a.label = '到店自取'
            a.value = '2'
          }
          result.push(a)
        })
        /* this.options = result
         this.receiveParams.receiveStyle = result[0].value */

        if (this.prizeInfo.userReceiveStyle) {
          let num = parseInt(this.prizeInfo.userReceiveStyle)
          this.options = [result[num]]
          this.receiveParams.receiveStyle = result[num].value
        } else {
          this.options = result
          this.receiveParams.receiveStyle = result[0].value
        }
      },
      // 跳转选择地址
      toChoiceAddress(){
        this.$router.push({name: 'addressList'})
      },
      goDoor(){
        if (this.prizeInfo.doorId) {
          this.$router.push({
            name: 'indexDoor',
            params: {
              index: 0,
              doorId: this.prizeInfo.doorId
            }
          })
        } else {
          window.location.href = this.prizeInfo.siteOrDoorUrl
        }
      },
      // 立即领取
      async goReceive(){
        if (this.noDefault && !this.coupon) { // 没有默认地址
          await Util.confirm('您的收货地址为空！是否需要填写收货地址？', {confirmButtonText: '填写地址'})
          this.toChoiceAddress()
          return
        } else {
          let data = await drawService.userAcceptPrize(this.receiveParams)
          if (data.code !== Codes.success) {
            Util.alert(data.mesg)
            return
          }
          if (this.coupon) { // 奖品为优惠券
            this.prizeInfo.logisticsStatus = 1 // 改变一下该值，触发getStatus
            this.prizeInfo.logisticsStatus = 3
            this.couponStatus = 0
            window.location.hash = window.location.hash.replace('-1', data.data.userCouponId)
            this.$route.params.userCouponId = data.data.userCouponId // 拿到userCouponId
            await Util.confirm('领取成功，快去使用吧', {confirmButtonText: '去使用'})
            this.goUse()
          } else {
            this.prizeInfo.logisticsStatus = 2
            await Util.confirm('你的奖品正在马不停蹄地赶来，先去逛逛吧！', {confirmButtonText: '确定'}).catch(() => {
              this.init()
              throw new Error('用户点击取消')
            })
            this.goDoor()
          }
        }
      },
      // 跳转物流
      goPrizeLogistics(){
        this.$router.push({name: 'prizeLogistics', params: {winRecordId: this.$route.params.winRecordId}})
      },
      // 优惠券使用
      goUse(){
        if (parseInt(this.coupon.type) === 1) { // 线下券
          this.$router.push({
            name: 'wxCouponCenterDetail',
            params: {
              couponId: this.coupon.id,
              userCouponId: this.$route.params.userCouponId
            }
          })
        } else { // TODO 线上券
          this.$router.push({
            name: 'indexDoor',
            params: {
              index: 0,
              doorId: this.coupon.doorId
            }
          })
        }
      },
      buttonClick(){
        let fn = this.getStatus().fn
        if (fn) {
          this[fn]()
        }
      },
      showTimeOutAlert(){
        Util.alert('遗憾呢~该奖品已经过了领取时间了哦，下次早点好不好')
      },
      getStatus(){
        let statusMap = [
          {text: '立即领取', status: 0, fn: 'goReceive'},
          {text: '领奖中', status: 1, fn: 'goPrizeLogistics'},
          {text: '已领奖', status: 2, fn: null},
          {text: '立即使用', status: 3, fn: 'goUse'},
          {text: '已过领奖截止日期', status: 4, fn: 'showTimeOutAlert'},
          {text: '已使用', status: 5, fn: null},
          {text: '优惠券已过期', status: 6, fn: null}
        ]
        let prizeStatus = parseInt(this.prizeInfo.logisticsStatus)
        /* let nowTime = new Date().getTime()
         if ((nowTime > this.prizeInfo.receiveEndTime) && this.prizeInfo.receiveEndTime) {
         return statusMap[4]
         } */
        switch (prizeStatus) {
          case 0:
            return statusMap[0]
          case 1:
            return statusMap[1]
          case 2:
            return statusMap[1]
          case 3:
            if (this.coupon && this.coupon.endTime) {
              let isEnd = TimeService.date(this.coupon.endTime).getTime() < TimeService.sysTime()
              if (isEnd) {
                return statusMap[6]
              }
            }
            if (this.couponStatus === null) {
              return statusMap[2]
            } else {
              if (this.couponStatus === 1 && this.couponUseTime) {
                statusMap[5].text = `于${this.couponUseTime}使用`
                return statusMap[5]
              } else {
                return statusMap[3]
              }
            }
          case 4:
            return statusMap[4]
          default:
            console.log('商品或优惠券状态判断有误')
        }
      },
      offDoorTel(){
        this.popupVisible = !this.popupVisible
      },
      navigation () {
        let params = {
          destinationLat: this.prizeInfo.companyInfo.lattitude,
          destinationLng: this.prizeInfo.companyInfo.longitude,
          destinationName: this.prizeInfo.doorName,
          region: this.prizeInfo.companyInfo.address || this.prizeInfo.companyInfo.cityName || this.prizeInfo.companyInfo.province
        }
        NavigationServices.navigation(params)
      },
      noLogo(event){
        let img = event.srcElement
        img.src = Config.imgPrefix + this.prizeInfo.companyInfo.companyImg
        this.noLogo = function () {
        }
      }
    }
  }
</script>
<style lang='scss' rel='stylesheet/scss' type="text/scss">
  .split {
    background-color: #f0f2f5;
    height: 8px;
  }

  .prize-coupon {
    margin-bottom: 36px;
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
            color: #066cc2;
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
      background: #efefef;
      padding: 10px 0;
      .coupon-item {
        display: flex;
        padding: 8px 8px;
        background-repeat: no-repeat;
        background-size: 100% 90px;
        box-sizing: border-box;
        margin: 0px 8px 5px 8px;
        background-image: url("../../assets/img/coupon/quan04.png");
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
        .content {
          flex: 1;
          margin-left: 10px;
          padding-top: 5px;
          overflow: hidden;
          font-size: 12px;
          display: flex;
          justify-content: center;
          flex-direction: column;
          color: #b9995a;
          .time {
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            color: #343434;
          }
          .name {
            font-size: 13px;
            font-weight: bold;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #343434;
            margin-bottom: 10px;
          }
        }
        .button {
          width: 22%;
          height: 75px;
          display: flex;
          align-items: center;
          color: #ffffff;
          justify-content: center;
          span {
            font-size: 14px;
          }
          p {
            font-size: 24px;
          }
        }
      }
    }
    .door-info {
      display: flex;
      align-items: center;
      justify-content: center;
      border-top: 1px solid #d9d9d9;
      border-bottom: 1px solid #d9d9d9;
      padding: 10px;
      .info {
        flex: 1;
        border-right: 1px solid #d9d9d9;
        .address {
          color: #888888;
        }
      }
      .phone {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: 10px;
        i {
          font-size: 24px;
          color: #066cc2;
        }
      }
    }
    .coupon-info {
      padding: 0 8px 10px 8px;
      h2 {
        height: 38px;
        font-size: 15px;
        display: flex;
        align-items: center;
        color: #343434;
        font-weight: normal;
      }
      div {
        font-size: 13px;
        color: #525252;
        line-height: 25px;
      }
    }
  }

  .prize-goods {
    margin-bottom: 36px;
    .header {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px;
      .img {
        width: 80px;
        height: 80px;
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
      }
      .info {
        flex: 1;
        margin-left: 20px;
        .info-title {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: red;
          font-size: 20px;
          margin-bottom: 10px;
        }
        .info-name {
          font-size: 12px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }
    }
    .door-info {
      .header {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 10px;
        padding: 10px 0;
        border-bottom: 1px solid #f4f4f4;
        img {
          width: 36px;
          height: 36px;
        }
        p {
          flex: 1;
          margin-left: 10px;
        }
        i {
          font-size: 20px;
        }
      }
      .receive-type {
        padding: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        .title {
        }
        .content {
          flex: 1;
          .mint-cell-wrapper {
            background: none;
          }
          .mint-radiolist {
            background: none;
          }
          .mint-radiolist-title {
            display: none;
          }
          .mint-cell {
            background: none;
          }
        }
      }
      .door-address {
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px;
        border-top: 1px solid #f4f4f4;
        p {
          width: calc(100% - 40px);
          word-break: keep-all;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        i {
          font-size: 28px;
          color: #066cc2;
          padding: 0px 10px;
        }
      }
    }

    .receive-address {
      background-image: url('../../assets/img/draw/tiao.png');
      background-repeat: repeat-x;
      background-size: 100% 2px;
      background-position: bottom;
      padding: 10px 20px;
      .noDefault {
        height: 64px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .people {
        font-size: 14px;
        font-weight: 600;
        color: #2d2d2d;
      }
      .address {
        margin-top: 5px;
        font-size: 12px;
        color: #525252;
      }
    }
    .prize-dis {
      padding: 10px;
    }
  }

  .footer-button {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    background: #066cc2;
    width: 100%;
    height: 49px;
  }

  .disable {
    height: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    opacity: .4;
    background: #9F9E9E;
    position: fixed;
    bottom: 0;
    width: 100%;
  }
</style>
