<template>
  <zyt-page>
    <div slot="main">
      <div class="bgColor" :style="mianSty">
        <!--没有数据-->
        <div class="snatch-announce-point" v-if="noData">
          <span>没有开奖记录</span>
        </div>

        <!--抽奖列表-->
        <div v-for="snatchData in announceList">
          <div class="snatch-announce-content" v-if="snatchData.state!=1">
            <div class="snatch-announce-etc">
              <span class="snatch-announce-periods">第{{snatchData.code}}期</span>
              <span class="snatch-announce-time">结束时间:{{snatchData.prdExpireDate}}</span>
            </div>
            <div class="snatch-announce-list">
              <span class="snatch-announce-list-failed">本期夺宝失败</span>
            </div>
          </div>

          <div class="snatch-announce-content" v-if="snatchData.state==1">
            <div class="snatch-announce-etc">
              <span class="snatch-announce-periods">第{{snatchData.code}}期</span>
              <span class="snatch-announce-time">揭晓时间:{{snatchData.prdExpireDate}}</span>
            </div>
            <div class="snatch-announce-list" @click="goDetails(snatchData);">
              <div class="snatch-announce-user">幸运用户:{{snatchData.userName}}</div>
              <div class="snatch-announce-number">幸运号码:{{snatchData.winningNumbers}}</div>
              <div class="snatch-announce-degree">参与次数:{{snatchData.userBuyTimes}}次</div>
              <div class="snatch-announce-img">
                <img class="snatch-announce-img-next" src="../../assets/img/oneIndiana/next01.png"/>
              </div>
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
    name: 'oneIndianaAnnounce',
    components: {},
    data () {
      return {
        announceList: [],
        noData: false,
        dataFinish: false,
        pageFlag: false,
        params: {
          pageNum: 1,
          pageSize: 20,
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
        await this.getOybfPhaseList(true)
      },
      paramsFn(){
        this.announceList = []
        this.noData = false
        this.dataFinish = false
        this.pageFlag = false
        this.params.pageNum = 1
        this.params.prdId = this.$route.params.prdId
        return true
      },
      async getOybfPhaseList(reset){ // 往期揭晓列表列表
        let data = await oneIndianaService.getOybfPhaseList(this.params, {showLoading: true}).catch(() => {
          throw new Error('获取往期揭晓列表列表失败')
        })
        if (!data || !data.resultsList || data.resultsList.length === 0) {
          this.noData = true
          return
        }

        if (this.params.pageNum >= data.totalPage) {
          this.dataFinish = true
          this.pageFlag = true
        } else {
          this.dataFinish = false
          this.pageFlag = false
        }
        if (reset) {
          this.announceList = data.resultsList
        } else {
          this.announceList = this.announceList.concat(data.resultsList)
        }
        return true
      },
      loadMore(){ // 加载更多
        this.params.pageNum++
        this.getOybfPhaseList(false)
      },
      goDetails(item){
        this.$router.push({
          name: 'oneIndianaDetails',
          params: {
            doorId: item.siteId || this.$route.params.doorId,
            prdId: item.prdId,
            code: item.code
          }
        })
      }
    },
    watch: {
      '$route': {
        handler(){
          if (this.$route.name !== 'oneIndianaAnnounce') {
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

  .snatch-announce-point {
    text-align: center;
    color: #4c3a51;
    font-size: 16px;
    font-weight: bold;
    padding-top: 70%;
  }

  .snatch-announce-content {
    .snatch-announce-etc, .snatch-count-etc, .snatch-record-etc {
      position: relative;
      height: 35px;
      width: 100%;
      background-color: #ffebeb;
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
      margin-top: 3px;
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


</style>
