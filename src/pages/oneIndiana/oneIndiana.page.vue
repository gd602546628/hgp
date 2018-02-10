<template>
  <zyt-page :on-infinite="loadMore"
            :enableInfinite="!dataFinish">
    <div slot="main">
      <div v-if="obyList && !noData" class="oneIndiana-list">
        <div class="oneIndiana-item" v-for="item in obyList" :key="item.id" @click="goToDetail(item)">
          <div class="oneIndiana-item-img" :style="ltSty">
            <img :src="item.preImgUrl | imgPrefix">
            <div class="imgBox">
              <img class="img-lable" src="../../assets/img/oneIndiana/shi_bg.png"
                   v-show="item.prdState != 3 && item.price == 10">
              <img class="img-lable" src="../../assets/img/oneIndiana/bai_bg.png"
                   v-show="item.prdState != 3 && item.price == 100">
              <img class="img-lable" src="../../assets/img/oneIndiana/qg_bg.png"
                   v-show="item.prdState == 3">
            </div>
          </div>
          <div class="oneIndiana-item-title">{{item.name}}</div>
          <div class="progress-wrap">
            <div class="oneIndiana-item-progress">
              <span class="oneIndiana-item-progress-per" :style="{width: item.progress}"></span>
            </div>
            <p class="progress-font">{{item.progress}}</p>
          </div>
          <div class="oneIndiana-item-button">
            <div class="oneIndiana-item-button-need"><p class="need-cell">
              还需<span>{{item.needPersionTime | persionNeed}}</span>人次</p></div>
            <div v-if="item.state == 3 && item.prdState != 3"
                 class="oneIndiana-item-button-join grey">正在开奖
            </div>
            <div v-if="item.prdState == 3 && item.state != 3"
                 class="oneIndiana-item-button-join grey">立即参与
            </div>
            <div v-if="item.prdState != 3 && item.state != 3"
                 class="oneIndiana-item-button-join">立即参与
            </div>
          </div>
        </div>
      </div>
      <no-data v-if="noData"></no-data>
    </div>
  </zyt-page>
</template>

<script>
  import oneIndianaService from '../../service/oneIndiana/oneIndiana.service'
  import noData from '@/components/noDataMark/noDataMark.component'
  export default {
    name: 'oneIndiana',
    components: {
      'no-data': noData
    },
    data () {
      return {
        obyList: [],
        noData: false,
        dataFinish: false,
        pageFlag: false,
        params: {
          pageNum: 1,
          pageSize: 10
        }
      }
    },
    filters: {
      persionNeed(val){
        if (val > 99999) {
          var wan = val / 10000
          return wan.toFixed(1) + '万'
        } else {
          return val
        }
      }
    },
    computed: {
      ltSty(){
        return {'height': (window.screen.width * 0.48) + 'px'}
      }
    },
    created(){
      this.init()
    },
    methods: {
      async init(){
        await this.paramsFn()
        await this.getServantPrdList(true)
      },
      paramsFn(){
        this.obyList = []
        this.noData = false
        this.dataFinish = false
        this.pageFlag = false
        this.params.pageNum = 1
        return true
      },
      async getServantPrdList(reset){ // 一元夺宝列表
        let data = await oneIndianaService.getServantPrdList(this.params, {showLoading: true}).catch(() => {
          throw new Error('获取一元夺宝列表失败')
        })

        if (data.list && data.list.length === 0) {
          console.log('没有数据')
          this.noData = true
          return
        }
        if (this.params.pageNum >= data.page.totalPage) {
          this.dataFinish = true
          this.pageFlag = true
          console.log('所有数据加载完毕')
        } else {
          this.dataFinish = false
          this.pageFlag = false
        }
        if (reset) {
          this.obyList = data.list
        } else {
          this.obyList = this.obyList.concat(data.list)
        }
        return true
      },
      goToDetail(item){ // 详情跳转
        this.$router.push({name: 'oneIndianaDetails', params: {doorId: item.siteId, prdId: item.prdId, code: item.code}})
      },
      async loadMore(done){ // 加载更多
        if (this.dataFinish) {
          done && done(true)
          return
        }
        this.params.pageNum++
        await this.getServantPrdList(false)
        done && done()
      }
    },
    watch: {
      '$route': {
        handler(){
          if (this.$route.name !== 'oneIndiana') {
            this.dataFinish = true
          } else {
            this.dataFinish = this.pageFlag
            if (!this.$router.isPush) return
            this.init()
          }
        }
      }
    }
  }
</script>

<style lang='scss' rel='stylesheet/scss' scoped type="text/scss">
  .grey {
    background: darkgrey !important;
  }

  .oneIndiana-list {
    width: 100%;
    background: #f0f2f5;
    .oneIndiana-item {
      width: 48%;
      background: #ffffff;
      display: inline-block;
      box-sizing: border-box;
      margin-top: 1.4%;
      margin-left: 1.3%;
      margin-bottom: 0;
    }

    .oneIndiana-item:nth-child(2n-1) {
      margin-left: 1.3%;
    }

    .oneIndiana-item-img {
      position: relative;
      width: 100%;
      height: 150px;
      background: url("../../assets/img/oneIndiana/4.png");
      background-position: center;
      background-size: cover;
      background-repeat: no-repeat;
      > img {
        width: 100%;
        height: 100%;
        background: white;
      }
      .imgBox {
        .img-lable {
          position: absolute;
          width: 50px;
          height: 50px;
          top: 4px;
          right: 0;
        }
      }
    }

    .oneIndiana-item-title {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      color: #343434;
      font-size: 16px;
      margin-top: 8px;
      padding: 0 8px;
    }

    .progress-wrap {
      display: -webkit-flex;
      display: flex;
      margin-top: 8px;
      padding: 0 8px;
    }

    .oneIndiana-item-progress {
      height: 12px;
      background: #efefef;
      border-radius: 20px;
      overflow: hidden;
      color: #ffffff;
      display: inline-block;
      -webkit-flex: 1;
      flex: 1;
      margin-right: 4px;
    }

    .progress-font {
      font-size: 12px;
      color: #0164a6;
      text-align: right;
      margin: 0;
      padding: 0;
      overflow: hidden;
      height: 14px;
      line-height: 14px;
      display: inline-block;

    }

    .oneIndiana-item-progress-per {
      display: block;
      height: 14px;
      width: 50%;
      background: #0164a6;
    }

    .oneIndiana-item-button {
      width: 100%;
      margin-top: 8px;
      height: 34px;
      overflow: hidden;
      padding: 0 8px;
    }

    .oneIndiana-item-button-need {
      float: left;
      width: 50%;
      word-break: break-all;
      padding-right: 4px;
      box-sizing: border-box;
      height: 24px;
    }

    .oneIndiana-item-button-need .need-cell {
      margin: auto;
      font-size: 12px;
      line-height: 24px;
      color: #343434;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      word-break: break-all;
      height: 24px;
    }

    .oneIndiana-item-button-need .need-cell span {
      color: #0164a6;
    }

    .oneIndiana-item-button-join {
      width: 46%;
      float: right;
      color: #ffffff;
      background: #0164a6;
      text-align: center;
      padding: 3px 0;
      font-size: 12px;
      border-radius: 4px
    }

    @media screen and (max-width: 375px) {
      .progress-font {
        font-size: 10px;
      }
    }
  }

</style>
