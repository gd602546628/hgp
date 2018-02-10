<template>
  <zyt-page :on-infinite="loadMore"
            :enableInfinite="!dataFinish"
            @onScroll="onScroll">
    <div slot="main">
      <div>
        <prd-list :prdListDate="activitData" :state="1"></prd-list>
      </div>
      <no-data v-if="noData"></no-data>
    </div>
  </zyt-page>
</template>

<script>
  import prdList from '@/components/product/productList.component'
  import allActivityService from '@/service/activity/allActivity.service'
  import noData from '@/components/noDataMark/noDataMark.component'
  import TimeService from '@/service/time/time.service'
  import Util from '@/service/common/utils/util.service'
  export default{
    name: 'discountActivity',
    components: {
      'no-data': noData,
      'prd-list': prdList
    },
    data(){
      return {
        params: {
          activityId: this.$route.params.activityId,
          pageNum: 1,
          pageSize: 20
        },
        activitData: [],
        noData: false,
        dataFinish: false,
        pageFlag: false
      }
    },
    methods: {
      onScroll(obj){
      },
      async getActivitDetail(reset){ // 获取活动详情
        let Id = await this.$route.params.activityId
        this.params.activityId = Id
        let data = await allActivityService.getDiscountList(this.params, {showLoading: true}).catch(() => {
          throw new Error('获取折扣活动详情失败')
        })
        console.info(data.activityBase)
        if (!data || !data.list || data.list.length === 0) {
          this.dataFinish = true
          this.pageFlag = true
          this.noData = true
          return
        } else {
          this.noData = false
        }
        if (data.activityBase){
          if (data.activityBase.isDelete === 0){ // 0-未删除 1-已结束 2-已删除
            let nowTime = TimeService.sysTime()
            let activityStartTime = data.activityBase.startTimeMillis // 活动开始时间
//            let activityEndTime = data[1].activityBase.endTimeMillis // 活动结束时间
            if (nowTime < activityStartTime){
              Util.confirm({
                message: `感谢您对本次活动的支持，本次活动将于${data.activityBase.startTime}开始，详情请查看活动说明`,
                confirmButtonText: '活动说明',
                cancelButtonText: '我知道了',
                showCancelButton: true
              }).then(() => {
                this.goactivityExplain(data.activityBase)
              }).catch(() => {
                this.$router.back()
              })
            }
          } else if (data.activityBase.isDelete === 1){ // 已结束
            Util.alert({
              message: `感谢您对本次活动的支持，本次活动已于${data.activityBase.startTime}结束`
            })
          } else if (data.activityBase.isDelete === 2){
            Util.alert({
              message: `活动已删除`
            })
          }
        }
        if (this.params.pageNum >= data.page.totalPage) {
          this.dataFinish = true
          this.pageFlag = true
        } else {
          this.dataFinish = false
          this.pageFlag = false
        }
        if (reset) {
          this.activitData = data.list
          console.log(data)
        } else {
          this.activitData = this.activitData.concat(data.list)
        }
        return true
      },
      goactivityExplain(data){
        this.$router.push({
          name: 'activityExplain',
          params: {activityId: data.id}
        })
      },
      getAddActivityViewNum(){ // 活动点击量更新
        let Id = this.$route.params.activityId
        this.params.activityId = Id
        allActivityService.getAddActivityViewNum({activityId: this.params.activityId})
      },
      async loadMore(done){ // 加载更多
        if (this.dataFinish) {
          done && done(true)
          return
        }
        this.params.pageNum++
        await this.getActivitDetail(false)
        done && done()
      },
      async init(){
        if (typeof this.$route.params.activityId === 'undefined') {
          return
        }
        this.activitData = []
        this.params.pageNum = 1
        this.noData = false
        this.dataFinish = false
        await this.getActivitDetail(true)
      }
    },
    created(){
      this.getAddActivityViewNum()
      this.init().catch((err) => {
        console.log(err)
      })
    }
  }

</script>

<style lang='scss' rel='stylesheet/scss' scoped type="text/scss">

</style>
