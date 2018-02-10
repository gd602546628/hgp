<template>
  <zyt-page>
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
          <div class="header" @click.stop="goDoor(prizeInfo)">
            <img :src="prizeInfo.logo">
            <p>{{prizeInfo.doorName}}</p>
            <i class="icon-zyt-arrows-right"></i>
          </div>
        </div>
        <div class="split"></div>
        <div class="prize-dis">
          <div class="parse-html" v-ueditor v-html="prizeInfo.advMsgContent"></div>
        </div>
      </div>
    </div>
  </zyt-page>
</template>
<script>
  import drawService from '@/api/draw/draw.api'
  import couponService from '@/service/coupon/coupon.service'
  import {Config} from '@/config/config'
  export default{
    name: 'drawPrizeInfo',
    data(){
      return {
        prizeInfo: null,
        coupon: null,
        couponCode: null,
        popupVisible: false,
        tel: []
      }
    },
    created(){
      this.init()
    },
    methods: {
      async init(){
        await this.getPrizeInfo()
        if (parseInt(this.prizeInfo.prizeType) === 1) { // 奖品类型为优惠券获取优惠券详情
          await this.getCouponDetail()
        }
      },
      async getPrizeInfo(){
        let data = await drawService.getDrawDetail({
          drawId: this.$route.params.drawId
        })
        data.data.drawSalesPrizeList.forEach(item => {
          if (parseInt(item.id) === parseInt(this.$route.params.prizeId)) {
            this.prizeInfo = item
          }
        })
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
      },
      topicImg(url){ // 图片添加前缀
        if (!url) {
          return null
        }
        return Config.imgPrefix + url
      },
      offDoorTel(){
        this.popupVisible = !this.popupVisible
      },
      goDoor(prize){
        this.$router.push({
          name: 'indexDoor',
          params: {
            index: 0,
            doorId: prize.doorId
          }
        })
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
          color: #0164a6;
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
        padding: 10px;
        border-top: 1px solid #f4f4f4;
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
    height: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    background: #0164a6;
    position: fixed;
    bottom: 0;
    width: 100%;
  }
</style>
