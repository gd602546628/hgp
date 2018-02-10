<template>
  <zyt-page :on-infinite="loadMore"
            :enableInfinite="!dataFinish"
            @onScroll="onScroll">
    <div slot="main">
      <!--大图模式-->
      <div v-if="type===1">
        <div class="ttPrizeWrap" v-if="activitData.length>0">
          <div class="ttyj-item" v-for="item in activitData" @click.stop="showActiveAlert(item)">
            <div class="img-box">
              <img-component :img-src="item.image | imgPrefix" class="large-img"></img-component>
              <div v-if="(activitData.length>0) && item.name" class="ttyj-item-div">
                <p>{{item.name}}</p>
                <div class="ttyj-btn">立即参与</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--列表模式-->
      <div v-if="type===2">
        <div class="ttPrizeWrap1" v-if="activitData.length>0">
          <div class="ttyj-item1" v-for="item in activitData" @click.stop="showActiveAlert(item)">
            <div class="img-box1">
              <img-component :img-src="item.image | imgPrefix" class="img"></img-component>
              <!--<img :src="item.image | imgPrefix"/>-->
              <div v-if="(activitData.length>0) && item.name" class="ttyj-item-div1">
                <p>{{item.name}}</p>
                <div>
                  <div class="ttyj-btn1">立即参与</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div slot="other">
      <right-bottom :currentTop="currentTop" @click.native="toggleType(type)">
        <i v-if="type===1" class="icon-zyt-list-menu"></i>
        <i v-if="type===2" class="icon-zyt-larger-menu"></i>
      </right-bottom>
    </div>
  </zyt-page>
</template>

<script>
  import allActivityService from '@/service/activity/allActivity.service'
  import { allActiveJump } from '@/service/activity/activeJump.service'
  import Util from '@/service/common/utils/util.service'
  import ImgComponent from '@/components/common/img/img.component'
  import RightBottom from '@/components/menu/right-bottom.component'
  import TimeService from '@/service/time/time.service'

  export default {
    name: 'allActivitie',
    data () {
      return {
        activitData: [],
        params: {
          pageNum: 1,
          pageSize: 20
        },
        dataFinish: false,
        pageFlag: false,
        type: 1,
        currentTop: 0
      }
    },
    components: {
      'img-component': ImgComponent,
      'right-bottom': RightBottom
    },
    methods: {
      onScroll (obj) {
      },
      async parmasFn () {
        this.activitData = []
        this.params.pageNum = 1
        this.dataFinish = false
        this.pageFlag = false
      },
      async getAllActiveList (reset) { // 获取全部活动
        let data = await allActivityService.getAllActive(this.params, {showLoading: true}).catch(() => {
          throw new Error('获取全部活动失败')
        })
        if (data.list.length === 0) {
          console.log('没有数据')
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
          this.activitData = data.list
        } else {
          this.activitData = this.activitData.concat(data.list)
        }
        return true
      },
      async loadMore (done) { // 加载更多
        if (this.dataFinish) {
          done && done(true)
          return
        }
        this.params.pageNum++
        await this.getAllActiveList(false)
        done && done()
      },
      showActiveAlert (item) { // 跳转活动详情
        let startTime = ''
        let endTime = ''
        let nowTime
        let showConfirm = (year, month, day, hours) => {
          this.showConfirm('感谢您对本次活动的支持，本次活动将于' + year + '年' + month + '月' + day + '日' + hours + '时开始，详情查看活动说明！', '活动说明', '我知道了', item)
        }
        let endConfirm = () => {
          Util.confirm('活动已结束！', '', {
            confirmButtonText: '关闭',
            showCancelButton: false
          })
        }
        nowTime = TimeService.sysTime()
        if (item.startTime && item.startTime !== null) {
          startTime = new Date(item.startTime.replace(/-/g, '/')).getTime()
        }
        if (item.endTime && item.endTime !== null) {
          endTime = new Date(item.endTime.replace(/-/g, '/')).getTime()
        }
        if (item.isTime === 1) {
          allActiveJump(item)
        } else {
          if (nowTime > startTime && nowTime < endTime) {
            allActiveJump(item)
          } else if (nowTime < startTime) {
            showConfirm(new Date(startTime).getFullYear(), new Date(startTime).getMonth() + 1, new Date(startTime).getDate(), new Date(startTime).getHours())
          } else {
            endConfirm()
          }
        }
      },
      showConfirm (message, ok, cancel, params) {
        Util.confirm({
          message: message,
          confirmButtonText: ok,
          cancelButtonText: cancel,
          showCancelButton: true
        }).then(() => {
          this.goActInfo(params)
        }).catch(() => {
        })
      },
      toggleType (type) {
        if (type === 1) {
          this.type = 2
        } else if (type === 2) {
          this.type = 1
        }
      },
      goActInfo (item) { // 跳转活动说明页
        if (item.isUrl === 1) {
          Util.openUrl(item.introduce)
        } else {
          this.$router.push({name: 'activityExplain', params: {activityId: item.id}})
        }
      },
      async init () {
        await this.parmasFn()
        await this.getAllActiveList(true).catch((err) => {
          console.log(err)
        })
      }
    },
    created () {
      this.init()
    }
  }

</script>

<style lang='scss' rel='stylesheet/scss' scoped type="text/scss">
  .ttPrizeWrap {
    height: 100%;
    overflow-y: scroll;
    overflow-scrolling: touch;
    .ttyj-item {
      .img-box {
        width: 100%;
        .large-img {
          height:168px;
          display: -webkit-flex;
          display: flex;
        }
      }
      .ttyj-item-div {
        height: 50px;
        background-color: #ffffff;
        font-size: 13px;
        color: #343434;
        padding: 0px 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        p{
          width: 74%;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
      }
      .ttyj-btn {
        font-size: 14px;
        color: #ffffff;
        border-radius: 3px;
        background-color: #0164a6;
        height: 30px;
        padding:0 9px;
        display: flex;
        align-items: center;
      }
    }
  }

  .ttPrizeWrap1 {
    height: 100%;
    overflow-y: scroll;
    overflow-scrolling: touch;
    .ttyj-item1 {
      .img-box1 {
        width: 100%;
        display: flex;
        display: -webkit-flex;
        -webkit-justify-content: flex-start;
        -webkit-align-items: center;
        justify-content: flex-start;
        align-items: center;
        border-bottom: 1px solid #efefef;
        .img {
          width: 30%;
          display: block;
          height: 100%;
          margin: 10px;
        }
      }
      .ttyj-item-div1 {
        height: 96px;
        background-color: #ffffff;
        font-size: 13px;
        color: #343434;
        display: -webkit-flex;
        display: flex;
        -webkit-flex-direction: column;
        flex-direction: column;
        -webkit-justify-content: space-between;
        justify-content: space-between;
        width:100%;
        padding-right:10px;
        p{
          margin-top: 10px;
          width: 100%;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        div{
          width:100%;
          display: -webkit-flex;
          display: flex;
          -webkit-justify-content: flex-end;
          justify-content: flex-end;
          .ttyj-btn1 {
            font-size: 13px;
            color: #ffffff;
            background-color: #0164a6;
            padding: 0px 9px;
            border-radius: 3px;
            height: 30px;
            display: -webkit-flex;
            display: flex;
            -webkit-justify-content: center;
            -webkit-align-items: center;
            justify-content: center;
            align-items: center;
            width:74px;
            margin-bottom: 10px;
          }
        }
      }
    }
  }

  .icon-zyt-list-menu,.icon-zyt-larger-menu{
    font-size: 20px;
    color: white;
    display: block;
  }
</style>
