<template>
  <div class="count-down-box" v-if="isShow">
    <div class="count-down-left-box">
      <div class="count-down-cost">
        <div class="count-down-discount">
          <price-component :price="activityInfo.activityPrice"></price-component>
        </div>
        <div class="count-down-price-box">
          <p class="count-down-price" v-if="activityInfo.activityPrice!=activityInfo.price">
            <price-component :price="activityInfo.price"></price-component>
          </p>
        </div>
      </div>
      <!--折扣商品-->
      <div class="count-down-label-box">
        <div class="count-down-alarm-box" v-if="activityInfo.type===0">
          <i class="icon-zyt-discount"></i>
          <div>折扣价</div>
        </div>
        <!--秒杀商品-->
        <div class="count-down-alarm-box" v-if="activityInfo.type===2">
          <i class="icon-zyt-alarm-clock"></i>
          <div>秒杀价</div>
        </div>
        <div class="count-down-alarm-box" v-if="!isStart">
          <div class="count-down-limit-discount" v-if="activityInfo.type===0">限时折扣</div>
          <div class="count-down-limit-seckill" v-if="activityInfo.type===2">限时秒杀</div>
          <div class="recommend-shop-manager" v-if="product.prdLabels.length>0">{{product.prdLabels[0].prdLabelName}}
          </div>
        </div>
      </div>
    </div>
    <!--开始时间-->
    <div class="count-down-discount-time-box" v-if="!isStart">
      <span class="count-down--discount-start">开抢时间</span>
      <div class="count-down-discount-time">
        {{startTime | dateFormat('MM月dd日 hh:mm')}}
      </div>
    </div>
    <!--倒计时-->
    <div class="count-down-time-box" v-else-if="countDown">
      <span class="count-down-start-time">{{isGt48 ? '活动结束时间' : '活动结束倒计时'}}</span>
      <div class="count-down-time" v-if="isGt48">
        <div>
          {{endTime | dateFormat('MM月dd日 hh:mm')}}
        </div>
      </div>
      <div class="count-down-time" v-else>
        <div class="count-down-hour">{{hh}}</div>
        :
        <div class="count-down-minute">{{mm}}</div>
        :
        <div class="count-down-second">{{ss}}</div>
      </div>
    </div>
  </div>
</template>
<script>
  import PriceComponent from '@/components/common/price/price.component'
  import TimeService from '@/service/time/time.service'

  export default {
    props: {
      isShow: {
        type: Boolean,
        default: false
      },
      activityInfo: {
        typy: Object,
        default: () => {
          return {}
        }
      },
      product: {
        type: Object,
        default: () => {
          return {
            priceList: [],
            prdLabels: []
          }
        }
      }
    },
    data () {
      return {
        countDown: 0,
        setTimeoutHandler: null,
        timeDifference: 0 // 时间差为服务器的减去本地的
      }
    },
    computed: {
      isStart () {
        if (this.activityInfo) {
          if (this.activityInfo.type === 0) {
            return TimeService.sysTime() >= TimeService.date(this.activityInfo.activityStartTime).getTime()
          } else if (this.activityInfo.type === 2) {
            return TimeService.sysTime() >= TimeService.date(this.activityInfo.seckillStartTime).getTime()
          }
        }
      },
      startTime () {
        if (this.activityInfo.type === 0) {
          return this.activityInfo.activityStartTime
        } else if (this.activityInfo.type === 2) {
          return this.activityInfo.seckillStartTime
        }
        return ''
      },
      endTime () {
        if (this.activityInfo.type === 0) {
          return this.activityInfo.activityEndTime
        } else if (this.activityInfo.type === 2) {
          return this.activityInfo.seckillEndTime
        }
        return ''
      },
      // 超过48小时
      isGt48 () {
        return this.countDown > 172800 // 48 * 60*60
      },
      hh () {
        if (this.countDown) {
          let time = parseInt(this.countDown / 3600)
          if (time < 10) {
            return `0${time}`
          }
          return time
        }
      },
      mm () {
        if (this.countDown) {
          let time = parseInt((this.countDown % 3600) / 60)
          if (time < 10) {
            return `0${time}`
          }
          return time
        }
      },
      ss () {
        if (this.countDown) {
          let time = parseInt((this.countDown % 3600) % 60) // 3600*60
          if (time < 10) {
            return `0${time}`
          }
          return time
        }
      }
    },
    watch: {
      'activityInfo': {
        handler(val){
          this.startCountDown()
        }
      }
    },
    methods: {
      getCountDown () { // 单位秒
        if (this.isStart && !this.isEnd) {
          let time = 1
          if (this.activityInfo.type === 0) {
            time = TimeService.date(this.activityInfo.activityEndTime).getTime() - TimeService.sysTime()
          } else if (this.activityInfo.type === 2) {
            time = TimeService.date(this.activityInfo.seckillEndTime).getTime() - TimeService.sysTime()
          }
          return parseInt(time / 1000)
        }
        return 0
      },
      countDownFun () {
        if (this.isStart && !this.isGt48) {
          if (this.setTimeoutHandler) {
            clearInterval(this.setTimeoutHandler)
          }
          this.setTimeoutHandler = setInterval(() => {
            if (this.countDown > 0) {
              this.countDown = this.countDown - 1
            } else {
              if (this.setTimeoutHandler) {
                clearInterval(this.setTimeoutHandler)
              }
              this.$emit('timeEnd')
            }
          }, 1000)
        }
      },
      startCountDown () {
        this.countDown = this.getCountDown()
        this.countDownFun()
      }
    },
    components: {
      'price-component': PriceComponent
    },
    created () {
      this.startCountDown()
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped type="text/scss">
  @import '../../../assets/css/variables-primary.scss';

  .count-down-box {
    border-bottom: 8px solid map_get($ComColors, gray-ef);
    margin-bottom: 10px;
    height: 66px;
    width: 100%;
    padding: 1% 3%;
    background-color: #0164a6;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: white;
    .count-down-left-box {
      .count-down-cost {
        display: flex;
        justify-content: flex-start;
        align-items: baseline;
        .count-down-discount {
          font-size: 13px;
          span {
            font-size: 22px;
          }
        }
        .count-down-price-box {
          .count-down-price {
            font-size: 16px;
            text-decoration: line-through;
            margin-left: 10px;
            span {
            }
          }
        }
      }
      .count-down-label-box {
        display: -webkit-flex;
        -webkit-justify-content: space-between;
        -webkit-align-items: center;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .count-down-alarm-box {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          margin-left: 3px;
          margin-right: 3px;
          i {
            font-size: 22px;
            margin-right: 5px;
          }
          div {
            font-size: 11px;
            border: 1px dashed white;
            padding: 0px 3px;
            border-radius: 4px;
          }
          .recommend-shop-manager, .count-down-hot {
            border-color: #ffa902;
            color: #ffa902;
          }
          .count-down-limit-discount, .count-down-limit-seckill {
            border-color: #ffa902;
            color: #ffa902;
            margin-right: 5px;
          }
        }
      }

    }
    .count-down-discount-time-box {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .count-down--discount-start {
        margin-bottom: 5px;
      }
      .count-down-discount-time {
        display: flex;
        justify-content: center;
        align-items: baseline;
        .count-down--discount-month {
        }
        .count-down--discount-day {
        }
        .count-down--discount-hour {
          margin-left: 5px;
        }
      }
    }
    .count-down-time-box {
      display: flex;
      justify-content: space-around;
      align-items: center;
      flex-direction: column;
      .count-down-start-time {
        font-size: 14px;
        margin-bottom: 5px;
      }
      .count-down-time {
        display: flex;
        justify-content: center;
        align-items: center;
        .count-down-hour, .count-down-minute, .count-down-second {
          height: 26px;
          width: 26px;
          background-color: white;
          color: #0164a6;
          border-radius: 4px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 2px;
        }
      }
    }
  }
</style>
