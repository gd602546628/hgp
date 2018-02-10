<template>
  <zyt-page>
    <div slot="main">
      <div class="bgColor" :style="mianSty">
        <div class="snatch-count-content">
          <div class="snatch-count-etc" v-if="countRuleDate && countRuleDate.winningNumbers">
            <span class="snatch-count-periods">上一期幸运号码</span>
            <span class="snatch-count-number">{{countRuleDate.winningNumbers}}</span>
          </div>
          <div class="snatch-count-list">
            <div class="snatch-count-formula">计算公式:</div>
            <div class="snatch-count-frequency">(X/商品所需次数) 取余数+10000001</div>
            <div class="snatch-count-X">X=该商品最后一个夺宝号码分配完毕时间点前，一元夺宝前50个参与时间相加之和。</div>
            <div class="snatch-count-lastTime" v-if="countRuleDate && countRuleDate.luckyNumberKey">上期X值为：<span
              class="snatch-count-lastTime-number">{{countRuleDate.luckyNumberKey}}</span></div>
          </div>
          <div class="snatch-count-attend-title">
            <span class="snatch-count-attend-last">最后50个参与时间</span>
            <span class="snatch-count-attend-figure">计算数值</span>
            <span class="snatch-count-attend-user">用户名</span>
          </div>
          <div class="snatch-count-attend-list-failed" v-if="recordFailed">
            <span>暂无开奖记录</span>
          </div>
          <div class="snatch-count-attend-list" v-for="rulesDate in calculrulesList">
            <div class="snatch-count-attend-list-box">
              <span class="snatch-count-attend-data">{{rulesDate.buyTime}}</span>
              <span class="snatch-count-attend-value">{{rulesDate.evaluate}}</span>
              <span class="snatch-count-attend-phone">{{rulesDate.userName}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </zyt-page>
</template>

<script>
  import oneIndianaService from '../../service/oneIndiana/oneIndiana.service'
  import { mapGetters } from 'vuex'
  export default {
    name: 'oneIndianaCountRule',
    components: {},
    data () {
      return {
        countRuleDate: null,
        calculrulesList: [],
        recordFailed: false,
        params: {
          phaseCode: this.$route.params.code,
          prdId: this.$route.params.prdId
        }
      }
    },
    filters: {},
    computed: {
      ...mapGetters(['userInfo']),
      mianSty(){
        return {
          'min-height': window.screen.height + 'px'
        }
      }
    },
    created(){
      this.init()
    },
    methods: {
      async init(){
        await this.paramsFn()
        await this.getCalculRules()
      },
      paramsFn(){
        this.countRuleDate = null
        this.calculrulesList = []
        this.recordFailed = false
        this.params.phaseCode = this.$route.params.code
        this.params.prdId = this.$route.params.prdId
        return true
      },
      async getCalculRules(){ // 计算规则
        let data = await oneIndianaService.getCalculRules(this.params, {showLoading: true}).catch(() => {
          throw new Error('获取计算规则失败')
        })
        if (!data || data.involvement === '' || data.involvement.length <= 0) {
          this.recordFailed = true
          console.log('没有数据')
          return
        }
        for (let i = 0; i < data.involvement.length; i++) {
          this.calculrulesList.push(data.involvement[i])
          this.countRuleDate = data
          this.recordFailed = false
        }
        return true
      }
    },
    watch: {
      '$route': {
        handler(){
          if (this.$route.name !== 'oneIndianaCountRule') {
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
  .bgColor {
    background-color: #f0f2f5;
  }

  .snatch-count-content {
    .snatch-count-etc {
      position: relative;
      height: 35px;
      width: 100%;
      background-color: #ffebeb;
    }
    .snatch-count-periods, .snatch-record-periods {
      position: absolute;
      font-size: 12px;
      color: #ff3c3c;
      text-align: left;
      line-height: 35px;
      padding-left: 10px;
      width: 100%;
    }
    .snatch-count-number {
      position: absolute;
      font-size: 12px;
      font-weight: bold;
      color: #FF3C3C;
      right: 10px;
      top: 7px;
    }
    .snatch-count-list {
      height: 120px;
      width: 100%;
      background-color: white;
    }
    .snatch-count-formula {
      margin-left: 10px;
      font-size: 14px;
      color: #2d2d2d;
      padding-top: 10px;
    }
    .snatch-count-frequency {
      margin-left: 10px;
      margin-bottom: 4px;
      margin-top: 4px;
      font-size: 13px;
      color: #ff3c3c;
    }
    .snatch-count-X {
      margin-left: 10px;
      margin-bottom: 4px;
      font-size: 12px;
      color: #525252;
      margin-right: 10px;
    }
    .snatch-count-lastTime {
      margin-left: 10px;
      font-size: 13px;
      color: #525252;
    }
    .snatch-count-lastTime-number {
      font-size: 13px;
      color: #ff3c3c;
    }
    .snatch-count-attend-title {
      height: 35px;
      width: 100%;
      background-color: #f0f2f5;
      border-top: 1px solid #c7c7c7;
    }
    .snatch-count-attend-last {
      float: left;
      line-height: 35px;
      margin-left: 5%;
      width: 40%;
      text-align: center;
    }
    .snatch-count-attend-figure {
      float: left;
      line-height: 35px;
      width: 32%;
      text-align: center;
    }
    .snatch-count-attend-user {
      float: left;
      line-height: 35px;
      margin-right: 5%;
      width: 18%;
      text-align: center;
    }
    .snatch-count-attend-list {
      height: 100%;
      width: 100%;
      background-color: white;
    }
    .snatch-count-attend-list-box {
      height: 22px;
      width: 100%;
      position: relative;
    }
    .snatch-count-attend-list span {
      font-size: 11px;
      color: #9b9b9b;
    }
    .snatch-count-attend-list .snatch-count-attend-data {
      float: left;
      margin-left: 3%;
      height: 22px;
      line-height: 22px;
      width: 45%;
      text-align: center;
    }
    .snatch-count-attend-list .snatch-count-attend-value {
      float: left;
      height: 22px;
      line-height: 22px;
      text-align: center;
      width: 25%;
    }
    .snatch-count-attend-list .snatch-count-attend-phone {
      float: right;
      height: 22px;
      margin-right: 3%;
      line-height: 22px;
      width: 23%;
      text-align: center;
    }
    .snatch-count-attend-list-failed {
      text-align: center;
      margin-top: 44%;
      color: #4c3a51;
      font-size: 16px;
      font-weight: bold;
    }
  }

</style>
