<template>
  <tabs>
    <tab :data="tab" v-for="tab in tabs" :key="tab"></tab>
  </tabs>
</template>
<script>
  import test from '@/pages/tab/test'
  import scroll from '@/pages/tab/scroll.page'
  import tabs from '@/components/tabs/tabs.component'
  import tab from '@/components/tabs/tab.component'
  export default{
    data(){
      return {
        tabs: [{
          title: 'test',
          component: test,
          icon: 'icon-zyt-home',
          activeIcon: 'icon-zyt-phone',
          active: true,
          params: {}
        }, {
          title: 'test2',
          component: test,
          icon: 'icon-zyt-home',
          active: false,
          params: {}
        }, {
          title: '上拉下拉',
          component: scroll,
          icon: 'icon-zyt-home',
          active: false,
          params: {}
        }]
      }
    },
    created(){
//      获取路由参数，并初始化tab首页
      this.initTabs(this.$route.params.index, this.$route.params.doorId)
    },
    mounted(){
      console.info(0, this.$router, this.$route)
    },
    methods: {
      initTabs(index, doorId){
      }
    },
    components: {
      tabs,
      tab
    }
  }
</script>
<style lang='scss' rel='stylesheet/scss' scoped></style>
