/**
* Created by guooug on 2017/6/16.
*/
<template lang="html">
  <div class="tabs-container">
    <div class="tab-content">
      <slot></slot>
    </div>
    <div class="tab-bar row">
      <div class="col" :class="{active: tab.active }" @click="switchTab(index)" v-for=" (tab,index) in tabs ">
        <p class="icon" :class="getIcon(tab)"></p>
        <p class="title">{{tab.title}}</p>
      </div>
    </div>
  </div>
</template>

<script lang="babel">

  import {mapActions} from 'vuex'
  export default {
    data () {
      return {
        tabs: [],
        canSwitch: true
      }
    },
    mounted(){
      this.initTabs()
    },
    methods: {
      ...mapActions(['getUserToken']),
      //  初始化tabs
      initTabs(){
        this.$children.forEach((item) => {
          this.tabs.push(item.data)
        })
      },
      /**
       * 获取图标 tab项的图标
       * @param tab
       * @returns {{}}
       */
      getIcon(tab){
        let data = {}
        if (tab.active && tab.activeIcon) {
          data[tab.activeIcon] = true
        } else {
          data[tab.icon] = true
        }
        return data
      },

      /**
       * 切换tab，并替换历史记录
       * @param tab
       * @param index
       */
      async switchTab(index){
        index = parseInt(index)
        let oldIndex = parseInt(this.$route.params.index)
        let tab = this.tabs[index]
        let oldTab = this.tabs[oldIndex]
        if (this.canSwitch) {
          this.canSwitch = false
          if (tab.requireAuth) {
            let userInfo = await this.getUserToken({
              forceLogin: true
            }).catch(() => {
              this.canSwitch = true
              throw String('需要权限才能访问')
            })
            if (!userInfo || !userInfo.token) {
              this.canSwitch = true
              return
            }
          }
          if (index !== oldIndex) {
            tab.active = true
            oldTab.active = false
            let actionName = index > oldIndex ? 'left' : 'right'
            tab['actionName'] = actionName
            oldTab['actionName'] = actionName
            var params = Object.assign(this.$route.params, {
              index: index
            })
            this.$router.replace({name: this.$route.name, params: params})
          }
          this.canSwitch = true
        }
      }
    },
    created(){
      let eventName = this.$route.name
      this.$root.eventHub.$on(eventName, (scrollTop, event) => {
        let newEventName = `${eventName}_${this.index}`
        this.$root.eventHub.$emit(newEventName, scrollTop, event)
      })
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" type="text/scss" scoped>
  @import "../../assets/css/variables-primary";

  .tabs-container {
    .tab-bar {
      z-index: 9;
      position: fixed;
      bottom: 0px;
      width: 100%;
      height: 49px;
      background: white;
      border: 1px solid map_get($ComBorderColor, dd);
      .col {
        border-bottom: 2px solid transparent;
        height: 100%;
        border-right: 1px solid map_get($ComBorderColor, dd);
        // border-right: .55px solid map_get($ComBorderColor, dd);
        text-align: center;
        .icon {
          padding-top: 3px;
          font-size: 28px;
        }
        .title {
          font-size: 12px;
        }
        &:last-child {
          border-right: 0px
        }
        &.active {
          color: map_get($ComColors, wathet-blue);
          border-bottom: 2px solid map_get($ComColors, wathet-blue);
        }
      }
    }
    .tab-content {
      width: 100%;
      top: 0;
      bottom: 0;
      padding-bottom: 49px;
    }
  }
</style>
