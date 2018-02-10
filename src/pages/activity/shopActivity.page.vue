<template>
  <zyt-page :on-infinite="loadMore"
            :enableInfinite="!dataFinish"
            @onScroll="onScroll">
    <div slot="main">
      <div class="doorList">
        <door :doorList="activitData" :isLocation="isLocation"></door>
      </div>
      <no-data v-if="noData"></no-data>
    </div>
  </zyt-page>
</template>

<script>
  import door from '@/components/preferred/preferred.component'
  import allActivityService from '@/service/activity/allActivity.service'
  import locationService from '@/service/common/location/location'
  import noData from '@/components/noDataMark/noDataMark.component'
  export default{
    name: 'shopActivity',
    components: {
      'door': door,
      'no-data': noData
    },
    data(){
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
        pageFlag: false,
        isLocation: true
      }
    },
    methods: {
      onScroll(obj){
      },
      async getLocation(){ // 获取定位
        let position = await locationService.getLocation().catch(() => {
          this.isLocation = false
          throw new Error('定位失败')
        })
        this.isLocation = true
        this.params.currentLattitude = position.latitude
        this.params.currentLongitude = position.longitude
        return true
      },
      getAddActivityViewNum(){ // 活动点击量更新
        let Id = this.$route.params.activityId
        this.params.activityId = Id
        allActivityService.getAddActivityViewNum({activityId: this.params.activityId})
      },
      async getActivitDetail(reset){ // 获取活动详情
        let Id = await this.$route.params.activityId
        this.params.activityId = Id
        let data = await allActivityService.getDoorActiveList(this.params, {showLoading: true}).catch(() => {
          throw new Error('获取店铺活动详情失败')
        })
        if (!data || !data.list || data.list.length === 0) {
          this.dataFinish = true
          this.pageFlag = true
          this.noData = true
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
          this.activitData = data.list
        } else {
          this.activitData = this.activitData.concat(data.list)
        }
        return true
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
        this.isLocation = true
        await this.getLocation()
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
