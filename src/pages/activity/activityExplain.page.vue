<template>
  <zyt-page>
    <div slot="main">
      <div>
        <div class="explain-div" v-for="item in test">
          <img :src="explainData.image | imgPrefix">
          <div v-ueditor v-html="item" class="parse-html"></div>
        </div>
      </div>
    </div>
  </zyt-page>
</template>

<script>
  import allActivityService from '@/service/activity/allActivity.service'
  export default{
    name: 'activityExplain',
    data(){
      return {
        params: {
          activityId: this.$route.params.activityId
        },
        explainData: null,
        test: []
      }
    },
    methods: {
      getAddActivityViewNum(){ // 活动点击量更新
        let Id = this.$route.params.activityId
        this.params.activityId = Id
        allActivityService.getAddActivityViewNum({activityId: this.params.activityId})
      },
      async getActivitDetail(){ // 获取活动说明
        let Id = await this.$route.params.activityId
        this.params.activityId = Id
        let data = await allActivityService.getActivityExplain(this.params, {showLoading: true}).catch(() => {
          throw new Error('获取活动说明失败')
        })
        if (!data) {
          return
        }
        this.explainData = data
        this.html = data.introduce
        this.test = [this.html]
        /* if (parseInt(data.isUrl) === 1) {
         window.location.href = data.introduce
         } else {
         this.explainData = data
         this.html = data.introduce
         this.test = [this.html]
         } */
      }
    },
    created(){
      this.getAddActivityViewNum()
      this.getActivitDetail()
    }
  }

</script>

<style lang='scss' rel='stylesheet/scss' scoped type="text/scss">
  .explain-div {
    img {
      width: 100%;
      display: block;
    }
    .parse-html {
      padding: 12px 10px 0px 10px;
      text-align: justify;
      text-indent: 2rem;
      color: #343434;
    }
  }
</style>
