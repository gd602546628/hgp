<template>
  <div>
    <div class="cgyinlet-item" v-for="item in InletData">
      <div class="itemtitle" @click="goToSecondaryService(item)">
        <div class="itemtitle-div1">
          <div></div>
          {{ item.name }}
        </div>
        <div class="itemtitle-div2" v-if="isShowRight">更多服务
          <i class="icon-zyt-arrows-right"></i>
        </div>
      </div>
      <div class="cgyinlet-ul-box">
        <ul>
          <!--<li @click="goToServiceList(item)">
            <img style="width: 25%;margin-bottom: 4px;" src='../../assets/img/serviceCgy/all.png'>
            <span>全部</span>
          </li>-->
          <li v-for="(it, index) in item.childServiceType" v-if=" isCut ? index <= 7 : true" @click="goToServiceList(it)">
            <img style="margin-bottom: 4px;" :src="it.imgUrl | imgPrefix"/>
            <span>{{ it.name }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  export default{
    props: {
      InletData: {},

//      是否控制长度为7
      isCut: {
        type: Boolean,
        default: false
      },
//      是否显示右边箭头
      isShowRight: {
        type: Boolean,
        default: false
      },
      isFirst: {
        type: Boolean,
        default: false
      }
    },
    data(){
      return {
      }
    },
    methods: {
      goToSecondaryService(item){
        if (this.isFirst) {
          this.$router.push({name: 'secondaryService', params: {levelId: item.id}})
        }
      },

      goToServiceList(item){
        this.$router.push({name: 'serviceCategoryList', params: {levelType: item.levelType, id: item.id}})
      }
    },
    created(){
      console.log(this.InletData)
    }
  }
</script>

<style lang='scss' rel='stylesheet/scss' scoped type="text/scss">
  @import "../../assets/css/variables-primary";

  .cgyitem {
    position: relative;
    .item-right {
      p {
        padding-top: map_get($ComSpacing, 'spac8');
        margin-right: 84px;
        color: map_get($ComColors, 'gray-a');
        font-size: 14px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    .viptel-box {
      position: absolute;
      right: 0px;
      bottom: map_get($ComSpacing, 'spac14');
      .vipimg-box {
        display: inline-block;
        border-right: map_get($ComSpacing, 'spac1') solid map_get($ComColors, 'gray-ef');
        width: 30px;
        height: 22px;
        img {
          width: 22px;
        }
      }
      .telimg-box {
        display: inline-block;
        padding: 0px 10px;
        img {
          width: 26px;
        }
      }
    }

  }

  .cgyinlet-item {
    border-top: map_get($ComSpacing, 'spac1') solid map_get($ComColors, 'gray-ef');
    background: map_get($ComColors, white);
    .itemtitle {
      display: flex;
      align-content: center;
      justify-content: space-between;
      padding: 13px 0px;
      border-bottom: map_get($ComSpacing, 'spac1') solid map_get($ComColors, 'gray-ef');
      margin: 0px 14px;
      .itemtitle-div1 {
        font-size: 12px;
        position: relative;
        padding-left: map_get($ComSpacing, 'spac10');
        div {
          position: absolute;
          left: 0px;
          top: 0px;
          width: 3px;
          height: 16px;
          background: map_get($ComColors, 'wathet-blue');
        }
      }
      .itemtitle-div2 {
        position: relative;
        font-size: 11px;
        padding-right: 15px;
        img {
          width: 15px;
          height: 15px;
          margin-left: map_get($ComSpacing, 'spac4');
          vertical-align: bottom;
        }
        i {
          position: absolute;
          top: 0px;
          right: 0px;
          font-size: 16px;
          color: #aaaaaa;
        }
      }
    }
    .cgyinlet-ul-box {
      ul {
        display: flex;
        display: -webkit-flex;
        -webkit-flex-wrap: wrap;
        -webkit-align-items: center;
        align-items: center;
        flex-wrap: wrap;
        padding: 4px 8px 14px 8px;
        width: 100%;
        li {
          list-style: none;
          width: 25%;
          text-align: center;
          margin-top: map_get($ComSpacing, 'spac10');
          img {
            width: 35%;
            text-align: center;
            vertical-align: middle;
          }
          span {
            font-size: 11px;
            padding: 0 6px;
            display: block;
            margin-top: map_get($ComSpacing, 'spac2');
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
        }
      }

    }
  }
</style>
