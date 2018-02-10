<template>
  <zyt-page :hasHeader="false" :hasFooter="true">
    <div slot="main" class="scratchCardClass">
      <div class="concent" v-if="drawActivitydDetail">
        <!--活动的标题图-->
        <div class="imgBox">
          <img :src="drawActivitydDetail.drawSalesBase.titleImg | imgPrefix" alt="">
        </div>

        <!--中奖纪录和奖品轮播-->
        <drawSilde :drawActivitydDetail="drawActivitydDetail"></drawSilde>

        <!--获取抽奖机会-->
        <div class="draw-drawCondition" v-if="drawActivitydDetail.drawSalesCondition.drawCondition===1">
          <span v-if="drawNum!=null" class="draw-num">您的抽奖机会：<big>{{drawNum}}</big>次</span>
          <span class="go-to-door" @click.stop="goTodoor()">获取抽奖次数</span>
        </div>

        <!--的具体实现SVG-->
        <div id="gua1">
          <scratch-card :btnClick="begin"
                        @done="done()"
                        :prizeName="prizeName"
                        ref="scratchCard"
                        :noWinText="noWinText"
          ></scratch-card>
        </div>

        <!--活动说明-->
        <drawDesc :drawActivitydDetail="drawActivitydDetail" :isColor34="false"></drawDesc>
        <!--滑动圆圈-->
        <prize-Fall :drawActivitydDetail="drawActivitydDetail"></prize-Fall>
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
  import drawSilde from './drawActivitySilde.component'
  import drawDesc from './drawActivityDesc.component'
  import prizeFall from './drawPrizeFall.component'
  import scratchCard from '@/components/draw/scratchCard.component'
  import drawService from '@/api/draw/draw.api'
  import drawAlert from './drawAlert.service'

  export default {
    computed: {
      ...mapGetters(['userInfo', 'hasAuth'])
    },
    watch: {
      'refreshNum': 'getUserNum',
      'hasAuth': 'getUserNum'
    },
    components: {
      'drawSilde': drawSilde,
      'drawDesc': drawDesc,
      'scratch-card': scratchCard,
      'prize-Fall': prizeFall
    },
    props: ['drawActivitydDetail', 'refreshNum'],
    data() {
      return {
        prizeName: '',
        drawNum: 0,
        drawResult: null,
        noWinText: '',
        disabled: false
      }
    },
    mounted() {
      this.init()
    },
    methods: {
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
      async init() {
        await this.getUserNum()
      },
      async getUserNum() {
        if (this.hasAuth) {
          let data = await drawService.getUserNum({drawId: this.drawActivitydDetail.drawSalesBase.id})
          this.drawNum = data.data
        }
      },
      async begin() {
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
        if (data.code === '400013') {
          this.prizeName = ''
          this.noWinText = ''
          drawAlert.showNoNum(this.drawActivitydDetail.drawSalesCondition.drawNumUsed, this.drawActivitydDetail)
        } else if (data.data.noWinningPrompt) {
          this.drawNum--
          this.prizeName = ''
          this.noWinText = data.data.noWinningPrompt
          this.$refs.scratchCard.begin()
        } else {
          this.drawNum--
          this.prizeName = data.data.drawSalesPrize.prizeName
          this.$refs.scratchCard.begin()
        }
      },
      done() {
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
    background: #ff6804;

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
    background: #ff6804;

    .imgBox {

      img {
        width: 100%;
      }

    }
  }

  .footerBox {
    height: 49px;
    background: #ff6804;
    border-top: 1px solid rgba(255, 255, 255, 0.3);

    .row {
      height: 100%;

      .col {
        text-align: center;
        margin-top: -4px;

        p {
          padding: 6px 0px;
          background-color: #ffe252;
          border-radius: 14px;
          font-size: 14px;
          color: #F04442;
          border: 0px;
          letter-spacing: 2px;
          box-shadow: 0px 3.5px 0px #f04442;
        }

        .firstP {
          margin-left: 25px;
          margin-right: 10px;
        }

        .lastP {
          margin-right: 25px;
          margin-left: 10px;
        }

      }
    }
  }
</style>
