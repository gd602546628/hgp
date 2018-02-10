<template>
  <div class="headSearch">
    <div :class="{'search-no': lunboData.length <= 0}">
    </div>
    <div class="search-box">
      <div class="search-city">
        <city-select :hasOpenCityTip="true"
                     :hasLocationTip="true"
                     @getSelectCity="getSelectCity"></city-select>
      </div>

      <div class="search-icon" @click="goToSearch()">
        <i class="icon-zyt-search"></i>
        <p class="good-life-search-input">点击搜索</p>
      </div>
    </div>
  </div>
</template>

<script>
  import citySelect from '../citySelect/citySelect.component'
  import {mapMutations} from 'vuex'
  export default {
    props: ['lunboData', 'isServantMain', 'searchNum', 'selectCity', 'secondWebView'],
    data(){
      return {}
    },
    components: {
      'city-select': citySelect
    },
    methods: {
      ...mapMutations(['showSearchMutation']),
      goToSearch(){
        //  this.showSearchMutation(true)
        this.$router.push({
          name: 'servantMainSearch',
          params: {keword: null, showSearch: '_shouldShowSearch', secondWebView: this.secondWebView}
        })
      },
      getSelectCity(data){
        this.$emit('selectCity', data)
      }
    }
  }
</script>

<style lang='scss' rel='stylesheet/scss' scoped type="text/scss">
  .headSearch {
    position: relative;
    background-color: #0164a6;
    .search-no {
      background-color: #f5f5f9;
      height: 50px;
      position: relative;
      top: 0px;
      z-index: 1;
    }
    .search-box {
      height: 33px;
      position: absolute;
      display: flex;
      width: 94%;
      z-index: 2;
      top: 9px;
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
          margin-top: -2px;
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
