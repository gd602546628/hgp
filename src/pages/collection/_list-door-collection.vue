<template>
  <zyt-page :has-header="true" :on-infinite="loadMore"
            :enable-infinite="!dataFinish">
    <div slot="main">
      <!--店铺收藏-->
      <div v-if="!isData" class="shop-no-data">
        <img src="../../assets/img/doorIndeximg/shop_K.png" alt="">
        <span>还未收藏任何店铺</span>
      </div>
      <div class="doorClass" v-if="(doorListData.length>0)">
        <div class="item" v-for="item in doorListData" @click="goDoor(item)" :key="item.doorId">
          <div class="left">
            <img :src="item.doorImg | imgPrefix">
            <div>
              <p>{{item.doorName}}</p>
              <span v-if="item.star||item.star===0">评分 {{item.star | startFn}}</span>
            </div>
          </div>
          <div class="right" @click.stop="onCollect(item)">
            <i class="icon-zyt-star-score"></i>
            <p>取消收藏</p>
          </div>
        </div>
      </div>
    </div>
  </zyt-page>
</template>

<script>
  import {mapGetters} from 'Vuex'
  import ProductApi from '@/api/product/product.api'
  import {Codes} from '@/config/config'
  export default {
    data () {
      return {
        doorListData: [], // 收藏的店铺
        params: {
          pageNum: 1,
          pageSize: 10
        },
        dataFinish: false,
        pageFlag: false,
        isData: true // 是否有数据
      }
    },
    props: ['isTitle'],
    created(){
      this.init()
    },
    watch: {
      collectDoor(){
        this.init()
      }
    },
    computed: {
      ...mapGetters(['collectDoor'])
    },
    methods: {
      parmasFn(){
        this.params.pageNum = 1
        this.doorListData = []
        this.dataFinish = false
        this.pageFlag = false
        this.isData = true
      },
      init(){
        Object.assign(this, this.$options.data())
        this.getDoorList(true)
      },
      async getDoorList(reset){ // 获取用户所有的店铺收藏信息 reset是否重置列表true重置，false添加
        let data = await ProductApi.getDoorList(this.params).catch(() => {
          throw new Error('获取用户所有的店铺收藏信息失败')
        })
        if (!data.data.doorList || data.data.doorList.length < 1) { // 没有数据
          this.isData = false
        }
        if (!data.data || !data.data.doorList || data.data.doorList.length <= 0) {
          this.dataFinish = true
          return
        }
        if (this.params.pageNum >= data.data.totalPage) {
          this.dataFinish = true
          this.pageFlag = true
          console.log('所有数据加载完毕')
        } else {
          this.dataFinish = false
          this.pageFlag = false
        }
        if (reset) {
          this.doorListData = data.data.doorList
        } else {
          this.doorListData = this.doorListData.concat(data.data.doorList)
        }
        return true
      },
      async onCollect(item){ // 取消店铺收藏
        let data = await ProductApi.getsDDoor({
          doorId: item.doorId,
          type: 1 // 1: 移除收藏，0:加入收藏
        }).catch(() => {
          throw new Error('添加或取消收藏失败')
        })
        let doorItem = []
        doorItem.push(item)
        if (data && data.code === Codes.success) {
          this.doorListData = this.doorListData.filter((door) => {
            return doorItem.indexOf(door) === -1
          })
          if (this.doorListData.length < 1) { // 没有数据
            this.isData = false
          }
        } else {
          console.log('取消收藏失败' + data.mesg)
        }
      },
      goDoor(item){ // 店铺首页跳转
      /*  this.$root.eventHub.$emit('switchIndexTab', 0) */
        this.$router.push({
          name: 'indexDoor',
          params: {
            index: 0,
            doorId: item.doorId
          }
        })
      },
      async loadMore(done){ // 加载跟多产品
        if (this.dataFinish) {
          done && done(true)
          return
        }
        this.params.pageNum++
        await this.getDoorList(false)
        done && done()
      }
    },
    components: {}
  }
</script>

<style lang="scss" rel="stylesheet/scss" type="text/scss" scoped>

  .doorClass {
    /*    margin-top: 92px;*/
    .item {
      height: 68px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0px 10px;
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
        padding-left: 10px;
        padding-right: 4px;
        border-left: 1px dotted #cfcfcf;
        text-align: center;
        i {
          font-size: 25px;
          color: #FFC001;
        }
        p {
          font-size: 11px;
        }
      }
    }
  }

  .shop-no-data {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: calc(50%);
    img {
      height: 100px;
      width: 100px;
    }
    span {
      color: #9e9e9e;
    }
  }
</style>
