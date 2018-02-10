<template>
  <div class="ra-desc"
       :class="{'ra-desc-34': isColor34, 'eightSty': isEightSty, 'sixSty': isSixSty}"
       v-if="drawActivitydDetail">

    <h4>活动说明</h4>
    <p class="font-weight">活动时间</p>
    <label class="draw-time"
           v-show="drawActivitydDetail.drawSalesBase.startTime"><span>{{drawActivitydDetail.drawSalesBase.startTime}}</span>
      至 <span>{{drawActivitydDetail.drawSalesBase.endTime}}</span></label>

    <p class="font-weight ra-desc-introduce">活动说明</p>
    <div v-if="drawActivitydDetail.drawSalesCondition.drawCondition!=1">
      <p><span>1、参与条件：</span><span>本次活动{{drawCondition[drawActivitydDetail.drawSalesCondition.drawCondition]}}</span>
      </p>
      <p>
        <span>2、参与次数：</span>
        <span
          v-show="drawActivitydDetail.drawSalesCondition.participateNum == 5">活动期间，每人{{drawActivitydDetail.drawSalesCondition.drawNum}}次参与机会</span>
        <span
          v-show="drawActivitydDetail.drawSalesCondition.participateNum == 6">活动期间，每人每天{{drawActivitydDetail.drawSalesCondition.drawNum}}次参与机会</span>
      </p>
      <p><span>3、奖品领取时间：</span><span>即日起至{{ drawActivitydDetail.drawSalesCondition.receiveEndTime
        }}可领取活动奖品，过期则不予领取</span></p>
      <p v-if="doorInfo"><span>4、本次活动最终解释权归{{doorInfo.name}}所有</span></p>
      <p v-if="drawActivitydDetail.drawSalesCondition.instruction" class="font-weight ra-desc-introduce">活动说明</p>
    </div>

    <div class="draw-ueditor" v-if="drawActivitydDetail.drawSalesCondition.instruction">
      <pre class="v-html" v-ueditor v-html="drawActivitydDetail.drawSalesCondition.instruction"></pre>
    </div>
    <p v-if="isIos" style="margin-top: 15px;"><span>注：本次活动与苹果公司无关</span></p>
  </div>
</template>

<script>
  import DoorApi from '@/api/door/door.api'
  export default {
    props: {
      drawActivitydDetail: {
        default: null,
        type: Object
      },
      isColor34: {
        default: true,
        type: Boolean
      },
      isEightSty: {
        default: false,
        type: Boolean
      },
      isSixSty: {
        default: false,
        type: Boolean
      }
    },
    data() {
      return {
        doorInfo: null,
        isIos: false,
        drawCondition: {
          0: '无条件参与',
          1: '付费参与',
          2: '会员可参与',
          3: '消费可参与',
          4: '收藏店铺可参与',
          5: '加入'
        }
      }
    },
    created(){
      this.getDoorInfo()
      this.showPhone()
    },
    computed: {},
    watch: {},
    methods: {
      async getDoorInfo(){
        if (this.drawActivitydDetail.drawSalesBase.siteId) {
          let doorInfo = await DoorApi.getDoorInfo(this.drawActivitydDetail.drawSalesBase.siteId)
          if (doorInfo) {
            this.doorInfo = doorInfo
          }
        }
      },
      showPhone(){
        var u = navigator.userAgent
        if (u.indexOf('android') > -1) {
          this.isIos = false
        } else {
          this.isIos = true
        }
      }
    }
  }
</script>

<style lang='scss' rel='stylesheet/scss' scoped>
  .ra-desc {
    margin: 40px 10px 0px 12.5px;
    padding: 0px 32.5px 35px 32.5px;
    border-radius: 4px;
    position: relative;
    font-size: 12px;
    color: #ffdc63;
  }

  .ra-desc * {
  }

  .ra-desc p, .ra-desc span,
  .ra-desc label {
    color: #ffdc63;
  }

  .ra-desc-introduce {
    margin-top: 15px;
  }

  .ra-desc h4 {
    margin: -8px 0px 0px -75px;
    padding: 0px;
    border-radius: 4px;
    position: absolute;
    width: 100px;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    color: #fce243;
    background-color: transparent;
    top: -15px;
    left: 50%;
    text-align: center;
    width: 150px;
    height: 40px;
    background-image: url(../../assets/img/draw/tip.png);
    background-size: 100%;
    display: none;
  }

  .sixSty{
    padding-top: 35px;
    padding-bottom: 15px;
    border: 1px dashed #ff7700;
    border-radius: 4px;
    h4 {
      display: block !important;
      background-image: url(../../assets/img/draw/tip02.png);
      color: #58149f!important;
    }
    p, span, label {
      color: #f8c88b!important;
    }
  }
  .sixSty *{
    color: #f8c88b!important;
  }
  .eightSty {
    padding-top: 35px;
    padding-bottom: 15px;
    border: 1px dashed #ff7700;
    border-radius: 4px;
    h4 {
      display: block !important;
    }
  }

  .draw-drawCondition {
    padding: 10px 0;
    text-align: center;
    color: #ff7700;
  }

  .draw-drawCondition big {
    color: red;
    padding: 0 5px;
  }

  .draw-drawCondition .go-to-door {
    margin: 0 10px;
    padding: 5px 10px;
    font-size: 12px;
    color: #ffde03;
    background-color: #ff3c3c;
    border-radius: 5px;
    text-underline: none;
  }

  .ra-desc p {
    line-height: 20px;
    font-size: 12px;
  }

  .ra-desc p.font-weight {
    line-height: 25px;
    font-weight: bold;
    font-size: 14px;
    letter-spacing: 1px;
  }

  .ra-desc-34 * {
    color: #343434;
  }

  .ra-desc-34 p, .ra-desc-34 span,
  .ra-desc-34 label {
    color: #343434;
  }

  .ra-dese-34 {
    color: #343434;
    h4 {
      color: #343434 !important;
      display: none;
    }
    .draw-ueditor {
      color: #343434 !important;
      p {
        color: #343434 !important;
      }
    }
  }

</style>
