<template>
  <zyt-page :enableInfinite="!dataFinish"
            :enableRefresh="true"
            :on-infinite="loadMore"
            :on-refresh="onRefresh"
  >
    <div slot="main">
      <div class="consume-info">
        <div class="consume-left-box">
          <span class="consume-left-label"></span>
          <span class="consume-left-font">消费券</span>
        </div>
        <div class="consume-code" v-for="(item,index) in consumeDataCode">
          <div class="code" v-if="item.status === 0">{{item.consumerCode}}</div>
          <div class="code1" v-else="item.status === 1">{{item.consumerCode}}</div>
          <div class="open-code" v-if="item.status === 0">
            <span>{{showState(item)}}</span>
            <img @click.stop="showQRcode(item.consumerCode, consumeDataList)" src="../../../assets/img/ewm01.png">
          </div>
          <div class="open-code1" v-else="item.status === 1">
            <span>{{showState(item)}}</span>
            <img  src="../../../assets/img/ewm02.png">
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
              <div>
                <img class="img" :src="logo | imgPrefix">
                <span>{{name}}</span>
              </div>
              <i class="icon-zyt-arrows-right"></i>
            </div>
            <div class="code">{{QRcode}}</div>
            <div class="qr-wrap" ref="qrWrap"></div>
            <i class="icon-zyt-cancel" @click.stop="closeQRCode()"></i>
          </div>
        </mt-popup>
      </div>
    </div>
  </zyt-page>
</template>
<script>
  import api from '@/api/user/user.api'
  import QRCode from '@/service/qrCode/qrcode.service'

  export default {
    name: 'consumeList',
    data () {
      return {
        ListParams: {
          pageNum: 1,
          pageSize: 20
        },
        consumeDataList: [],
        consumeDataCode: [],
        showCode: false,
        QRcode: null,
        logo: null,
        name: null,
        dataFinish: false,
        pageFlag: false
      }
    },
    methods: {
      getConsumeOrderList (reset) {
        let params = {
          orderId: this.$route.params.orderId,
          doorId: this.$route.params.doorId,
          pageNum: this.ListParams.pageNum,
          pageSize: this.ListParams.pageSize
        }
        api.getConsumeOrderList(params).then(data => {
          this.consumeDataList = data.data
          console.log(this.consumeDataList.doorInfo.logo)
          /* this.$nextTick(() => {
           this.createQRCode()
           }) */
          if (data.data.page.pageNum < data.data.page.totalPage) {
            this.dataFinish = false
            this.pageFlag = false
          } else {
            this.dataFinish = true
            this.pageFlag = true
          }
          if (reset) {
            this.consumeDataCode = data.data.consumeList
          } else {
            this.consumeDataCode = this.consumeDataCode.concat(data.data.consumeList)
          }
        })
      },
      showState(item){
        if (item.status === 0){
          return '未消费'
        } else if (item.status === 1){
          return '已消费'
        }
      },
      onRefresh (done) { // 下拉刷新
        done()
        this.getConsumeOrderList()
      },
      async loadMore (done) { // 上拉加载
        if (this.dataFinish) {
          done && done(true)
          return
        }
        this.ListParams.pageNum++
        await this.getConsumeOrderList(false)
        done && done()
      },
      showQRcode (code, consumeDataList) {
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
      },
      closeQRCode(){
        this.showCode = false
      },
      goDoor () {
        this.$router.push({
          name: 'indexDoor',
          params: {
            index: '0',
            doorId: this.$route.params.doorId
          }
        })
      },
      async init () {
        this.ListParams.pageNum = 1
        this.pageFlag = false
        this.getConsumeOrderList()
      }
    },
    created () {
      this.init()
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  .consume-info {
    padding: 10px 0;
    .consume-left-box {
      display: -webkit-flex;
      -webkit-justify-content: flex-start;
      -webkit-align-items: center;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .consume-left-label {
        height: 15px;
        width: 5px;
        background-color: #066cc2;
        margin-right: 5px;
        display: block;
      }
      .consume-left-font {

      }
    }
    .consume-code {
      margin-top: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 10px;
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
        justify-content: space-between;
        padding: 0px 16px 10px 16px;
        width: 100%;
        border-bottom: 1px solid #f4f4f4;
        div {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          img {
            height: 20px;
            width: 20px;
            display: block;
          }
          span {
            flex: 1;
            margin-left: 10px;
          }
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
