<template>
  <zyt-page :on-infinite="loadMore"
            :enableInfinite="!dataFinish"
            @onScroll="onScroll" :class="activity(activitData)">
    <div slot="main">
      <div class="couponWrap">
        <coupon :couponList="activitData" :isDistance="true"></coupon>
      </div>
      <no-data v-if="noData"></no-data>
    </div>
  </zyt-page>
</template>

<script>
  import coupon from '@/components/coupon/coupon.component'
  import allActivityService from '@/service/activity/allActivity.service'
  import locationService from '@/service/common/location/location'
  import noData from '@/components/noDataMark/noDataMark.component'
  import TimeService from '@/service/time/time.service'
  import Util from '@/service/common/utils/util.service'
  export default{
    name: 'couponActivity',
    components: {
      'coupon': coupon,
      'no-data': noData
    },
    data() {
      return {
        params: {
          activityId: this.$route.params.activityId,
          pageNum: 1,
          pageSize: 20,
          currentLattitude: null,
          currentLongitude: null
        },
        activitData: null,
        noData: false,
        dataFinish: false,
        pageFlag: false
      }
    },
    methods: {
      onScroll(obj) {
      },
      async getLocation() { // 获取定位
        let position = await locationService.getLocation().catch(() => {
          throw new Error('定位失败')
        })
        this.params.currentLattitude = position.latitude
        this.params.currentLongitude = position.longitude
        return true
      },
      getAddActivityViewNum() { // 活动点击量更新
        let Id = this.$route.params.activityId
        this.params.activityId = Id
        allActivityService.getAddActivityViewNum({activityId: this.params.activityId})
      },
      async getActivitDetail(reset) { // 获取活动详情
        let Id = await this.$route.params.activityId
        this.params.activityId = Id
        let data = await allActivityService.getCouponList(this.params, {showLoading: true}).catch(() => {
          throw new Error('获取活动详情失败')
        })
        console.info(2, data)
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
            let startDate = new Date(data.activityBase.startTime.replace(/-/g, '/')).getTime()
            let StartTime = `${new Date(startDate).getFullYear()}年${new Date(startDate).getMonth() + 1}月${new Date(startDate).getDate()}日${new Date(startDate).getHours()}时`
            if (nowTime < activityStartTime){
              Util.confirm({
                message: `感谢您对本次活动的支持，本次活动将于${StartTime}开始，详情请查看活动说明`,
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
            let endDate = new Date(data.activityBase.endTime.replace(/-/g, '/')).getTime() // 活动结束时间
            let endTime = `${new Date(endDate).getFullYear()}年${new Date(endDate).getMonth() + 1}月${new Date(endDate).getDate()}日${new Date(endDate).getHours()}时`
            Util.alert({
              message: `感谢您对本次活动的支持，本次活动已于${endTime}结束`
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
        } else {
          this.activitData = this.activitData.concat(data.list)
        }
        return true
      },
      activity(data){
        console.log(data)
        if (data.length > 0){
          return 'coupon-activity'
        } else {
          return 'coupon-activity1'
        }
      },
      async loadMore(done) { // 加载更多
        if (this.dataFinish) {
          done && done(true)
          return
        }
        this.params.pageNum++
        await this.getActivitDetail(false)
        done && done()
      },
      async init() {
        if (typeof this.$route.params.activityId === 'undefined') {
          return
        }
        this.activitData = []
        this.params.pageNum = 1
        this.noData = false
        this.dataFinish = false
        await this.getLocation()
        await this.getActivitDetail(true)
      },
      goactivityExplain(data){
        this.$router.push({
          name: 'activityExplain',
          params: {activityId: data.id}
        })
      }
    },
    created() {
      this.getAddActivityViewNum()
      this.init().catch((err) => {
        console.log(err)
      })
    }
  }

</script>

<style lang='scss' rel='stylesheet/scss' type="text/scss">
  .coupon-activity {
    .scroll-inner {
      background-color: #efefef;
    }
  }
  .coupon-activity1 {
    .scroll-inner {
      background-color: #fff;
    }
  }
</style>
