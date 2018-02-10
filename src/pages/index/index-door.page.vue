<template>
  <tabs ref="tabs">
    <tab :data="tab" v-for="tab in tabs" :key="tab.icon"></tab>
  </tabs>
</template>
<script>
  import {mapState} from 'Vuex'
  import tabs from '@/components/tabs/tabs.component'
  import tab from '@/components/tabs/tab.component'
  import user from '@/pages/user/index'
  import productList from '@/pages/product/list/index'
  import collection from '@/pages/collection/collection.page'
  import cart from '@/pages/cart/cart.page'
  import Util from '@/service/common/utils/util.service'
  export default{
    name: 'indexDoor',
    data(){
      return {
        tabs: [{
          title: '店铺',
          component: productList,
          icon: 'icon-zyt-home',
          activeIcon: 'icon-zyt-home',
          active: false,
          params: {},
          actionName: ''
        }, {
          title: '我的收藏',
          component: collection,
          icon: 'icon-zyt-collect',
          activeIcon: 'icon-zyt-star-white',
          active: false,
          requireAuth: true,
          params: {},
          actionName: ''
        }, {
          title: '购物车',
          component: cart,
          icon: 'icon-zyt-shopping-cart',
          activeIcon: 'icon-zyt-shopping-cart2',
          active: false,
          requireAuth: true,
          params: {},
          actionName: ''
        }, {
          title: '我的',
          component: user,
          icon: 'icon-zyt-myself',
          activeIcon: 'icon-zyt-my-service',
          active: false,
          params: {},
          actionName: ''
        }]
      }
    },
    created(){
      this.initTabs(this.$route.params.index, this.$route.params.doorId)
      this.setDocument()
    },
    computed: {
      ...mapState(['indexTabState'])
    },
    watch: {
      '$route': {
        handler(){
          if (this.$route.name === 'indexDoor') {
            this.setDocument()
          }
        }
      }
    },
    mounted(){
      this.$root.eventHub.$on('switchIndexTab', index => {
        if (this.$refs.tabs && this.$refs.tabs.switchTab) {
          this.$refs.tabs.switchTab(index)
        }
      })
    },
    methods: {
      setDocument(){
        let index = parseInt(this.$route.params.index)
        Util.setTitle(this.tabs[index].title)
      },
      initTabs(index, doorId){
        index = parseInt(index)
        this.tabs.forEach((item, i) => {
          item.active = parseInt(i) === parseInt(index)
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
