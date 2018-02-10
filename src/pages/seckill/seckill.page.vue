<template>
  <zyt-page :on-infinite="loadMore"
            :enableInfinite="!dataFinish"
            @onScroll="onScroll">
    <div slot="main">
      <div class="seckill-page">
        <seckill-tab @getSession="getSession($event)"></seckill-tab>
        <seckill-list :seckillList="seckillList"
                      :currentSession="currentSession"
                      v-if="!noData"
        ></seckill-list>
        <no-data v-if="noData"></no-data>
      </div>
    </div>
  </zyt-page>
</template>
<script>
  import seckillTab from '@/components/seckillTab/seckillTab.component'
  import seckillList from '@/components/seckillList/seckillList.component'
  import seckillService from '@/service/seckill/seckill.service'
  import noData from '@/components/noDataMark/noDataMark.component'
  import allActivityService from '@/service/activity/allActivity.service'
  export default{
    name: 'seckill',
    data(){
      return {
        params: {
          activityId: null,
          pageNum: 1,
          pageSize: 20,
          sessionType: 0
        },
        seckillList: [],
        currentSession: 2,
        dataFinish: false,
        pageFlag: false,
        noData: false,
        tempStock: null
      }
    },
    components: {
      'seckill-tab': seckillTab,
      'seckill-list': seckillList,
      'no-data': noData
    },
    methods: {
      onScroll(obj){
        console.info(obj.top)
      },
      getSession(data){
        this.dataFinish = false
        this.currentSession = data.currentSession
        this.params.sessionType = data.selectSession === -1 ? 0 : data.selectSession
        this.params.pageNum = 1
        this.getSeckillList(true)
      },
      async getSeckillList(reset){
        let data = await seckillService.getSeckillList(this.params, {showLoading: true})
        if (!data || !data.list || data.list.length === 0) {
          this.noData = true
          this.dataFinish = true
          this.pageFlag = true
          return
        } else {
          this.noData = false
        }
        if (reset) {
          this.seckillList = data.list
        } else {
          this.seckillList = this.seckillList.concat(data.list)
        }
        if (data.page.totalPage <= this.params.pageNum) {
          this.dataFinish = true
          this.pageFlag = true
        } else {
          this.dataFinish = false
          this.pageFlag = false
        }
        return true
      },
      async getAddActivityViewNum(){ // 活动点击量更新
        allActivityService.getAddActivityViewNum({activityId: this.params.activityId})
      },
      async loadMore(done){ // 加载更多
        if (this.dataFinish) {
          done && done(true)
          return
        }
        this.params.pageNum++
        await this.getSeckillList(false)
        done && done()
      }
    },
    created(){
      this.params.activityId = this.$route.params.activeId
      this.getAddActivityViewNum()
    }
    /* watch: {
     '$route': {
     handler(){
     if (this.$route.name !== 'seckill') {
     this.dataFinish = true
     } else {
     this.dataFinish = this.pageFlag
     if (!this.$router.isPush) return
     this.params.activityId = this.$route.params.activeId
     this.getAddActivityViewNum()
     }
     }
     }
     } */
  }
</script>
<style lang='scss' rel='stylesheet/scss' scoped>
  .seckill-page {

  }
</style>
