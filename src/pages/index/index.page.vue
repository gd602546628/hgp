<template>
  <tabs>
    <tab :data="tab" v-for="tab in tabs" :key="tab"></tab>
  </tabs>
</template>
<script>
  import tabs from '@/components/tabs/tabs.component'
  import tab from '@/components/tabs/tab.component'
  import servantMain from '@/pages/servantMain/servantMain.page'
  import user from '@/pages/user/index'
  import collection from '@/pages/collection/collection.page'
  import cart from '@/pages/cart/cart.page'
  export default{
    name: 'index',
    data(){
      return {
        tabs: [{
          title: '商城',
          component: servantMain,
          icon: 'icon-zyt-store2',
          activeIcon: 'icon-zyt-store',
          active: false,
          params: {}
        }, {
          title: '收藏',
          component: collection,
          icon: 'icon-zyt-collect',
          activeIcon: 'icon-zyt-star-white',
          active: false,
          requireAuth: true,
          params: {}
        }, {
          title: '购物车',
          component: cart,
          icon: 'icon-zyt-shopping-cart',
          activeIcon: 'icon-zyt-shopping-cart2',
          active: false,
          params: {}
        }, {
          title: '我的',
          component: user,
          icon: 'icon-zyt-myself',
          activeIcon: 'icon-zyt-my-service',
          active: false,
          params: {}
        }]
      }
    },
    created(){
      this.initTabs(this.$route.params.index)
    },
    methods: {
      initTabs(index, doorId){
        index = parseInt(index)
        this.tabs.forEach((item, i) => {
          item.active = i === index
        })
      }
    },
    components: {
      tabs,
      tab
    }
  }
</script>
<style lang='scss' rel='stylesheet/scss' scoped></style>
