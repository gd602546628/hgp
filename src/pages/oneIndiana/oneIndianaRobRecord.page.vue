<template>
  <zyt-page :on-infinite="loadMore"
            :enableInfinite="!dataFinish">
    <div slot="main">
      <div class="bgColor" :style="mianSty">
        <div class="snatch-record-content">
          <div class="snatch-record-etc" v-if="RobRecordDate">
            <span class="snatch-record-periods">本期于{{RobRecordDate.startTime}}开始</span>
          </div>
          <div class="snatch-record-list"
               v-if="RobRecordList"
               v-for="robData in RobRecordList"
               @click="goGrabRecord(robData)">
            <div class="snatch-record-attend-user">{{robData.userName}}</div>
            <div class="snatch-record-attend-time">参与<span
              class="snatch-record-attend-time-number">{{robData.quantity}}</span>次
            </div>
            <div class="snatch-record-attend-data">{{robData.buyTime}}</div>
          </div>
        </div>
      </div>
      <div class="footerBtn">
        <button class="zyt-bottom-btn-red " @click="submit();">
          前往最新一期
        </button>
      </div>
    </div>
  </zyt-page>
</template>

<script>
  import oneIndianaService from '../../service/oneIndiana/oneIndiana.service'
  import { mapGetters } from 'vuex'
  export default {
    name: 'oneIndianaRobRecord',
    components: {},
    data () {
      return {
        RobRecordDate: null,
        RobRecordList: [],
        dataFinish: false,
        pageFlag: false,
        params: {
          pageNum: 1,
          pageSize: 20,
          phaseId: this.$route.params.phaseId
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
        await this.getRobTreasureRecordList(true)
      },
      paramsFn(){
        this.RobRecordDate = null
        this.RobRecordList = []
        this.dataFinish = false
        this.pageFlag = false
        this.params.pageNum = 1
        this.params.phaseId = this.$route.params.phaseId
        return true
      },
      async getRobTreasureRecordList(reset){ // 获取夺宝记录
        let data = await oneIndianaService.getRobTreasureRecordList(this.params).catch(() => {
          throw new Error('获取夺宝记录列表失败')
        })
        if (!data) {
          console.log('没有数据')
          return
        }
        if (this.params.pageNum >= data.totalPage) {
          this.dataFinish = true
          this.pageFlag = true
          console.log('所有数据加载完毕')
        } else {
          this.dataFinish = false
          this.pageFlag = false
        }
        this.RobRecordDate = data
        if (reset) {
          this.RobRecordList = data.record
        } else {
          this.RobRecordList = this.RobRecordList.concat(data.record)
        }
        return true
      },
      async loadMore(done){ // 加载更多
        if (this.dataFinish) {
          done && done(true)
          return
        }
        this.params.pageNum++
        await this.getRobTreasureRecordList(false)
        done && done()
      },
      goGrabRecord(data){ // 一元夺宝抢宝记录和抢中记录
        console.log('一元夺宝抢宝记录和抢中记录')
        if (this.userInfo) {
          this.$router.push({
            name: 'oneIndianaGrabRecord',
            params: {
              doorId: this.$route.params.doorId,
              userId: this.userInfo.userId
            }
          })
        }
      },
      async submit(){ // 跳转最新一期
        let data = await oneIndianaService.goToLatestPhase({
          phaseId: this.$route.params.phaseId
        }).catch(() => {
          throw new Error('获取前往最新一期详情失败')
        })
        if (!data) { return }
        this.$router.push({
          name: 'oneIndianaDetails',
          params: {
            doorId: this.$route.params.doorId,
            prdId: data.prdId,
            code: data.code
          }
        })
      }
    },
    watch: {
      '$route': {
        handler(){
          if (this.$route.name !== 'oneIndianaRobRecord') {
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

  .snatch-record-content {
    margin-bottom: 34px;
    p {
      font-size: 12px !important;
    }
    .snatch-announce-etc, .snatch-count-etc, .snatch-record-etc {
      position: relative;
      height: 35px;
      width: 100%;
      background-color: #ffebeb;
    }
    .snatch-record-periods {
      position: absolute;
      font-size: 12px;
      color: #ff3c3c;
      text-align: left;
      line-height: 35px;
      padding-left: 10px;
      width: 100%;
    }
    .snatch-record-list {
      position: relative;
      height: 53px;
      width: 100%;
      background-color: white;
      border-bottom: 1px solid #525252;
      .snatch-record-attend-user {
        position: absolute;
        font-size: 14px;
        color: #2d2d2d;
        margin-left: 10px;
        line-height: 53px;
      }
      .snatch-record-attend-time {
        position: absolute;
        top: 8px;
        font-size: 12px;
        color: #2d2d2d;
        right: 10px;
        .snatch-record-attend-time-number {
          font-size: 12px;
          color: #ff3c3c;
        }
      }
      .snatch-record-attend-data {
        position: absolute;
        right: 10px;
        bottom: 8px;
        color: #525252;
        font-size: 11px;
      }
    }
    .snatch-announce-bg, .snatch-count-bg, .snatch-record-bg {
      height: 35px;
      width: 100%;
      background-color: #ffebeb;

    }
    .snatch-announce-periods {
      position: absolute;
      font-size: 12px;
      color: #2d2d2d;
      text-align: left;
      line-height: 35px;
      padding-left: 10px;

    }
    .snatch-announce-time {
      font-size: 12px;
      font-weight: bold;
      color: #FF3C3C;
      float: right;
      line-height: 35px;
      margin-right: 5px;
      display: inline-block;
      width: 80%;
      text-align: right;
    }
    .snatch-announce-list {
      height: 78px;
      width: 100%;
      background-color: white;
    }
    .snatch-announce-user {
      padding-left: 10px;
      padding-top: 6px;
      font-size: 12px;
      color: #2d2d2d;
    }
    .snatch-announce-number {
      margin-left: 10px;
      margin-top: 2px;
      font-size: 12px;
      color: #2d2d2d;
    }
    .snatch-announce-degree {
      margin-left: 10px;
      padding-bottom: 10px;
      margin-top: 2px;
      font-size: 12px;
      color: #2d2d2d;
    }
    .snatch-announce-img {
      float: right;
      margin-top: -46px;
      margin-right: 10px;
    }
    .snatch-announce-img-next {
      height: 15px;
      width: 15px;
    }
    .snatch-announce-point {
      text-align: center;
      color: #4c3a51;
      font-size: 16px;
      font-weight: bold;
      padding-top: 70%;
    }
    .snatch-announce-list-failed {
      text-align: center;
      line-height: 73px;
      margin-left: 10px;
    }
  }

  .snatch-record-content-period {
    color: #ff3c3c !important;
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


</style>
