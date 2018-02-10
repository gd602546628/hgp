<template>
  <div class="draw-alert" v-if="show">
    <div class="win" v-if="status==0">
      <div :class="{coupon:drawResult.drawSalesPrize.prizeType===1}" src="../../assets/img/draw/zi_sw.png" class="bg">
        <div v-if="drawResult.drawSalesPrize.prizeType===2" class="prize">
          <img :src="drawResult.drawSalesPrize.prizeImg | imgPrefix" v-if="drawResult">
          <p>{{drawResult.drawSalesPrize.prizeName}}</p>
        </div>
        <div v-if="drawResult.drawSalesPrize.prizeType===1" class="coupon-container">
          <p class="draw-yhq-bg-name" v-if="couponInfo.category==1">
            <span>￥</span><span>{{couponInfo.discountMoney}}</span><span>代金券</span><br><span>无门槛使用</span>
          </p>
          <p class="draw-yhq-bg-name" v-if="couponInfo.category!=1">
            <span>￥</span><span>{{couponInfo.discountMoney}}</span><span>优惠券</span><br><span>满{{couponInfo.money}}元使用</span>
          </p>
        </div>
        <div class="button">
          <span class="share" @click.stop="toShare()">分享给好友</span>
          <span class="receive" @click.stop="toReceive()" :disabled="!canReceive">去领奖</span>
        </div>
        <i class="icon-zyt-cancel icon" @click.stop="close()"></i>
      </div>
    </div>
    <div class="no-win" v-if="status==1">
      <div class="bg">
        <div class="text">{{noWinText}}</div>
        <div class="button" @click.stop="toShare()">分享给好友</div>
      </div>
      <i class="icon-zyt-cancel icon" @click.stop="close()"></i>
    </div>
    <div class="no-num" v-if="status==2">
      <div class="bg">
        <div class="text">{{noNumText}}</div>
        <div class="button" @click.stop="toShare()">分享给好友</div>
      </div>
      <i class="icon-zyt-cancel icon" @click.stop="close()"></i>
    </div>
    <div class="no-num" v-if="status==3">
      <div class="bg">
        <div class="text">{{msg}}</div>
        <div class="button" @click.stop="close()">确定</div>
        <i class="icon-zyt-cancel icon" @click.stop="close()"></i>
      </div>
      <!--<img class="bg" src="../../assets/img/draw/text_bg.png">-->
    </div>
  </div>
</template>
<script>
  import route from '@/router/index'
  import ShareService from '@/service/share/share.service'
  import Utils from '@/service/common/utils/util.service'
  import couponService from '@/service/coupon/coupon.service'
  import {Codes} from '@/config/config'
  export default{
    data(){
      return {
        status: 0,
        show: false,
        drawResult: null,
        drawInfo: {},
        noWinText: '',
        noNumText: '',
        msg: '',
        shared: false,
        couponInfo: {}
      }
    },
    watch: {
      drawResult(){
        if (this.drawResult && this.drawResult.drawSalesPrize && this.drawResult.drawSalesPrize.couponId) {
          this.getCouponDetail(this.drawResult.drawSalesPrize.couponId)
        }
      }
    },
    computed: {
      canReceive(){
        return this.shared || this.drawInfo.drawSalesBase.isCompulsoryShare === 1
      }
    },
    methods: {
      async getCouponDetail(couponId){
        let couponInfos = await couponService.getCouponDetail({
          couponIds: [this.drawResult.drawSalesPrize.couponId]
        }).catch(e => {
        })
        if (couponInfos.code === Codes.success && couponInfos.data) {
          this.couponInfo = couponInfos.data[0]
        }
      },
      close(){
        this.show = false
      },
      // TODO 分享
      toShare(){
        let title = this.drawInfo.drawSalesBase.name
        let imgUrl = Utils.addImgPrefix(this.drawInfo.drawSalesBase.name)
        let desc = title
        let link = window.location.href
        let shareData = {
          title: title,
          imgUrl: imgUrl,
          desc: desc,
          link: link
        }
        ShareService.doShare(shareData).then((data) => {
          Utils.alert(1 + JSON.stringify(data))
          this.shared = true
          if (this.status !== 0) {
            this.close()
          }
        }).catch(e => {
          Utils.alert(2 + JSON.stringify(e))
        })
      },
      toReceive(){
        if (!this.canReceive) {
          return
        }
        this.close()
        route.push({
          name: 'prizeDetail',
          params: {
            drawId: this.drawResult.drawSalesPrize.drawSalesId,
            prizeId: this.drawResult.drawSalesPrize.id,
            winRecordId: this.drawResult.winRecordId,
            userCouponId: -1
          }
        })
      }
    }
  }
</script>
<style lang='scss' rel='stylesheet/scss' scoped type="text/scss">
  .draw-alert {
    width: 100%;
    position: fixed;
    top: 0;
    bottom: 0;
    z-index: 10;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    .win {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      .bg {
        width: 70%;
        height: 360px;
        margin: 0 15%;
        border-radius: 5px;
        display: -webkit-flex;
        -webkit-justify-content: center;
        -webkit-align-items: center;
        -webkit-flex-direction: column;
        display: flex;
        justify-content: center;
        align-items: center;
        background-size: cover;
        background-repeat: no-repeat;
        flex-direction: column;
        background-image: url("../../assets/img/draw/zi_sw.png");
        background-position: center;
        position: relative;
        &.coupon {
          background-image: url("../../assets/img/draw/zj_yhj.png");
        }
      }
      .button {
        position: absolute;
        bottom: 20px;
        width: 100%;
        padding: 0 4%;
        display: flex;
        align-items: center;
        justify-content: center;
        span {
          display: -webkit-flex;
          display: flex;
          -webkit-justify-content: center;
          -webkit-align-items: center;
          align-items: center;
          justify-content: center;
          flex: 1;
          height: 30px;
          border-radius: 6px;
          width: 50%;
        }
        .share {
          background-color: #fb657d;
          color: white;
        }
        .receive {
          background-color: white;
          color: #e73955;
          margin-left: 6%;
          &[disabled] {
            opacity: .5;
          }
        }
      }
      .prize {
        /*position: absolute;*/
        width: 70%;
        height: 100%;
        display: -webkit-flex;
        display: flex;
        -webkit-align-items: center;
        -webkit-justify-content: center;
        -webkit-flex-direction: column;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        margin-top: 15px;
        img {
          max-height: 200px;
          width: 70%;
          display: block;
        }
        p {
          color: #ffffff;
          font-size: 16px;
          display: block;
        }
      }
      .icon {
        position: absolute;
        top: -16%;
        right: -7%;
        font-size: 40px;
        color: #ffffff;
        z-index: 10;
      }
    }
    .no-win, .no-num {
      width: 100%;
      position: relative;
      .bg {
        width: 80%;
        min-height: 250px;
        max-height: 360px;
        margin: 0 10%;
        display: -webkit-flex;
        -webkit-justify-content: space-between;
        -webkit-align-items: center;
        -webkit-flex-direction: column;
        display: flex;
        justify-content: space-between;
        padding: 10% 0;
        align-items: center;
        background-size: cover;
        background-repeat: no-repeat;
        border-radius: 5px;
        flex-direction: column;
        background-image: url("../../assets/img/draw/text_bg.png");
        position: relative;
      }
      .text {
        width: 89%;
        font-size: 18px;
        color: #fce458;
        display: -webkit-flex;
        -webkit-justify-content: center;
        -webkit-align-items: center;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 20px;
        text-align: center;
      }
      .button {
        /*position: absolute;*/
        bottom: 20px;
        border-radius: 12px;
        background-color: white;
        color: #e73955;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 65%;
      }
      .icon {
        position: absolute;
        top: -16%;
        right: 6%;
        font-size: 40px;
        color: #ffffff;
        z-index: 10;
      }
    }
  }

  .coupon-container {
    margin-left: 5px;
  }

  .draw-yhq-bg-name {
    text-align: center;
  }

  .draw-yhq-bg-name, .draw-yhq-bg-name span {
    vertical-align: bottom;
    margin-bottom: 40%;
  }

  .draw-yhq-bg-name span:nth-child(1) {
    font-size: 13px;
    font-weight: 600;
  }

  .draw-yhq-bg-name span:nth-child(2) {
    font-size: 30px;
    margin-bottom: -5px;
  }

  .draw-yhq-bg-name span:nth-child(3) {
    font-size: 12px;
  }

  .draw-yhq-bg-name span:nth-child(4) {
    font-size: 14px;
  }
</style>
