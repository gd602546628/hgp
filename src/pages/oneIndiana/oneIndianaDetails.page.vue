<template>
  <zyt-page>
    <div slot="main">
      <!--导航轮播-->
      <div class="prd-slide">
        <div class="carouselBox" :style="lunboImgSty" v-if="lunboData && lunboData.length>0">
          <mt-swipe class="swipeBox" :auto="6000"
                    :prevent="false" :stopPropagation="true"
                    :showIndicators="false">
            <mt-swipe-item v-for="(it,index) in lunboData" :key="index">
              <img :src="it.url | imgPrefix" @click="showImgList(index)">
            </mt-swipe-item>
          </mt-swipe>
        </div>
        <div v-if="obyDetailsDate">
          <div v-if="obyDetailsDate.prdState != 3 && obyDetailsDate.price === 10" class="snatchData-state-img">
            <img src="../../assets/img/oneIndiana/shi_bg.png">
          </div>
          <div v-if="obyDetailsDate.prdState != 3 && obyDetailsDate.price === 100" class="snatchData-state-img">
            <img src="../../assets/img/oneIndiana/bai_bg.png">
          </div>
          <div v-if="obyDetailsDate.prdState === 3" class="snatchData-state-img">
            <img src="../../assets/img/oneIndiana/qg_bg.png">
          </div>
        </div>
      </div>
      <!--商品名称-->
      <div class="snatchDetails-info" v-if="obyDetailsDate">
        <h3 v-text="obyDetailsDate.name"></h3>
        <div class="snatchDetails-count">总次数：<span v-text="obyDetailsDate.persionTime"></span>人次</div>
        <div class="snatchList-progress-bar">
          <div :style="{width: obyDetailsDate.progress}"></div>
          <span v-text="obyDetailsDate.progress"></span>
        </div>
        <div class="snatchDetails-phase">第<span v-text="obyDetailsDate.code"></span>期</div>
        <div class="snatchDetails-needNum">还需要<span v-text="obyDetailsDate.needPersionTime">2655</span>人次</div>
      </div>

      <div class="zyt-split-line"></div>

      <div v-if="numState === 3">
        <div class="snatchDetails-count-down">
          <div>揭晓倒计时</div>
          <div class="snatchDetails-countDown-main">
            <span class="snatchDetails-countDown-time" v-text="showMinutes"></span>
            <span>:</span>
            <span class="snatchDetails-countDown-time" v-text="showSeconds"></span>
          </div>
        </div>
        <div class="zyt-split-line"></div>
      </div>
      <div v-if="numState === 1">
        <div class="snatchDetails-joinPeople">
          <div class="snatchDetails-joinPeople-info"><span>幸运用户：</span><span v-text="obyDetailsDate.userName"></span>
          </div>
          <div class="snatchDetails-joinPeople-info"><span>幸运号码：</span><span
            v-text="obyDetailsDate.winningNumbers"></span></div>
          <div class="snatchDetails-joinPeople-info"><span>参与时间：</span><span v-text="obyDetailsDate.userBuyTime"></span>
          </div>
          <div class="snatchDetails-joinPeople-info"><span>参与次数：</span><span
            v-text="obyDetailsDate.userBuyTimes"></span></div>
        </div>
        <div class="zyt-split-line"></div>
      </div>

      <div v-if="numState === 2">
        <div class="snatchDetails-count-down">
          <div class="snatchFail">夺宝失败</div>
        </div>
        <div class="zyt-split-line"></div>
      </div>

      <div class="snatchDetails-btn" v-if="obyDetailsDate" @click="goAnnounce()">
        <span>往期夺宝揭晓</span>
        <i class="icon-zyt-arrows-right"></i>
      </div>
      <div class="snatchDetails-btn" v-if="obyDetailsDate" @click="goRobRecord(obyDetailsDate.code)">
        <span>用户参与记录</span>
        <i class="icon-zyt-arrows-right"></i>
      </div>
      <div class="snatchDetails-btn" v-if="obyDetailsDate" @click="goCountRule()">
        <span>幸运号码计算规则</span>
        <i class="icon-zyt-arrows-right"></i>
      </div>

      <div class="zyt-split-line"></div>

      <!--商品详情-->
      <div class="prd-content" v-if="obyDetailsDate">
        <p>商品详情</p>
        <pre class="parse-html" v-ueditor v-html="obyDetailsDate.introduction"></pre>
      </div>

      <!--底部按钮-->
      <div class="boootomDiv" v-if="!showFooterBtn"></div>
      <div class="footerBtn">
        <button v-if="showGoBuy" class="zyt-bottom-btn-red"
                @click="goBuy()">
          立即抢宝
        </button>
        <button v-if="showGoLatest" class="zyt-bottom-btn-red"
                @click="goLatest()">
          前往最新一期
        </button>
      </div>

      <!--抢宝选项-->
      <mt-popup class="popup" v-model="popupVisible" position="bottom">
        <div>
          <div class="s-over-bg" @click="hideSpecification()"></div>
          <div class="product-specification s-transition snatchDialog-content">
            <p><span>选择参与次数</span><i @click.stop="hideSpecification()" class="icon-zyt-cancel"></i></p>
            <div class="snatchDialog-joinNum-btn">
              <input type="button" :class="{snatchSelectBtnStyle:btnStyle[0].bl}" @click="selectNum(0)" value="5次">
              <input type="button" :class="{snatchSelectBtnStyle:btnStyle[1].bl}" @click="selectNum(1)" value="10次">
              <input type="button" :class="{snatchSelectBtnStyle:btnStyle[2].bl}" @click="selectNum(2)" value="20次">
              <input type="button" :class="{snatchSelectBtnStyle:btnStyle[3].bl}" @click="selectNum(3)" value="50次">
              <div></div>
            </div>
            <div class="snatchDialog-joinNum-text">
              <span>参与次数</span>
              <input type="text" v-model="joinNum" :change="joinNumChange()"
                     onkeyup="this.value=this.value.replace(/\D/g,'')"
                     onafterpaste="this.value=this.value.replace(/\D/g,'')">
            </div>
            <div class="snatchDialog-joinNum-remain" v-if="obyDetailsDate">
              剩余参与次数<span>{{obyDetailsDate.needPersionTime}}</span>次
            </div>
            <div class="color-red">
              <div v-show="isBuy">剩余次数在付款中，暂时不能购买！</div>
              <div v-show="buyTimes">购买次数不能大于剩余次数！</div>
            </div>
            <button @click="buySubmit()" class="button button-block  zyt-bottom-btn-red ">
              确定
            </button>
          </div>
        </div>
      </mt-popup>
    </div>
  </zyt-page>
</template>

<script>
  import oneIndianaService from '../../service/oneIndiana/oneIndiana.service'
  import {Codes} from '@/config/config'
  import { mapGetters } from 'vuex'
  export default {
    name: 'oneIndianaDetails',
    components: {},
    data () {
      return {
        obyDetailsDate: null,
        lunboData: null,
        showMinutes: null,
        showSeconds: null,
        numState: 0, // 3:显示倒计时 2：显示夺宝失败 1：显示幸运号码
        showFooterBtn: true, // 显示底部按钮
        showGoLatest: false,
        showGoBuy: false,
        popupVisible: false,
        btnStyle: [{'bl': false}, {'bl': false}, {'bl': false}, {'bl': false}],
        joinNum: 1,
        isBuy: false,
        buyTimes: false,
        allNum: 0,
        addressId: null
      }
    },
    filters: {},
    computed: {
      ...mapGetters(['userInfo']),
      lunboImgSty(){
        return {
          'height': window.screen.width + 'px',
          'width': window.screen.width + 'px'
        }
      }
    },
    created(){
      this.init()
    },
    methods: {
      async init(){
        await this.paramsFn()
        await this.getOybPrdDetails()
        await this.showFooter()
      },
      paramsFn(){
        this.obyDetailsDate = null
        this.lunboData = null
        this.showMinutes = null
        this.showSeconds = null
        this.numState = 0
        this.showFooterBtn = true
        this.showGoLatest = false
        this.showGoBuy = false
        this.popupVisible = false
        this.btnStyle = [{'bl': false}, {'bl': false}, {'bl': false}, {'bl': false}]
        this.joinNum = 1
        this.isBuy = false
        this.buyTimes = false
        this.allNum = 0
        this.addressId = null
        return true
      },
      async getOybPrdDetails(reset){ // 一元夺宝详情
        let data = await oneIndianaService.getOybPrdDetails({
          code: this.$route.params.code,
          prdId: this.$route.params.prdId
        }).catch(() => {
          throw new Error('获取一元夺宝列表失败')
        })

        if (!data) {
          console.log('没有数据')
          this.noData = true
          return
        }
        this.obyDetailsDate = data.prdDetails
        this.lunboData = data.imgUrl
        return true
      },
      async showFooter(){
        if (this.obyDetailsDate.state === 1) {
          this.numState = 1
        } else if (this.obyDetailsDate.state === 3) {
          let goNext = 0
          let reg = /(-)/g
          let startTime = this.obyDetailsDate.prdExpireDate.replace(reg, '/')
          let endTime = this.obyDetailsDate.nowTime.replace(reg, '/')
          let date = new Date(startTime).getTime() - new Date(endTime).getTime()
          if (date > 0) {
            let day = Math.floor(this.date / (24 * 3600 * 1000))
            console.log('day' + day)
            let leave1 = date % (24 * 3600 * 1000)
            let leave2 = leave1 % (3600 * 1000)  // 计算小时数;后剩余的毫秒数
            let minutes = Math.floor(leave2 / (60 * 1000))
            let leave3 = leave2 % (60 * 1000) // 计算分钟数后剩余的毫秒数
            let seconds = Math.round(leave3 / 1000)
            this.numState = 3
            if (minutes === 1) {
              this.showMinutes = '0' + minutes
            } else {
              this.showMinutes = '00'
            }
            if (seconds < 10) {
              this.showSeconds = '0' + seconds
            } else {
              this.showSeconds = seconds
            }
            if (this.showSeconds >= 0) {
              var timer = function () {
                setInterval(() => {
                  this.showSeconds -= 1
                  if (this.showSeconds < 10) {
                    if (this.showSeconds === 0) {
                      this.showSeconds = '00'
                    } else if (this.showSeconds < 0) {
                      if (this.showMinutes === 1) {
                        this.showMinutes = '00'
                        this.showSeconds = 59
                      } else {
                        /* 显示开奖结果 */
                        this.numState = 1
                        goNext++
                        if (goNext === 1) {
                          this.showFooter()
                        }
                      }
                    } else {
                      this.showSeconds = '0' + this.showSeconds
                    }
                  }
                }, 1000)
              }
              timer()
            }
          } else {
            this.numState = 1
          }
        } else if (this.obyDetailsDate.state === 2) {
          this.numState = 2
        }

        let data = await oneIndianaService.goToLatestPhase({
          phaseId: this.obyDetailsDate.id
        }).catch(() => {
          throw new Error('获取前往最新一期详情失败')
        })
        if (data.code === parseInt(this.$route.params.code)) {
          if (this.obyDetailsDate.needPersionTime === 0) {
            this.showFooterBtn = true
            this.showGoLatest = false
            this.showGoBuy = false
          } else {
            if (this.numState === 0) {
              this.showGoBuy = true
              this.showFooterBtn = false
            }
          }
        } else {
          this.showGoBuy = true
          this.showFooterBtn = false
          if (this.numState !== 0) {
            this.showGoLatest = true
            this.showGoBuy = false
          }
        }
        return true
      },
      joinNumChange(){ // 输入参与次数
        if (this.joinNum !== '') {
          for (let i = 0; i < this.btnStyle.length; i++) {
            this.btnStyle[i].bl = false
          }
        }
      },
      selectNum(num){ // 选择参与次数
        for (let i = 0; i < this.btnStyle.length; i++) {
          this.btnStyle[i].bl = false
        }
        this.btnStyle[num].bl = true
        this.joinNum = ''
      },
      async goBuy() {
        this.popupFn()
        let data = await oneIndianaService.oybCarousel({
          siteId: this.$route.params.doorId
        }).catch(() => {
          throw new Error('获取一元夺宝导航轮播失败')
        })
        if (!data) { return }
        let people = this.obyDetailsDate.persionTime
        if (!this.userInfo) { return }
        if (this.userInfo.addressList && this.userInfo.addressList.length > 0) {
          this.userInfo.addressList.forEach(item => {
            if (parseInt(item.isDefault) === 1) {
              // var address = item.provinceName + item.cityName + item.countryName + item.detail
              this.addressId = item.addressId
            }
          })
          this.isBuy = false
          this.buyTimes = false
          this.allNum = people
        } else {
          this.$router.push({name: 'addressList'})
        }
      },
      buySubmit(){ // 购买操作
        var isSelect = false
        this.isBuy = false
        this.buyTimes = false
        var payNum = 0
        for (var i = 0; i < this.btnStyle.length; i++) {
          if (this.btnStyle[i].bl) {
            isSelect = true
            switch (i) {
              case 0:
                payNum = 5
                break
              case 1:
                payNum = 10
                break
              case 2:
                payNum = 20
                break
              case 3:
                payNum = 50
                break
            }
          }
        }
        if (this.joinNum) {
          if (this.joinNum > 0) {
            isSelect = true
            payNum = parseInt(this.joinNum)
          }
        }
        if (isSelect) {
          if (payNum <= this.obyDetailsDate.needPersionTime) {
            oneIndianaService.getPhaseUserBuyTimes({'phaseId': this.obyDetailsDate.id}).then((data) => {
              if (data.data <= this.allNum && (payNum + data.data) <= this.allNum) {
                /* 购买 */
                oneIndianaService.oybfsavePayOrder({
                  'quantity': payNum,
                  'phaseId': this.obyDetailsDate.id,
                  'addressId': this.addressId
                }).then((data) => {
                  if (data.code === Codes.success) { // 跳转一元夺宝支付页面
                    this.popupFn()
                    console.log('跳转一元夺宝支付页面操作')
                  } else if (data.code === Codes.code02) {
                    this.isBuy = true
                  }
                })
              } else {
                this.isBuy = true
              }
            })
          } else {
            this.buyTimes = true
          }
        }
      },
      goLatest(){ // 跳转上一期夺宝页面
        console.log('跳转上一期夺宝页面,暂时是刷新当前页面')
        this.$router.go(0)
      },
      goRobRecord(){ // 跳转抢宝记录
        this.$router.push({
          name: 'oneIndianaRobRecord',
          params: {
            phaseId: this.obyDetailsDate.id,
            doorId: this.$route.params.doorId
          }
        })
      },
      goAnnounce(){ // 跳转往期揭晓
        this.$router.push({
          name: 'oneIndianaAnnounce',
          params: {
            prdId: this.$route.params.prdId,
            doorId: this.$route.params.doorId
          }
        })
      },
      goCountRule(){ // 跳转计算规则
        console.log('跳转计算规则')
        this.$router.push({
          name: 'oneIndianaCountRule',
          params: {
            prdId: this.$route.params.prdId,
            doorId: this.$route.params.doorId,
            code: this.$route.params.code
          }
        })
      },
      popupFn(){
        this.popupVisible = !this.popupVisible
      },
      hideSpecification(){
        this.popupFn()
      }
    },
    watch: {
      '$route': {
        handler(){
          if (this.$route.name !== 'oneIndianaDetails') {
          } else {
            // if (!this.$router.isPush) return
            this.init()
          }
        }
      }
    }
  }
</script>

<style lang='scss' rel='stylesheet/scss' scoped type="text/scss">
  .prd-slide {
    .carouselBox {
      .swipeBox {
      }
      .mint-swipe {
        div.mint-swipe-items-wrap {
          .mint-swipe-item {
            img {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }
    .snatchData-state-img {
      width: 35px;
      height: 35px;
      position: absolute;
      top: 10px;
      right: 9px;
      color: #fff;
      background-size: contain;
      line-height: 12px;
      letter-spacing: 1px;
      font-size: 9px;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .snatchDetails-info {
    background-color: #fff;
    padding: 10px;
    h3 {
      line-height: 23px;
      font-size: 14px;
      margin: 0 0 5px 0;
      font-weight: 500;
    }
    .snatchList-progress-bar {
      margin-right: 60px;
      height: 11px;
      border-radius: 5px;
      border: 1px solid #ff3c3c;
      background-color: #ffb7b7;
      position: relative;
      top: 4px;
      span {
        display: block;
        width: 100%;
        height: 100%;
        text-align: center;
        font-size: 8px;
        position: absolute;
        line-height: 11px;
      }
      div {
        min-width: 1%;
        height: 100%;
        background-color: #ff3c3c;
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
        float: left;
      }
    }
  }

  .snatchDetails-count {
    color: #ff3c3c;
    font-size: 11px;
    span {
      font-size: 15px;
      color: #ff3c3c;
    }
  }

  .snatchDetails-count-down {
    height: 75px;
    background-color: #ffebeb;
    padding: 8px 0;
  }

  .snatchDetails-joinPeople {
    height: 75px;
    background-color: #ffebeb;
    padding: 8px 0px 8px 10px;
    .snatchDetails-joinPeople-info {
      line-height: 13px;
      span {
        color: #ff3c3c;
        font-size: 10px;
      }
    }
  }

  .snatchDetails-count-down {
    .snatchFail {
      margin-top: 17px;
      letter-spacing: 3px;
      font-size: 16px;
    }
    div {
      color: #ff3c3c;
      width: 95px;
      margin: 0 auto;
      text-align: center;
    }
  }

  .snatchDetails-countDown-main {
    margin-top: 10px !important;
  }

  .snatchDetails-countDown-main span {
    margin-right: 7px;
    color: #ff3c3c;
    font-size: 15px;
    font-weight: bold;
  }

  .snatchDetails-countDown-time {
    background-color: #ff3c3c;
    color: #fff !important;
    border-radius: 3px;
    padding: 6px;
  }

  .snatchDetails-countDown-time:last-child {
    margin-right: 0;
  }

  .zyt-split-line {
    width: 100%;
    height: 8px;
    background-color: #f0f2f5;
  }

  .snatchDetails-btn {
    background-color: #ffffff;
    height: 37px;
    line-height: 37px;
    padding-left: 15px;
    border-bottom: 1px solid #c7c7c7;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #343434;
    font-size: 14px;
    span {
    }
    i {
      font-size: 14px;
      margin-right: 10px;
    }
  }

  .prd-content {
    background-color: white;
    > pre {
      padding: 5px 10px;
      border-bottom: 1px solid #C7C7C7;
      p {
        span {
          width: 100%;
          overflow-x: hidden;
        }
      }
    }
    > p:first-child, .prd-comment-list > p:first-child {
      background: white;
      font-size: 14px;
      padding: 12px 10px;
      margin: 0px;
    }
  }

  .boootomDiv {
    height: 34px;
  }

  .footerBtn {
    position: fixed;
    bottom: 0px;
    left: 0px;
    width: 100%;
    .zyt-bottom-btn-red {
      padding: 7px 0px;
      width: 100%;
      margin: 0px !important;
      background-color: #066cc2;
      color: white;
      font-size: 15px !important;
      border-radius: inherit;
    }
  }

  .snatchDetails-needNum {
    margin-top: 10px;
    span {
      color: #ff3c3c;
    }
  }

  .snatchDetails-phase {
    float: right;
    width: 70px;
    text-align: right;
    margin-top: -12px;
  }

  .popup {
    width: 100%;
    .product-specification > p:first-child {
      padding: 10px 10px 0px 10px;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      span {

      }
      i {
        font-size: 25px;
      }
    }
  }

  .snatchDialog-content p,
  .snatchDialog-joinNum-text span {
    color: #525252;
  }

  .snatchDialog-joinNum-btn {
    margin: 0 10px;
    padding: 13px 0;
    border-bottom: 1px solid #c7c7c7;
  }

  .snatchDialog-joinNum-btn input {
    border-radius: 3px;
    background-color: #f0f2f5;
    border: none;
    height: 30px;
    width: 24%;
    font-size: 13px;
    float: left;
    margin-right: 1%;
  }

  .snatchDialog-joinNum-btn div {
    clear: both;
  }

  .snatchDialog-joinNum-text {
    padding: 13px 10px;
  }

  .snatchDialog-joinNum-text input {
    display: inline-block;
    width: 80px;
    height: 25px;
    background-color: #f0f2f5;
    margin-left: 10px;
    border: 1px solid #c7c7c7;
    border-radius: 3px;
    text-align: center;
    font-size: 13px;
    font-weight: bold;
  }

  .snatchDialog-joinNum-remain {
    padding: 5px 10px 18px 10px;
  }

  .snatchDialog-joinNum-remain span {
    color: #ff3c3c;
  }

  .snatchDialog-joinNum-remain + div div {
    color: #ff0000;
    font-size: 12px;
    padding-left: 10px;
    margin-top: -15px;
  }

  .snatchSelectBtnStyle {
    background-color: #ff3c3c !important;
    color: #fff;
  }

  .snatchDialog-content {
    .color-red{
      >div{
        margin-bottom: 4px;
      }
    }
    .zyt-bottom-btn-red {
      padding: 7px 0px;
      width: 100%;
      margin: 0px !important;
      background-color: #066cc2;
      color: white;
      font-size: 15px !important;
      border-radius: inherit;
    }
    .button {
    }
  }

</style>
