<template>
  <zyt-page :hasHeader="true" :hasFooter="showDelList"
            :on-infinite="loadMore"
            :enableInfinite="!dataFinish">
    <mt-header title="我的预约" slot="header">
      <!--<mt-button slot="left" icon="back" @click="handleBack"></mt-button>-->
      <mt-button slot="right" class="edit" @click="closeDelList" v-if="showDelList">完成</mt-button>
      <mt-button slot="right" class="edit" @click="showDel" v-if="!showDelList">编辑</mt-button>
    </mt-header>
    <div slot="main">
      <my-service :data="myServiceList" v-show="!showDelList"
      ></my-service>
      <my-service-del :data="myServiceDelList" v-show="showDelList" class="del-list"></my-service-del>
      <div class="no-services" v-if="myServiceList.length<=0">
        <img src="../../assets/img/yuyue_k.png">
        <span>还未添加任何预约信息</span>
      </div>
    </div>
    <div slot="footer" v-if="showDelList">
      <div class="delBtn" @click.stop="delApply()">删除预约</div>
    </div>
  </zyt-page>
</template>
<script>
  import myService from '@/components/myService/myService.component'
  import goodService from '@/service/goodService/goodService.service'
  import myServiceDel from '@/components/myService/myServiceDel.component'
  import { Codes } from '@/config/config'
  import Util from '@/service/common/utils/util.service'

  export default {
    name: 'myService',
    components: {
      'my-service': myService,
      'my-service-del': myServiceDel
    },
    data () {
      return {
        params: {
          pageNum: 1,
          pageSize: 20
        },
        myServiceList: [],
        myServiceDelList: [],
        showDelList: false,
        dataFinish: false,
        pageFlag: false
      }
    },
    created () {
      this.init()
    },
    methods: {
      async init () {
        this.params.pageNum = 1
        this.pageFlag = false
        this.dataFinish = false
        this.getserviceList(true)
      },
      async getserviceList (reset) {
        let data = await goodService.getMyService(this.params)
        if (data.list.length === 0) {
          console.log('没有数据')
          return
        }
        if (data.page.pageNum === data.page.totalPage) {
          this.dataFinish = true
          this.pageFlag = true
          console.log('所有数据加载完毕')
        }
        if (reset) {
          this.myServiceList = data.list
        } else {
          this.myServiceList = this.myServiceList.concat(data.list)
        }
      },
      async getDelList () {
        let data = await goodService.getDelServiceList()
        this.myServiceDelList = data
      },
      handleBack () {
        this.$router.go(-1)
      },
      showDel () {
        this.showDelList = true
        this.getDelList()
        this.dataFinish = true
      },
      closeDelList () {
        this.dataFinish = this.pageFlag
        this.showDelList = false
      },
      async delApply () {
        let ids = []
        let noDelList = []
        this.myServiceDelList.forEach(item => {
          if (item.checked) {
            ids.push(item.id)
          } else {
            // 保存不被删除的可删除列表的元素
            noDelList.push(item)
          }
        })
        if (ids.length > 0) { // 选择了删除的数据时
          console.log(ids)
          await Util.confirm('确定删除数据吗')
          let delResult = await goodService.delService({ids: ids})
          if (delResult.code === Codes.success) {
            this.myServiceDelList = noDelList
            this.init()
            Util.alert('删除成功')
          } else {
            Util.alert('删除失败')
          }
        } else {
          Util.alert('请先选择需要删除的数据！')
        }
      },
      async loadMore (done) { // 加载更多
        if (this.dataFinish) {
          done && done(true)
          return
        }
        this.params.pageNum++
        await this.getserviceList(false)
        done && done()
      }
    }
  }
</script>
<style lang='scss' rel='stylesheet/scss' scoped>
  .edit {
    height: 100%;
    font-size: 16px;
  }

  .del-list {
    margin-bottom: 35px;
  }

  .no-services {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 50%;
    img {
      height: 70px;
    }
    span {
      margin-top: 5px;
      color: #9e9e9e;
    }
  }

  .delBtn {
    width: 100%;
    height: 49px;
    background-color: #f8311e;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: 400;
  }
</style>
