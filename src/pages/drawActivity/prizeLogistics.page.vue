<template>
  <zyt-page :hasHeader="false">
    <div slot="main">
      <div class="logisticsBox" v-if="logistics">
        <img src="../../assets/img/draw/baoguo.png">
        <div class="logistics-address">
          <img src="../../assets/img/draw/k_bg.png" alt=""/>
          <div v-if="logistics.userConsignee">
            <p>收货人：{{logistics.userConsignee}}<span>{{logistics.userContact}}</span></p>
            <p>收货地址：{{logistics.userAddress}}</p>
            <p v-if="logistics.logisticsCompanyName">物流公司：{{logistics.logisticsCompanyName}}</p>
            <p v-if="logistics.logisticsCode">运单号：{{logistics.logisticsCode}}</p>
          </div>
          <div v-if="!logistics.userConsignee">
            <p>注：到店领取的奖品则不需要填写收货地址！商家会主动联系您。请在收到奖品后确认收货。</p>
          </div>
        </div>
        <div class="row logistics-btn">
          <div class="col" :class="{'disabled':!(logistics.userConsignee&&logistics.logisticsUrl)}" @click="goLogistics()">
            查看物流
          </div>
          <div class="col" :class="{'disabled':!state}" @click="confirmLogistics()">{{!state?'已确认收货':'确认收货'}}</div>
        </div>
      </div>
    </div>
  </zyt-page>
</template>
<script>
  import drawService from '@/api/draw/draw.api'
  import { Codes } from '@/config/config'
  import Util from '@/service/common/utils/util.service'
  import { mapGetters } from 'vuex'
  export default {
    name: 'prizeLogistics',
    components: {},
    data() {
      return {
        logistics: null,
        state: true
      }
    },
    created(){
      this.init()
    },
    computed: {
      ...mapGetters(['userInfo'])
    },
    /* watch: {
      '$route': 'init'
    }, */
    methods: {
      async init(){
        if (this.$route.name !== 'prizeLogistics') {
          return
        }
        this.getCheckLogisticsInfo()
      },
      async getCheckLogisticsInfo(){ // 查看奖品物流信息
        let data = await drawService.getCheckLogisticsInfo({
          winRecordId: this.$route.params.winRecordId
        })
        if (data.code !== Codes.success) {
          return
        }
        this.logistics = data.data
        console.log(this.logistics)
      },
      /**
       * 确认收货
       * @returns {boolean}
       */
      async confirmLogistics(){
        if (!this.state) {
          return false
        }
        let data = await drawService.userConfirmReceiptPrize({
          winRecordId: this.$route.params.winRecordId
        })
        if (data.code === Codes.success) {
          this.state = false
          Util.alert({
            message: '已成功确认收货'
          })
        }
      },
      goLogistics(){ // 查看物流
        if (this.logistics && this.logistics.logisticsUrl) {
          Util.openUrl(this.logistics.logisticsUrl)
        }
      }
    }
  }
</script>
<style lang='scss' rel='stylesheet/scss' type="text/scss">
  .logisticsBox {
    >img {
      width: 100%;
      vertical-align: middle;
    }
    .logistics-address {
      position: relative;
      margin: 0px 10px;
      img{
        height: 100%;
        width: 100%;
        position: absolute;
        top: 0px;
        left: 0px;
        z-index: 0;
      }
      >div {
        line-height: 30px;
        font-size: 13px;
        color: #2d2d2d;
        top: 10px;
        text-align: left;
        padding: 5px 0px;
        p{
          margin: 0px;
          padding: 0px;
          padding-left: 10px;
          padding-right: 10px;
          white-space: normal;
          span{
            margin-left: 20px;
          }
        }
      }
    }
    .logistics-btn {
      margin-top: 37px;
      margin-bottom: 20px;
      .col{
        margin: 0px 10px;
        color: white;
        height: 42px;
        line-height: 42px;
        border-radius: 4px;
        background-color: #f8311e;
        text-align: center;
      }
      .col:nth-child(2) {
        background-color: #066cc2;
      }
      .disabled {
        background-color: #9F9E9E !important;
        color: #FFFFFF !important;
      }
    }
  }

</style>
