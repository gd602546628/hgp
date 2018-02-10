/**
* Created by guooug on 2017/6/16.
*/
<template>
  <div>
    <div class="row tab-menu" slot="header">
      <div class="col" :class="{'active' : showDoor}" @click="switchTab(0)">店铺收藏</div>
      <div class="col" :class="{'active' : !showDoor}" @click="switchTab(1)">商品收藏</div>
    </div>
    <!--收藏店铺-->
    <list-door ref="listDoor" class="list-door list" :class="{active:showDoor}"></list-door>
    <!--商品收藏-->
    <list-prd :class="{active:!showDoor}" class="list-prd list" :showDelete="false" :active="!showDoor"></list-prd>
  </div>
</template>

<script>
  import listDoor from './_list-door-collection.vue'
  import listPrd from './_list-prd-collection.vue'
  export default {
    name: 'collection',
    data () {
      return {
        type: parseInt(this.$route.params.type)
      }
    },
    computed: {
      showDoor(){
        if (this.type === 0) {
          return true
        }
        return false
      }
    },
    methods: {
      switchTab(type){
        this.type = type
        this.$router.replace({
          name: 'collection',
          params: {
            type: type
          }
        })
      }
    },
    components: {
      'list-door': listDoor,
      'list-prd': listPrd
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" type="text/scss" scoped>
  .index-title {
    border-bottom-width: 1px !important;
    background: -webkit-linear-gradient(top, #FFFFFF, #EBEAEA) !important;
    border-bottom: 1px solid #b2b2b2;
    border-top: 1px solid #b2b2b2;
    color: #2d2d2d;
    .title-left {
      i {
        font-size: 19px;
        font-weight: bold;
        padding-left: 8px;
        color: #343434;
        margin-right: 2px;
      }
    }
    .title-right {
      color: #444 !important;
      .mint-button-text {
        color: #444 !important;
      }
    }
  }

  .tab-menu {
    position: fixed;
    z-index: 99;
    width: 100%;
    opacity: 1;
    background-color: #ffffff;
    > div {
      width: 50%;
      height: 44px;
      color: #343434;
      line-height: 44px;
      text-align: center;
      border-top: solid 1px #dddddd;
      border-bottom: solid 1px #dddddd;
    }
    > div:first-child {
      border-right: solid 1px #dddddd;
    }
    .active {
      color: #0164a6;
      border-bottom: 2px solid #0164a6;
    }
  }

  .main {
    padding-bottom: 49px;
  }

  .list-door {
    background-color: white;
    z-index: 2;
  }

  .list-prd {
    background-color: white;
    z-index: 1;
  }

  .list {
    &.active {
      z-index: 3;
    }
  }
</style>
