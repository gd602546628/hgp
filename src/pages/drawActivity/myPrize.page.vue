<template>
  <zyt-page :hasHeader="false"
            :on-infinite="loadMore"
            :enableInfinite="!dataFinish">
    <div slot="main">
      <div class="tabBtn">
        <span :class="{tabActive:num==index}"
              v-for="(tab, index) in titleData"
              @click="clickTab(index)">
          {{tab.title}}
        </span>
      </div>
      <div v-if="!noData" class="prizrClass">
        <div class="prizeItem" v-for="item in prizeList" @click="goPrizeDetails(item)" :key="item.prizeId">
          <mt-cell-swipe v-if="item"
                         class="coupon-swipe"
                         :right="rightDel(item)"
          >
            <div class="item">
              <div class="left">
                <img :src="item.prizeImg ||　item.couponImg | imgPrefix">
                <div>
                  <p>{{item.name}}</p>
                  <span>{{item.prizeName}}</span>
                </div>
              </div>
              <div v-if="parseInt(num) ===0" class="right" @click.stop="goPrizeDetails(item)">
                <img src="../../assets/img/me/prize/02.png">
                <p class="rightP0">待领奖</p>
              </div>
              <div v-if="parseInt(num) ===1" class="right" @click.stop="goPrizeDetails(item)">
                <img src="../../assets/img/me/prize/03.png">
                <p class="rightP1">领奖中</p>
              </div>
              <div v-if="parseInt(num) ===2" class="right" @click.stop="goPrizeDetails(item)">
                <img src="../../assets/img/me/prize/04.png">
                <p class="rightP2">已领奖</p>
              </div>
              <div v-if="parseInt(num) ===3" class="right" @click.stop="goPrizeDetails(item)">
                <img src="../../assets/img/me/prize/01.png">
                <p class="lastP">已过期</p>
              </div>
            </div>
          </mt-cell-swipe>
        </div>
      </div>
      <div v-if="noData" class="prize-noData">
        <div>
          <img src="../../assets/img/me/yun.png" alt=""/>
        </div>
        <div class="col" v-show="parseInt(num)!==3">咦，目前还没有任何奖品哦！再去首页逛逛吧！</div>
        <div class="col" v-show="parseInt(num)===3">目前没有已过期的奖品~</div>
      </div>
    </div>
  </zyt-page>
</template>
<script>
  import myService from '@/service/me/me.service'
  import {mapGetters} from 'vuex'
  import myCoupon from '@/components/coupon/myCoupon.component'
  import Util from '@/service/common/utils/util.service'
  export default {
    name: 'myPrize',
    components: {
      'my-coupon': myCoupon
    },
    data() {
      return {
        prizeList: [],
        showDelete: false,
        num: this.$route.params.index,
        showList: false,
        dataFinish: false,
        pageFlag: false,
        noData: false,
        titleData: [{'title': '待领奖'}, {'title': '领奖中'}, {'title': '已领奖'}, {'title': '已过期'}],
        params: {
          pageNum: 1,
          pageSize: 20,
          tableFlag: 0
        }
      }
    },
    created(){
      this.init()
    },
    deactivated(){
      this.dataFinish = true
    },
    computed: {
      ...mapGetters(['userInfo'])
    },
    watch: {
      '$route': 'init'
    },
    methods: {
      async init(){
        if (this.$route.name !== 'myPrize') {
          return
        }
        await this.paramsFn()
        this.getMyPrizeList(true)
      },
      paramsFn(){
        this.prizeList = []
        this.num = parseInt(this.$route.params.index)
        this.params.tableFlag = this.$route.params.index
        this.params.pageNum = 1
        this.dataFinish = false
        this.pageFlag = false
        this.showDelete = false
        this.noData = false
      },
      async getMyPrizeList(reset){
        this.dataFinish = true
        let data = await myService.getMyPrizeList(this.params, {showLoading: true})
        if (data.myPrizeListResList.length === 0) {
          this.dataFinish = true
          this.pageFlag = true
          this.noData = true
          this.prizeList = []
          return
        } else {
          this.noData = false
        }
        if (this.params.pageNum >= data.page.totalPage) {
          this.dataFinish = true
          this.pageFlag = true
        } else {
          this.dataFinish = false
          this.pageFlag = false
        }
        if (reset) {
          this.prizeList = data.myPrizeListResList
        } else {
          this.prizeList = this.prizeList.concat(data.myPrizeListResList)
        }
      },
      clickTab(index){
        this.num = index
        this.$router.replace({name: 'myPrize', params: {index: index}})
        this.init()
      },
      async loadMore(done){ // 加载更多
        if (this.dataFinish) {
          done && done(true)
          return
        }
        this.params.pageNum++
        await this.getMyPrizeList(false)
        done && done()
      },
      rightDel(item){
        return [
          {
            content: '删除',
            style: {
              background: 'red',
              color: '#fff',
              display: 'flex',
              'align-items': 'center',
              '-webkit-align-items': 'center',
              'justify-content': 'center',
              '-webkit-justify-content': 'center',
              width: '80px'
            },
            handler: () => {
              Util.confirm('确定删除吗？', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                showCancelButton: true
              }).then(() => {
                this.delBtn(item)
              }).catch(() => {
              })
            }
          }]
      },
      delBtn(item){
        let removeCouponList = []
        removeCouponList.push(item)
        myService.delUserParticipateRecord({
          participateId: item.participateId
        }).then(data => {
          this.prizeList = this.prizeList.filter((prd) => {
            return removeCouponList.indexOf(prd) === -1
          })
          if (this.prizeList.length < 1) {
            this.noData = true
          }
        })
      },
      goPrizeDetails(item){
        if (this.num === 1) {
          this.$router.push({name: 'prizeLogistics', params: {winRecordId: item.winId}})
        } else {
          this.$router.push({
            name: 'prizeDetail',
            params: {
              drawId: item.drawId,
              prizeId: item.prizeId,
              winRecordId: item.winId,
              userCouponId: item.userCouponId || -1
            }
          })
        }
      }
    }
  }
</script>
<style lang='scss' rel='stylesheet/scss' type="text/scss">
  .tabBtn {
    display: -webkit-flex;
    -webkit-align-items: center;
    position: fixed;
    top: 0;
    left: 0px;
    z-index: 3;
    height: 45px;
    width: 100%;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #f0f2f5;
    background-color: white;
    span {
      display: -webkit-flex;
      -webkit-justify-content: center;
      -webkit-align-items: center;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 25%;
      height: 100%;
      line-height: 45px;
      text-align: center;
      font-size: 13px;
      color: rgba(68, 68, 68, .4);
      opacity: 1;
    }
    .tabActive {
      color: #066cc2;
      border-bottom: solid 2px #066cc2;
    }
  }

  .prizrClass {
    margin-top: 50px;
    .coupon-swipe {
      background: none !important;
      .mint-cell-right {
      }
      .mint-cell-wrapper {
        margin: 0;
        padding: 0;
        background: none;
        border: none;
        padding: 0 10px;
      }
      .mint-cell-title {
        display: none;
      }
      .mint-cell-value {
        width: 100%;
      }
      .item {
        width: 100%;
        height: 68px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        /*margin: 0px 10px;*/
        border-bottom: solid 1px #dddddd;
        .left {
          display: flex;
          align-items: center;
          width: calc(100% - 65px);
          img {
            width: 46px;
            height: 46px;
            margin-right: 10px;
          }
          > div {
            width: calc(100% - 56px);
            p {
              font-size: 14px;
              color: #2d2d2d;
              width: 100%;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              padding-right: 3px;
            }
            span {
              font-size: 11px;
              color: #525252;
            }
          }
        }
        .right {
          padding-left: 14px;
          padding-right: 6px;
          border-left: 1px dotted #cfcfcf;
          text-align: center;
          img {
            width: 25px;
            height: 25px;
          }
          p {
            font-size: 11px;
            color: #444;
            margin-top: 4px;
          }
          .lastP {
            color: #7b7b7b;
          }
          .rightP0 {
            color: #ff3c3c;
          }
          .rightP1 {
            color: #f5c256;
          }
        }
      }
    }
  }

  .prize-noData {
    margin-top: calc(50% - 50px);
    text-align: center;
    img {
      padding: 30px 30px 10px 30px;
      width: 60%;
    }
    .col {
      padding: 5px;
      width: 100%;
    }
  }
</style>
