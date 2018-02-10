<template>
  <zyt-page>
    <div class="consume-detail" v-if="consumeDetail" slot="main">
      <div class="prd-list">
        <div class="prd-item" v-for="prd in consumeDetail.prdInfos" @click.stop="goPrd()">
          <div class="avatar" :style="{backgroundImage:'url('+imgPrefix(prd.prdImg)+')'}"></div>
          <div class="content">
            <div class="prd-name">{{prd.prdName}}</div>
            <div class="prd-size">{{prd.fpName}}: {{prd.fpValue}}</div>
            <div class="prd-num">
              <span class="num">X{{prd.num}}</span>
              <price-component :price="prd.totalPrice" class="price"></price-component>
            </div>
          </div>
        </div>
      </div>

      <div class="split-bar"></div>

      <div class="consume-info">
        <div class="header">
          <div class="icon"></div>
          <div class="title">消费券</div>
        </div>
        <div class="consume-code" v-for="(item,index) in consumeDetail.consumeList" v-if="index<3">
          <div class="code" v-if="item.status === 0">{{item.consumerCode}}</div>
          <div class="code1" v-else="item.status === 1">{{item.consumerCode}}</div>
          <div class="open-code" v-if="item.status=== 0">
            <span>{{showState(item)}}</span>
            <img @click.stop="showQRcode(item.consumerCode, consumeDetail)" src="../../../assets/img/ewm01.png">
          </div>
          <div class="open-code1" v-else="item.status === 1">
            <span>{{showState(item)}}</span>
            <img  src="../../../assets/img/ewm02.png">
          </div>
        </div>
        <div class="code-look-more" @click="goLookMore()" v-if="consumeDetail.consumeList.length>3"><span>查看更多</span>
        </div>
      </div>

      <div class="split-bar"></div>

      <div class="order-info">
        <div class="header">
          <div class="icon"></div>
          <div class="title">订单信息</div>
        </div>
        <div class="info">
          订单号： {{consumeDetail.orderDetail.code}}
        </div>
        <div class="info">
          付款时间： {{consumeDetail.orderDetail.payTime}}
        </div>
        <div class="info">
          商品数量： {{consumeDetail.prdInfos[0].num}}
        </div>
        <div class="info">
          商品总价：
          <price-component :price="consumeDetail.orderDetail.totalPrice"></price-component>
        </div>
      </div>

      <div class="split-bar"></div>

      <div class="door-info">
        <div class="header">
          <div class="icon"></div>
          <div class="title">商家信息</div>
        </div>
        <div class="info go-door">
          <p class="name">店铺名称：{{consumeDetail.doorInfo.name}}</p>
          <p class="icon" @click.stop="goDoor()">进入店铺</p>
        </div>
        <div class="info">
          联系电话：{{consumeDetail.doorInfo.tel}}
        </div>
        <div class="info">
          店铺地址：{{consumeDetail.doorInfo.address}}
        </div>
      </div>

      <mt-popup
        v-model="showCode"
        popup-transition="popup-fade"
        position="middle"
        class="qr-popup"
      >
        <div class="qr-code">
          <div class="code-header" @click.stop="goDoor()">
            <img class="img" :src="logo | imgPrefix">
            <span>{{name}}</span>
            <i class="icon-zyt-arrows-right"></i>
          </div>
          <div class="code">{{QRcode}}</div>
          <div class="qr-wrap" ref="qrWrap"></div>
          <i class="icon-zyt-cancel" @click.stop="closeQRCode()"></i>
        </div>
      </mt-popup>
    </div>
  </zyt-page>
</template>
<script>
  import api from '@/api/user/user.api'
  import PriceComponent from '@/components/common/price/price.component'
  import {Config} from '@/config/config'
  import QRCode from '@/service/qrCode/qrcode.service'
  export default{
    name: 'consumeDetail',
    components: {
      'price-component': PriceComponent
    },
    computed: {
      consumeText(){
        if (this.consumeDetail) {
          return parseInt(this.consumeDetail.prdInfos[0].orderStatus) === 2 ? '未消费' : '已消费'
        }
        return ''
      }
    },
    data(){
      return {
        consumeDetail: null,
        showCode: false,
        QRcode: null,
        logo: null,
        name: null
      }
    },
    created(){
      this.init()
    },
    methods: {
      async init(){
        let data = await api.getConsumeOrderInfo({
          doorId: this.$route.params.doorId,
          orderId: this.$route.params.orderId
        })
        this.consumeDetail = data.data
       /* this.$nextTick(() => {
          this.showQRcode()
        }) */
      },
      showState(item){
        if (item.status === 0){
          return '未消费'
        } else if (item.status === 1){
          return '已消费'
        }
      },
      imgPrefix(url){
        return Config.imgPrefix + url
      },
      closeQRCode(){
        this.showCode = false
      },
      goDoor(){
        this.$router.push({
          name: 'indexDoor',
          params: {
            index: '0',
            doorId: this.consumeDetail.orderDetail.doorId
          }
        })
      },
      goLookMore(){
        this.$router.push({
          name: 'consumeList',
          params: {
            orderId: this.$route.params.orderId,
            doorId: this.$route.params.doorId
          }
        })
      },
      goPrd(){
        this.$router.push({
          name: 'productInfo',
          params: {
            doorId: this.consumeDetail.orderDetail.doorId,
            prdId: this.consumeDetail.prdInfos[0].prdId
          }
        })
      },
      showQRcode(code, consumeDataList){
        this.QRcode = code
        this.logo = consumeDataList.doorInfo.logo
        this.name = consumeDataList.doorInfo.name
        let wrap = this.$refs.qrWrap
        wrap.innerHTML = ''
        let qr = new QRCode(wrap, {
          width: 144,
          height: 144
        })
        qr.makeCode(JSON.stringify({type: '2', code: code}))
        this.showCode = true
      }
    }
  }
</script>
<style lang='scss' rel='stylesheet/scss' scoped>
  .consume-detail {
    color: #2d2d2d;
    .split-bar {
      background: #f0f2f5;
      height: 10px;
    }
    .header {
      display: flex;
      align-items: center;
      height: 20px;
      background: #ffffff;
      .icon {
        width: 6px;
        height: 14px;
        background: #0164a6;
        margin-right: 10px;
      }
    }
    .prd-list {
      background: #ffffff;
      .prd-item {
        padding: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        .avatar {
          width: 70px;
          height: 70px;
          background-size: cover;
          background-repeat: no-repeat;
          background-position: center;
        }
        .content {
          flex: 1;
          margin-left: 10px;
          .prd-size {
            margin-top: 6px;
            margin-bottom: 6px;
          }
          .prd-num {
            display: -webkit-flex;
            -webkit-justify-content: space-between;
            -webkit-align-items: center;
            justify-content: space-between;
            align-items: center;
            .num {
              flex: 1;
            }
            .price {
              color: #0164a6;
            }
          }
        }
      }
    }
    .consume-info {
      padding: 10px;
      .consume-code {
        margin-top: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        .code {
          flex: 1;
        }
        .code1{
          flex:1;
          color: #88888d;
        }
        .open-code {
          display: -webkit-flex;
          align-items: center;
          justify-content: center;
          color: #0164a6;
          img {
            width: 20px;
            height: 20px;
            margin-left: 16px;
          }
          span {
            flex: 1;
          }
        }
         .open-code1{
          display: -webkit-flex;
          align-items: center;
          justify-content: center;
          color: #88888d;
          img {
            width: 20px;
            height: 20px;
            margin-left: 16px;
          }
          span {
            flex: 1;
          }
        }
      }
      .code-look-more {
        display: -webkit-flex;
        -webkit-justify-content: center;
        -webkit-align-items: center;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        span {
          display: -webkit-flex;
          -webkit-justify-content: center;
          -webkit-align-items: center;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #0164a6;
          color: #ffffff;
          font-size: 12px;
          border-radius: 5px;
          padding: 5px 10px 5px 10px;
        }
      }
    }
    .order-info {
      padding: 10px;
      .header {
        margin-bottom: 16px;
      }
      .info {
        margin-top: 6px;
      }
    }
    .door-info {
      padding: 10px;
      .header {
        margin-bottom: 16px;
      }
      .info {
        margin-top: 6px;
      }
      .go-door {
        display: flex;
        align-items: center;
        justify-content: center;
        .name {
          flex: 1;
        }
        .icon {
          border: 1px solid #066cc2;
          width: 68px;
          height: 24px;
          font-size: 12px;
          color: #fff;
          background-color: #066cc2;
          border-radius: 3px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
    .qr-popup {
      border-radius: 6px;
    }
    .qr-code {
      width: 224px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      padding: 20px 0 20px 0;
      background: #ffffff;
      border: 1px solid #ffffff;
      border-radius: 6px;
      position: relative;
      .code-header {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0px 16px 10px 16px;
        width: 100%;
        border-bottom: 1px solid #f4f4f4;
        img {
          height: 20px;
          width: 20px;
        }
        span {
          flex: 1;
          margin-left: 10px;
        }
      }
      .code {
        margin: 10px 0;
      }
      .icon-zyt-cancel {
        position: absolute;
        right: 0;
        top: -40px;
        font-size: 30px;
        color: #ffffff;
      }
    }
  }
</style>
