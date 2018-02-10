/**
* Created by guooug on 2017/6/16.
*/
<template lang="html">
  <div class="_img-container" :style="getBackgroundImage">
    <img :src="getImgSrc" alt="">
    <slot></slot>
  </div>
</template>

<script>
  import {Imgs} from '@/config/config'
  import Util from '@/service/common/utils/util.service'
  export default {
    props: {
      type: {
        default: '1' // 图片的比例为1:1
      },
      imgSrc: {
        type: String,
        default: ''
      },
      addPrefix: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      getImgSrc(){
        if (this.type === '1') {
          return Imgs.ratio1_1
        }
      },
      getBackgroundImage(){
        if (this.imgSrc) {
          let url = this.imgSrc
          if (this.addPrefix) {
            url = Util.addImgPrefix(this.imgSrc)
          }
          return {
            'background-image': `url('${url}')`
          }
        } else {
          return {}
        }
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" type="text/scss" scoped>
  ._img-container {
    width: 100%;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    img {
      display: block;
      width: 100%;
      height: auto;
    }
  }
</style>
