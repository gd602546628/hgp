<template>
  <zyt-page :hasHeader="false" :hasFooter="true">
    <div slot="main" class="scratchCardClass">
      <div class="concent" v-if="drawActivitydDetail">
        <!--活动的标题图-->
        <div class="imgBox">
          <img v-if="drawActivitydDetail.drawSalesBase.titleImg"
               :src="drawActivitydDetail.drawSalesBase.titleImg | imgPrefix" alt="">
          <!--<img v-if="titleImg" :src="titleImg | imgPrefix" alt="">
          <img v-if="!titleImg" src="../../assets/img/draw/top12.png" alt="">-->
        </div>

        <!--中奖纪录和奖品轮播-->
        <drawSilde :drawActivitydDetail="drawActivitydDetail" :isEightSty="true"></drawSilde>

        <!--获取抽奖机会-->
        <div class="draw-drawCondition" v-if="drawActivitydDetail.drawSalesCondition.drawCondition===1">
          <span v-if="drawNum!=null" class="draw-num">您的抽奖机会：<big>{{drawNum}}</big>次</span>
          <span class="go-to-door" @click.stop="goTodoor()">获取抽奖次数</span>
        </div>

        <!--八分的转盘实现SVG-->
        <div class="twelve-draw-box">
          <eightDraw :prizeList="drawActivitydDetail.drawSalesPrizeList"
                     @pointerClick="pointerClick()"
                     ref="eight"
                     @end="end()"
          ></eightDraw>
        </div>

        <!--活动说明-->
        <drawDesc :drawActivitydDetail="drawActivitydDetail" :isEightSty="true"></drawDesc>
        <div class="bottomDiv"></div>
      </div>
    </div>
    <div slot="footer" class="footerBox">
      <div class="row">
        <div class="col" @click="goToMyPrize()"><p class="firstP">我的奖品</p></div>
        <div class="col" @click="goTodoor()"><p class="lastP">去逛逛</p></div>
      </div>
    </div>
  </zyt-page>
</template>

<script>
  import {mapGetters} from 'Vuex'
  import drawService from '@/api/draw/draw.api'
  import drawSilde from './drawActivitySilde.component'
  import drawDesc from './drawActivityDesc.component'
  import eightDraw from '@/components/draw/eightDraw.component'
  import drawAlert from './drawAlert.service'

  export default {
    computed: {
      ...mapGetters(['userInfo', 'hasAuth'])
    },
    watch: {
      'refreshNum': 'getUserNum',
      'hasAuth': 'getUserNum'
    },
    props: ['drawActivitydDetail', 'refreshNum'],
    components: {
      'drawSilde': drawSilde,
      'drawDesc': drawDesc,
      'eightDraw': eightDraw
    },
    data() {
      return {
        drawNum: 0,
        disabled: false
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      async init() {
        await this.getUserNum()
      },
      async getUserNum() {
        if (this.hasAuth) {
          let data = await drawService.getUserNum({drawId: this.drawActivitydDetail.drawSalesBase.id})
          this.drawNum = data.data
        }
      },
      goToMyPrize() {
        this.$router.push({name: 'myPrize', params: {index: 0}})
      },
      goTodoor() {
        if (this.drawActivitydDetail.drawSalesBase.siteId) {
          this.$router.push({
            name: 'indexDoor',
            params: {index: 0, doorId: this.drawActivitydDetail.drawSalesBase.siteId}
          })
        }
      },
      async pointerClick() {
        if (this.disabled) return
        this.disabled = true
        let data = await drawService.toDraw({
          drawId: this.drawActivitydDetail.drawSalesBase.id,
          siteId: this.drawActivitydDetail.drawSalesBase.siteId
        }).catch(e => {
          this.disabled = false
        })
        this.drawResult = data.data
        if (data.code !== '400013' && data.code !== '000000') {
          drawAlert.showAlert(data.mesg, this.drawActivitydDetail)
          this.disabled = false
          return
        }
        if (data.code === '400013') { // 没有次数
          drawAlert.showNoNum(this.drawActivitydDetail.drawSalesCondition.drawNumUsed, this.drawActivitydDetail)
        } else if (data.data.noWinningPrompt) { // 没中奖
          this.drawNum--
          this.$refs.eight.begin(-1)
        } else {  // 中奖
          this.drawNum--
          this.$refs.eight.begin(data.data.drawSalesPrize.id)
        }
      },
      end() {
        this.disabled = false
        if (this.drawResult.noWinningPrompt) {
          drawAlert.showNoWin(this.drawResult.noWinningPrompt, this.drawActivitydDetail)
        } else {
          drawAlert.showWin(this.drawResult, this.drawActivitydDetail)
        }
      }
    }
  }
</script>

<style lang='scss' rel='stylesheet/scss' scoped type="text/scss">

  .scratchCardClass {
    background: #fce243;
    .draw-drawCondition {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
      .draw-num {
        color: #ffdc63;
        big {
          color: #ffffff;
          margin-right: 6px;
        }
      }
      .go-to-door {
        margin: 0 10px;
        padding: 5px 10px;
        font-size: 12px;
        color: #fc3476;
        background-color: #fed201;
        border-radius: 5px;
      }
    }
  }

  .concent {
    background: #fce243;
    .imgBox {
      img {
        width: 100%;
      }
    }
    .twelve-draw-box {
      margin: 10px 0px 20px 0px;
    }
    .bottomDiv {
      height: 20px;
      background-color: #fce243;
    }
  }

  .footerBox {
    height: 49px;
    background: #ffd35e;
    border-top: 1px solid rgba(255, 122, 0, 0.3);
    .row {
      height: 100%;
      .col {
        text-align: center;
        p {
          padding: 8px 0px;
          border-radius: 6px;
          border: 1px solid #fff003;
          text-shadow: 0 0 1px #b54a07;
          -webkit-text-shadow: 0 0 1px #b54a07;
          color: #ffea45;
          font-size: 14px;
        }
        .firstP {
          margin-left: 10px;
          margin-right: 10px;
          background: -webkit-linear-gradient(top, #ffa500, #ff7100);
        }
        .lastP {
          margin-right: 10px;
          margin-left: 10px;
          background: -webkit-linear-gradient(top, #f9544e, #e10105)
        }
      }
    }
  }
</style>
