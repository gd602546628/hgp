<template>
  <zyt-page>
    <div slot="main" v-show="show">
      <div class="blankDiv"></div>
      <div class="couponWrap">
        <div class="coupon-wrap" v-if="coupon">
          <div class="coupon-item" :class="{isOffLine:coupon.couponType==1}" @click="goDetail(coupon)">
            <div class="topic-img" :style="{backgroundImage:'url('+topicImg(coupon)+')'}"></div>
            <div class="item-content">
              <div class="item-content-door">
                <div class="name" v-html="coupon.doorName"></div>
                <div class="distance" v-if="coupon.distance">{{distance(coupon)}}</div>
              </div>
              <p class="price1" :class="{isOffLine:coupon.couponType==1}">
                <i v-if="coupon.category==0" :class="{isOffLine:coupon.couponType==1}"> 满{{coupon.money}}元可用</i>
                <i v-if="coupon.category==1" :class="{isOffLine:coupon.couponType==1}">无门槛使用</i>
              </p>
              <pre class="content-sc">{{coupon.scName}}</pre>
              <span class="mail-type" v-if="coupon.couponType==0" :class="{isOffLine:coupon.couponType==1}">网店使用</span>
              <span class="mail-type" v-if="coupon.couponType==1" :class="{isOffLine:coupon.couponType==1}">到店使用</span>
            </div>
            <div class="item-button" v-if="!coupon.receive">
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
          <div class="button-position1 cvnPrdDtl-button">
            <i class="icon-zyt-location" style=""></i>
          </div>
          <div class="cvnPrdDtl-input">
            {{ coupon.companyInfo.provinceName + coupon.companyInfo.cityName + coupon.companyInfo.districtName +
            coupon.companyInfo.address
            }}
          </div>
        </div>
        <div class="button-position2">
          <span></span>
          <a @click="doorTel()" class="cvnPrdDtl-button">
            <i class="icon-zyt-phone2"></i>
          </a>
        </div>
      </div>
      <!--电话弹框-->
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
      <!--商品信息-->
      <div class="per-order-card" style="padding-bottom: 4px;">
        <div class="item item-divider per-order-card-item">
          <span>优惠券信息</span>
          <div class="common-order-row-state" style="color: #ff3c3c;">未使用</div>
        </div>
        <!-- 二维码 -->
        <div class="QRCode" id="coupon-QRCode"></div>
        <div class="per-order-code"><span>优惠码：</span>{{ couponCode }}</div>
      </div>

      <div class="couponDetail-splitBar"></div>
      <div class="blankDiv"></div>
      <!--订单信息-->
      <div class="per-order-card">
        <div class="couponDetail-content-middle">
          <div>使用期限：<span>{{coupon.startTime}}—{{coupon.endTime}}</span></div>
        </div>
        <div class="couponDetail-content2" v-if="coupon.explain">
          <div class="couponDetail-content-head">使用说明:</div>
          <div class="couponDetail-content-middle">{{ coupon.explain }}</div>
        </div>
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
  import {Config} from '@/config/config'
  import {mapGetters} from 'vuex'
  /* eslint-disable*/
  import QRCode from '@/service/qrCode/qrcode.service'
  export default{
    name: 'couponCenterDetail',
    components: {
      'couponCategory': couponCategory,
      'servant-sort': servantSort,
      'coupon': coupon
    },
    data(){
      return {
        show: false,
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
        tel: null
      }
    },
    computed: {
      ...mapGetters(['userInfo'])
    },
    created(){
      this.init()
    },
    methods: {
      async getCouponDetail(){ // 获取优惠劵详情
        this.params.couponIds = [parseInt(this.$route.params.couponId)]
        await couponService.getCouponDetail(this.params, {showLoading: true}).then(data => {
          this.show = true
          if (data.length === 0) {
            // TODO:没有数据时操作
            console.log('没有数据')
          }
          this.coupon = data.data[0]
          if (this.coupon.telephone && this.coupon.telephone != "") {
            this.tel = this.coupon.telephone.split(",")
          } else {
            this.tel = this.coupon.companyInfo.phone.split(",")
          }
        }).catch(e => {
          this.show = show
        })
      },
      async getUserCouponInfo(){ // 获取优惠码
        if (this.userInfo) {
          this.userParams.userCouponId = this.$route.params.userCouponId
          this.userParams.userId = this.userInfo.userId
          couponService.getUserCouponInfo(this.userParams, {showLoading: false}).then(data => {
            this.couponCode = data.data.couponCode
            if (document.getElementById('coupon-QRCode')) {
              var qrcode = new QRCode(document.getElementById('coupon-QRCode'), {
                width: 144,
                height: 144
              })
              qrcode.clear()
              /* type 为1 代表优惠券 2 代表消费券 */
              let type = (parseInt(this.$route.params.type) + 1).toString()
              qrcode.makeCode('{"type":"' + type + '","code":"' + this.couponCode + '"}')
            }
          })
        } else {
          console.log('还没登录')
        }
      },
      async getLocation(){
        let position = await locationService.getLocation().catch(() => {
          throw new Error(false)
        })
        this.params.position.latitude = position.latitude
        this.params.position.longitude = position.longitude
        return true
      },
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
      doorTel() {
        this.popupVisible = true
      },
      offDoorTel(){
        this.popupVisible = false
      },
      navigation(item){
        // TODO 导航方法
        console.log('导航方法')
        event.cancelBubble = true // 阻止冒泡
      },
      init(){
        if (typeof this.$route.params.userCouponId === 'undefined') {
          return
        }
        if (document.getElementById('coupon-QRCode')) {
          let doc = document.getElementById('coupon-QRCode')
          doc.innerHTML = ''
        }
        this.getCouponDetail()
        this.getUserCouponInfo()
      },
      goDetail(item){
        console.log('店铺优惠券详情跳转', item)
      }
    }
  }
</script>
<style lang='scss' rel='stylesheet/scss' scoped type="text/scss">
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
            background-color: #fbec4f !important;
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
        height: 30px;
        line-height: 30px;
        color: #343434;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
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
    margin-top: 8px !important;
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
      span {
        color: #525252;
        font-size: 12px;
      }
    }
    .couponDetail-content-middle {
      position: relative;
      white-space: normal;
      font-size: 13px;
      color: #525252;
      line-height: 22px;
      div, div span {
        font-size: 13px;
        color: #525252;
        line-height: 25px;
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
  }
</style>
