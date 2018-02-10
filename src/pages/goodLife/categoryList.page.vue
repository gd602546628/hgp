<template>
  <div>
    <div v-for="item in firstListData">
      <div class="fuwufl-item-list">
        <div class="listtitle" @click="goToSecondList(item)"
        >
          <span class="blue-bd-left"></span>
          <div class="listTitle-content classify-list">{{item.name}}</div>
          <i class="icon-zyt-arrows-right"></i>
        </div>
        <div class="fenlei-content">

          <div class="twofenlei" style="display: inline-block;" @click="goDetialList(item,1)">
            <span>全部</span>
          </div
          ><div class="twofenlei" v-for="(it, index) in item.children" v-if="index <= 4" @click="goDetialList(it,2)"
          ><span>{{it.name}}</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import preferredService from '@/service/preferred/preferred.service'
  export default{
    name: 'goodLifeCategoryList',
    data(){
      return {
        firstListData: []
      }
    },
    methods: {
      async getDoorList(){
        let data = await preferredService.getLifeCate({}, {showLoading: true})
        if (data.length === 0) {
          console.log('没有数据')
          return
        }
        this.firstListData = data[2].children
      },
      goToSecondList(item){
        this.$router.push({name: 'goodLifeCategoryDetail', params: {id: item.id}})
      },

      goDetialList(item, level){
        this.$router.push({name: 'goodLifeCategory', params: {level: level, id: item.id}})
      }
    },
    computed: {},
    created(){
      this.getDoorList()
    }
  }
</script>

<style lang='scss' rel='stylesheet/scss' scoped type='text/scss'>

  .fuwufl-item-list {
    width: 100%;
    border-top: solid #efefef 1px;
    background: #ffffff;
  }

  .fuwufl-item-list:nth-child(1) {
    margin-top: 0px;
  }

  .fuwufl-item-list .listtitle {
    position: relative;
    margin: 0px 14px;
    padding: 11px 0px;
    border-bottom: solid #efefef 1px;
  }

  .fuwufl-item-list .listtitle .blue-bd-left {
    display: inline-block;
    width: 3px;
    height: 16px;
    margin-right: 6px;
    position: relative;
    top: 4px;
    background-color: #0164a6;
  }

  .fuwufl-item-list .listtitle .listTitle-content {
    display: inline-block;
    font-size: 12px;
  }

  .fuwufl-item-list .listtitle .classify-list {
    font-size: 14px;
    font-weight: bold;
  }

  .fuwufl-item-list .listtitle .listTitle-content + div {
    position: absolute;
    right: 15px;
    margin-top: -19px;
  }

  .fuwufl-item-list .listtitle i {
    width: 15px;
    height: 15px;
    position: absolute;
    right: -4px;
    top: 64%;
    margin-top: -12px;
  }

  .fuwufl-item-list .fenlei-content {
    width: 100%;
  }

  .fuwufl-item-list .fenlei-content .twofenlei {
    display: inline-block;
    width: 33%;
    border-right: 1px solid #efefef;
    margin: 8px 0px;
    padding: 0px 6px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    height: 22px;
    text-align: center;
  }

  .fuwufl-item-list .fenlei-content .twofenlei span {
    font-size: 14px;
    text-align: center;
    padding: 2px 0px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    height: 22px;
    display: block;
  }

  .fuwufl-item-list .fenlei-content .twofenlei:nth-child(3n) {
    border-right: none;
  }

</style>
