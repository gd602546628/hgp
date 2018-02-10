/**
* Created by guooug on 2017/6/16.
*/
<template>
  <zyt-page>
    <div slot="main">
      <header-component v-if="!isApp"></header-component>
      <main-component></main-component>
    </div>
  </zyt-page>
</template>

<script>
  import {mapGetters} from 'Vuex'
  import HeaderComponent from './_header'
  import MainComponent from './_main'
  import Native from '@/service/common/native/native.service'
  export default {
    name: 'me',
    computed: {
      ...mapGetters(['userInfo', 'hasAuth']),
      isApp(){
        return Native.isApp()
      }
    },
    components: {
      'header-component': HeaderComponent,
      'main-component': MainComponent
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" type="text/scss" scoped>
</style>
