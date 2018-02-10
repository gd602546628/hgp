<template>
  <zyt-page>
    <div slot="main">
      <div class="headSearch">
        <div class="search-box">
          <div class="search-city">
            <city-select @getSelectCity="onSelectCity($event)"></city-select>
          </div>

          <div class="search-icon" @click="onSearch()">
            <i class="icon-zyt-search"></i>
            <p class="good-life-search-input">点击搜索</p>
          </div>
        </div>
      </div>
      <div>
        <svc-ctgry-inlet :InletData="secondData"></svc-ctgry-inlet>
      </div>
    </div>
  </zyt-page>
</template>
<script>
  import citySelect from '@/components/citySelect/citySelect.component'
  import serviceCategoryInlet from '@/components/serviceCategory/serviceCategoryInlet.component'
  import goodService from '@/service/goodService/goodService.service'
  import {mapMutations} from 'vuex'
  export default{
    name: 'secondaryService',
    components: {
      'city-select': citySelect,
      'svc-ctgry-inlet': serviceCategoryInlet
    },
    data(){
      return {
        secondData: []
      }
    },
    methods: {
      ...mapMutations(['showSearchMutation']),
      getServiceTypeList(){ // 获取分类列表
        goodService.getServiceType({}, {showLoading: true}).then(data => {
          if (data.list.length === 0) {
            console.log('没有数据')
            return
          }
          for (let i = 0; i < data.list.length; i++) {
            if (data.list[i].id === this.$route.params.levelId) {
              this.secondData.push(data.list[i])
            }
          }
        })
      },
      async onSelectCity(){
      },
      init(){
        if (typeof this.$route.params.levelId === 'undefined') {
          return
        }
        this.secondData = []
        this.getServiceTypeList()
      },
      onSearch(){
        this.showSearchMutation(true)
        this.$router.push({
          name: 'serviceSearch',
          params: {keyword: null}
        })
      }
    },
    created(){
      this.init()
    }
    /* watch: {
      '$route': 'init'
    } */
  }
</script>
<style lang='scss' rel='stylesheet/scss' scoped type="text/scss">
  .headSearch {
    position: relative;
    height: 50px;
    background-color: #f5f5f9;
    .search-box {
      height: 34px;
      position: absolute;
      display: flex;
      width: 94%;
      z-index: 2;
      top: 8px;
      margin: 0 3% 0 3%;
      background-color: white;
      font-size: 13px;
      border-radius: 3px;
      .search-city {
        width: 75px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-right: 1px solid #e1e1e1;
        margin: 6px 0 6px 5px;
        padding-right: 5px;
      }
      .search-icon {
        display: flex;
        flex: 1;
        align-items: center;
        justify-content: center;
        i {
          font-size: 18px;
          padding: 0;
          margin-right: 5px;
          color: #b0b0b0;
        }
        p {
          height: 35px;
          line-height: 35px;
          margin: 0;
          color: #88888d;
        }
      }
    }

  }
</style>
