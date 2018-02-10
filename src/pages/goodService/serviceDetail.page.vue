<template>
  <zyt-page :hasHeader="false" :hasFooter="true" v-show="show">
    <!--<mt-header title="本地服务" slot="header">
      <mt-button slot="left" icon="back" @click="handleBack"></mt-button>
    </mt-header>-->
    <div slot="main">
      <div class="goodServersDetail">
        <div class="item item-image goodServersDetail-item-image">
          <img class="goodServersDetail-header-img" :src="goodServersDetail.serviceContentImgUrl | imgPrefix">
        </div>
        <div class="item goodServersDetail-company-name">
          <h2>{{ goodServersDetail.serviceTitle }}</h2>
          <div class="row goodServersDetail-row goodServersDetail-addressOrTitle-row">
            <div class="goodServersDetail-release-time">
              <i class="icon-zyt-alarm-clock"></i>
              <span>发布时间：</span>
              <span>{{ goodServersDetail.serviceCreateTime | slice }}</span>
            </div>
            <div class="servicePv-eye">
              <i class="icon-zyt-show"></i>
              <span>{{ goodServersDetail.servicePv }}</span>
              <span>人浏览</span>
            </div>
          </div>
        </div>

        <div class="item item-divider good-servers-divider"></div>
        <div class="item goodServersDetail-company-address item-text-wrap">
          <h2>{{ goodServersDetail.serviceMerchantName }}</h2>
          <div>
            <span>{{ goodServersDetail.serviceDetailAddress }}</span>
          </div>
        </div>

        <div class="item item-divider good-servers-divider"></div>
        <div class="item item-text-wrap goodServersDetail-row-item goodServersDetail-row-item10">
          <div class="row goodServersDetail-row goodServersDetail-row-mobileOrAddress">
            <div class="col-center">
              <span class="goodServersDetail-row-matters">电话</span>
            </div
            >
            <div class="col-center">
              <span class="goodServersDetail-row-company-serversInfo">{{ goodServersDetail.serviceTel }}</span>
            </div
            >
            <a :href="'tel:' + goodServersDetail.serviceTel "
            ><i class="icon-zyt-phone2 goodServersDetail-bodyImg"></i>
            </a>
          </div>
        </div>

        <div class="item item-text-wrap goodServersDetail-row-item">
          <div class="row goodServersDetail-row goodServersDetail-row-type">
            <div class="">
              <span class="goodServersDetail-row-matters">服务类型</span>
            </div>
            <div class="">
              <span class="goodServersDetail-row-company-serversInfo">{{ goodServersDetail.serviceType }}</span>
            </div>
          </div>
        </div>

        <div class="item item-text-wrap goodServersDetail-row-item">
          <div class="row goodServersDetail-row goodServersDetail-row-type">
            <div>
              <span class="goodServersDetail-row-matters">服务区域</span>
            </div>
            <div>
              <span class="goodServersDetail-row-company-serversInfo"
              >{{ goodServersDetail.serviceAreaName }}</span>
            </div>
          </div>
        </div>

        <div class="item item-text-wrap goodServersDetail-row-item goodServersDetail-row-item10"
             v-if="goodServersDetail.serviceDetailAddress && goodServersDetail.serviceDetailAddress !== ''">
          <div class="goodServersDetail-row goodServersDetail-row-mobileOrAddress" @click="navigation">
            <div>
              <span class="goodServersDetail-row-matters">地址</span>
            </div>
            <div class="goodServersDetail-row-company-serversAddress">
              <span>{{ goodServersDetail.serviceDetailAddress }}</span>
            </div>
            <div>
              <a
                v-if="goodServersDetail.serviceLatitude && goodServersDetail.serviceLatitude !=='' && goodServersDetail.serviceLongitude && goodServersDetail.serviceLongitude !==''">
                <i class="icon-zyt-gps goodServersDetail-bodyImg" style=""></i>
              </a>
            </div>
          </div>
        </div>

        <div class="item item-divider good-servers-divider"></div>
        <div class="parseBox">
          <h2 class="goodServersDetail-row-matters">服务介绍</h2>
          <div class="goodServersDetail-servers-content" v-if="goodServersDetail.serviceDescription">
            <div class="parse-html" v-ueditor v-html="goodServersDetail.serviceDescription"></div>
          </div>
        </div>
      </div>
    </div>
    <footer slot="footer">
      <div class="row footer-row">
        <a class="button goodServersDetail-footer-button-first" :href="'tel:' + goodServersDetail.serviceTel ">
          <i class="icon-zyt-phone"></i>
          <span>电话</span>
        </a>
        <a class="button goodServersDetail-footer-button-second" :href="'sms:' + goodServersDetail.serviceTel ">
          <i class="icon-zyt-news color-white"></i>
          <span>信息</span>
        </a>
        <a class="button goodServersDetail-footer-button-last" @click="goServersAppoint(goodServersDetail)">
          <i class="icon-zyt-service"></i>
          <span>在线预约</span>
        </a>
      </div>
    </footer>
  </zyt-page>
</template>
<script>
  import goodService from '@/service/goodService/goodService.service'
  import NavigationServices from '@/service/navigation/navigation.service'
  import ToastService from '@/service/toast/toast.service'
  import WeixinService from '@/service/weixin/weixin.service'
  import Util from '@/service/common/utils/util.service'
  import haoGP from '@/assets/img/me/hao_gp.png'

  export default {
    name: 'serviceDetail',
    data() {
      return {
        show: false,
        goodServersDetail: [],
        infoId: this.$route.params.id,
        serviceAppoint: null
      }
    },
    methods: {
      async getAppoint() {
        let data = await goodService.getServiceAppoint({serviceId: parseInt(this.infoId)})
        this.serviceAppoint = data.data
      },
      async getServiceDetailInfo() { // 获取服务详情
        this.infoId = this.$route.params.id
        await goodService.getServiceDetailInfo({id: this.infoId}).then(data => {
          this.show = true
          if (data.list.length === 0) {
            // console.log('没有数据')
            this.$router.push({name: 'serversNoDetail'})
            return
          }
          this.goodServersDetail = data.list
          this.setShareInfo(this.goodServersDetail)
        }).catch(e => {
          this.show = true
        })
      },
      setShareInfo(goodServersDetail) {
        if (WeixinService.isWeixin()) {
          // 在微信分享的时候分享默认的地址
          let shareData = {
            title: goodServersDetail.serviceTitle,
            desc: '玩转城市生活？你的生活，不单调。我在好公仆等你。',
            link: window.location.href
          }
          if (goodServersDetail.serviceContentImgUrl) {
            shareData.imgUrl = Util.addImgPrefix(goodServersDetail.serviceContentImgUrl)
          } else {
            shareData.imgUrl = haoGP
          }
          WeixinService.setShare(shareData)
        }
      },
      navigation() {
        let params = {
          destinationLat: this.goodServersDetail.serviceLatitude,
          destinationLng: this.goodServersDetail.serviceLongitude,
          destinationName: this.goodServersDetail.serviceMerchantName,
          region: this.goodServersDetail.serviceDistrict || this.goodServersDetail.serviceCity || this.goodServersDetail.servicePrivnce
        }
        NavigationServices.navigation(params)
        // TODO 地图导航
      },
      async goServersAppoint(item) {
        // 预约项为空，直接提交预约
        if (typeof this.serviceAppoint && this.serviceAppoint.length === 0) {
          let submitResult = await goodService.submitServiceApply({
            document: [],
            serviceId: parseInt(this.infoId)
          })
          if (submitResult.code === '000000') {
            ToastService.bottom('预约成功')
            this.$router.replace({name: 'myServiceDetail', params: {id: submitResult.data}})
          } else {
            this.showAlert('预约失败，请稍后再试')
          }
        } else {
          this.$router.push({name: 'ServersOrderInfo', params: {id: item.id}})
        }
      },
      handleBack() {
        this.$router.go(-1)
      }
    },
    filters: {
      'slice': function (value) {
        if (value) {
          return value.slice(0, 10)
        }
      }
    },
    created() {
      this.getServiceDetailInfo()
      this.getAppoint()
    }
  }
</script>
<style lang='scss' rel='stylesheet/scss' scoped type="text/scss">
  * {
    text-decoration: none;
  }

  .goodServersDetail .item {
    border-bottom: 1px solid #efefef;
    padding-left: 12px;
    paddimg-right: 12px;
  }

  .goodServersDetail .col {
    padding-left: 0px !important;
  }

  .goodServersDetail-header-bar button {
    font-size: 14px !important;
    margin-left: 10px;
  }

  .goodServersDetail-header-bar h1 {

  }

  .goodServersDetail-item-image {
    width: 100%;
    padding: 0px !important;
    border: none !important;
  }

  .goodServersDetail .item-divider {
    min-height: 0;
  }

  .goodServersDetail-addressOrTitle-row {
    margin-bottom: -5px;
    display: flex;
    justify-content: space-between;
    align-content: center;
    .goodServersDetail-release-time {
      width: 60% !important;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: flex;
      align-items: center;
      i {
        font-size: 22px;
        color: #88888d;
        margin-right: 4px;
      }
    }
    .servicePv-eye {
      width: 40% !important;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      i {
        font-size: 22px;
        color: #88888d;
        margin-right: 4px;
      }
    }
  }

  .goodServersDetail-header-img {
    width: 100%;
    min-height: 150px;
    max-width: 100%;
  }

  .goodServersDetail-company-name {
    padding-left: 5px !important;
    padding-right: 5px !important;
    border-top: none !important;
    padding-bottom: 10px;
    padding: 10px !important;
    h2 {
      font-size: 16px;
      color: #343434;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-bottom: 6px;
    }
    span {
      font-size: 12px;
      color: #9b9b9b;
    }
  }

  .good-servers-divider {
    padding: 5px !important;
  }

  .goodServersDetail-company-address {
    padding: 10px !important;
    h2 {
      font-size: 16px;
      color: #0164a6;
      margin-bottom: 10px;
      font-weight: bold;
    }
    div span {
      font-size: 14px;
      color: #0164a6;
    }
  }

  .goodServersDetail-row-matters {
    color: #88888d !important;
    font-size: 14px !important;
  }

  .goodServersDetail-row-company-serversInfo {
    color: #343434;
    font-size: 14px;
  }

  .goodServersDetail-bodyImg {
    height: 35px !important;
    width: 35px !important;
  }

  .goodServersDetail-row-company-serversAddress span {
    color: #343434;
    font-size: 14px;
  }

  .goodServersDetail-row {
    padding: 0px 0 0 0;
    font-size: 12px;
  }

  .goodServersDetail-row img {
    height: 20px;
    width: 20px;
    vertical-align: top;
  }

  .goodServersDetail-row-item {
    padding: 15px 10px;
  }

  .goodServersDetail-row-item10 {
    padding: 10px;
  }

  .goodServersDetail-row-mobileOrAddress {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    div:first-of-type {
      width: 22%;
    }
    div:nth-of-type(2) {
      width: 70%;
      span {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }
    }
    a {
      text-decoration: none;
      i {
        margin-left: 4px;
        font-size: 28px;
        color: #0164a6;
      }
    }
  }

  .goodServersDetail-row-type {
    display: flex;
    align-items: center;
    div:first-of-type {
      width: 22%;
    }
    div:nth-of-type(2) {
      width: 78%;
      span {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }
    }
  }

  .parseBox {
    border-bottom: 1px solid #efefef;
    padding: 0px 10px;
    h2 {
      color: #88888d !important;
      font-size: 14px !important;
      font-weight: normal;
    }
  }

  .goodServersDetail-servers-content {
    font-size: 20px !important;
    color: #343434 !important;
    margin-top: 10px;
  }

  .goodServersDetail-footer {
    padding: 0;
    height: 44px !important;
  }

  .goodServersDetail-footer .row {
    padding: 0;
  }

  .goodServersDetail-footer .row a {
    padding: 0;
  }

  .goodServersDetail-footer-button-first {
    background-color: #0d7ac2;
    border-radius: 0;
  }

  .goodServersDetail-footer span {
    color: #fff;
    font-size: 16px;
    font-weight: 200;
    vertical-align: top;
  }

  .goodServersDetail-footer-button-second {
    background-color: #0164a6;
    border-radius: 0;
  }

  .goodServersDetail-footer-button-last {
    background-color: #fff;
    border-radius: 0;
    border-top: 1px solid #ddd !important;
  }

  .goodServersDetail-footer-button-last span {
    color: #0164a6;
    font-weight: bold;
  }

  .goodServersDetail-footer img {
    height: 23px;
    width: 23px;
    vertical-align: middle;
  }

  .goodServersDetail-footer .button {
    line-height: 44px !important;
  }

  .serversDel-img {
    margin-top: 20px;
    border: none;
  }

  .serversDel-prompt {
    border: none;
    margin-top: 10px;
    text-align: center;
    font-size: 16px;
  }

  .footer-row {
    display: flex;
    align-items: center;
    height: 100%;
    a {
      width: 33.33333%;
      height: 49px;
      text-decoration: none;
      display: flex;
      justify-content: center;
      align-items: center;
      i {
        font-size: 24px;
        margin-right: 4px;
      }
      .color-white:before {
        color: white !important;
      }
    }
    a:nth-of-type(1), a:nth-of-type(2) {
      color: white;
    }
    a:nth-of-type(3) {
      i {
        color: #0164a6;
      }
    }
  }

</style>
