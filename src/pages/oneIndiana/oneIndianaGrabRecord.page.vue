<template>
  <zyt-page :hasHeader="true"
            :on-infinite="loadMore"
            :enableInfinite="!dataFinish">
    <div class="row tab-menu" slot="header">
      <div class="col" :class="{'active' : showOne}" @click="clickTitle">抢宝记录</div>
      <div class="col" :class="{'active' : !showOne}" @click="clickTitle">抢中记录</div>
    </div>
    <div slot="main">
      <div class="bgColor">
        <div v-if="showOne">
          <div v-for="PurchaseData in grabRecordList" class="snatch-grab-conten">
            <div class="snatch-record-info-item"
                 @click="goToDetails(PurchaseData)">
              <img :src="PurchaseData.preImgUrl | imgPrefix">
              <div class="item-right">
                <h2>{{PurchaseData.prdName}}</h2>
                <p class="snatch-record-content-period">第{{PurchaseData.phaseCode}}期</p>
                <p>
                  <span>此单参与次数 </span>
                  <span class="snatch-record-content-period"> {{PurchaseData.quantity}}次</span>
                </p>
              </div>
            </div>
            <div class="item-button-bootom">
              <span>{{winnState[PurchaseData.winningStatus]}}</span>
              <button class="snatch-again-button"
                      @click="goList(PurchaseData)">我也要抢
              </button>
            </div>
          </div>
        </div>

        <div v-if="!showOne">
          <div v-for="PurchaseData in grabRecordList" class="snatch-grab-conten">
            <div class="snatch-record-info-item"
                 @click="goToDetails(PurchaseData)">
              <img :src="PurchaseData.preImgUrl | imgPrefix">
              <div class="item-right">
                <h2>{{PurchaseData.prdName}}</h2>
                <p class="snatch-record-content-period">第{{PurchaseData.phaseCode}}期</p>
                <p>
                  <span>此单参与次数 </span>
                  <span class="snatch-record-content-period">{{PurchaseData.quantity}}次</span>
                </p>
              </div>
            </div>
            <div class="item-button-bootom">
              <span></span>
              <button class="snatch-again-button"
                      @click="goList(PurchaseData)">我也要抢
              </button>
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
    name: 'oneIndianaGrabRecord',
    components: {},
    data () {
      return {
        showOne: true,
        grabRecordList: [],
        dataFinish: false,
        pageFlag: false,
        winnState: {
          0: '未开奖',
          1: '已抢中',
          2: '未抢中',
          3: '夺宝失败',
          4: '正在开奖'
        },
        params: {
          pageNum: 1,
          pageSize: 20,
          winningStatus: null
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
        await this.getMyPurchaseList(true)
      },
      paramsFn(){
        this.showOne = true
        this.grabRecordList = []
        this.dataFinish = false
        this.pageFlag = false
        this.params.pageNum = 1
        this.params.winningStatus = null
        return true
      },
      async getMyPurchaseList(reset){ // 获取我的夺宝记录列表
        if (!this.showOne) {
          this.params.winningStatus = 1
        } else {
          this.params.winningStatus = null
        }
        let data = await oneIndianaService.getMyPurchaseList(this.params).catch(() => {
          throw new Error('获取我的夺宝记录列表失败')
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
        if (reset) {
          this.grabRecordList = data.resultsList
        } else {
          this.grabRecordList = this.grabRecordList.concat(data.resultsList)
        }
        return true
      },
      async loadMore(done){ // 加载更多
        if (this.dataFinish) {
          done && done(true)
          return
        }
        this.params.pageNum++
        await this.getMyPurchaseList(false)
        done && done()
      },
      async goList(item){ // 跳转最新一期抢宝页面
        let data = await oneIndianaService.goToLatestPhase({
          phaseId: item.phaseId
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
      },
      goToDetails(item){ // 跳转抢宝页面
        console.log(0, item)
        this.$router.push({
          name: 'oneIndianaDetails',
          params: {
            doorId: this.$route.params.doorId,
            prdId: item.prdId,
            code: item.phaseCode
          }
        })
      },
      clickTitle(){
        this.showOne = !this.showOne
        this.grabRecordList = []
        this.dataFinish = false
        this.pageFlag = false
        this.params.pageNum = 1
        this.getMyPurchaseList(true)
      }
    },
    watch: {
      '$route': {
        handler(){
          if (this.$route.name !== 'oneIndianaGrabRecord') {
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

  .tab-menu {
    > div {
      width: 50%;
      height: 44px;
      color: #343434;
      line-height: 44px;
      text-align: center;
      border-top: solid 1px #dddddd;
      border-bottom: solid 1px #dddddd;
    }
    > div:first-child {
      border-right: solid 1px #dddddd;
    }
    .active {
      color: #0164a6;
      border-bottom: 2px solid #0164a6;
    }
  }

  .snatch-grab-conten {
    .snatch-record-info-item {
      background-color: #f0f2f5;
      height: 90px;
      border-top: none !important;
      min-height: 90px;
      display: flex;
      align-items: center;
      > img {
        border: 1px solid #e7e7e7;
        width: 80px;
        height: 80px;
        margin: 0px 10px;
      }
      .item-right {
        width: calc(100% - 110px);
        h2 {
          font-size: 13px;
          color: #2d2d2d;
          min-height: 38px;
          max-height: 38px;
          line-height: 19px;
          font-weight: 400;
          display: block;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          word-break: break-all;
          overflow: hidden;
          word-wrap: break-word;
          text-overflow: ellipsis;
          -webkit-box-orient: vertical;
        }
        .snatch-record-content-period {
          margin: 4px 0px;
        }
        p {
          font-size: 12px !important;
          color: #ff3c3c;
          span {
            color: #666
          }
          .snatch-record-content-period {
            color: #ff3c3c;
          }
        }
      }
    }
    .item-button-bootom {
      height: 46px;
      background-color: #fff;
      border-top: solid 1px #ddd;
      border-bottom: solid 1px #ddd;
      display: flex;
      align-items: center;
      justify-content: space-between;
      span {
        margin-left: 10px;
        font-size: 12px;
        color: #2d2d2d;
        width: calc(100% - 110px);
      }
      .snatch-again-button {
        font-size: 14px;
        color: #ef473a;
        border: solid 1px #ef473a;
        padding: 6px 12px;
        margin-right: 10px;
        border-radius: 4px;
      }
    }
  }


</style>
