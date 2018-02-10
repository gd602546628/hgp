/**
* Created by guooug on 2017/6/16.
*/
<template lang="html">
  <img-component class="swiper-container" v-if="imgs">
    <mt-swipe :auto="0" :showIndicators="imgs.length === 1?false:true">
      <mt-swipe-item v-for="(img,index) in imgs " :key="index">
        <img-component :imgSrc="img" @click.native="show(imgs,index)"></img-component>
      </mt-swipe-item>
    </mt-swipe>
  </img-component>
</template>

<script>
  import Vue from 'Vue'
  import {Swipe, SwipeItem} from 'mint-ui'
  import ImgComponent from '@/components/common/img/img.component'
  import PhotoSwiperService from '@/service/photo-swiper/photo-swiper.service.js'
  Vue.component(Swipe.name, Swipe)
  Vue.component(SwipeItem.name, SwipeItem)
  export default {
    props: {
      imgs: {
        type: Array,
        default: () => []
      }
    },
    mounted(){
      console.info(this.imgs)
    },
    components: {
      'img-component': ImgComponent
    },
    methods: {
      show(imgs, index){
        PhotoSwiperService.show(imgs, index)
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" type="text/scss" scoped>
  .swiper-container {
    position: relative;
  }

  .mint-swipe {
    width: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
  }
</style>
