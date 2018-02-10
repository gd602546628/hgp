<template>
  <div class="six-draw" v-if="prizeList">
    <div class="box" ref="box">
      <img :src="bg" class="box-bg"/>
      <div class="prize-wrap">
        <img class="prize-item" v-for="prize in prizeArr" :src="imgPrefix(prize)"
             @click.stop="goPrizeIfo(prize)"
             :style="{transformOrigin:transformOrigin}"/>
      </div>

      <div class="pointer"
           :style="{transform:pointerRotate}"
           :class="{active:beginFlag}"
           @transtionend="end()"
           @webkitTransitionEnd="end()"
      >
        <img src="../../assets/img/draw/guang.png" class="pointer-bg"/>
      </div>
      <img src="../../assets/img/draw/zs_text.png" class="pointer-text" @click.stop="pointerClick()">
    </div>
  </div>
</template>
<script>
  import thankImg from '../../assets/img/draw/zs_xx.png'
  import Util from '@/service/common/utils/util.service'
  import {Config} from '@/config/config'
  import bg from '../../assets/img/draw/zs_quan.png'
  export default{
    props: {
      prizeList: {
        type: Array,
        required: true
      }
    },
    computed: {
      prizeArr(){
        let item = {
          prizeImg: thankImg,
          id: -1
        }
        return Util.fillArr(this.prizeList, 6, item)
      }
    },
    data(){
      return {
        transformOrigin: 'center 192px',
        bg: bg,
        pointerRotate: 'rotate(0deg)',
        beginFlag: false,
        drawNumber: 0
      }
    },
    mounted(){
      let oImg = new Image()
      oImg.src = bg
      oImg.onload = () => {
        let originY = parseInt(this.$refs.box.offsetHeight * 0.4)
        this.transformOrigin = `center ${originY}px`
      }
    },
    methods: {
      imgPrefix(item){
        if (item.id === -1) {
          return item.prizeImg
        } else {
          return Config.imgPrefix + item.prizeImg
        }
      },
      pointerClick(){
        if (this.beginFlag) {
          return
        }
        this.$emit('pointerClick')
      },
      begin(id){
        this.beginFlag = true
        this.drawNumber++
        let activeIndex = 0
        for (let i = 0; i < this.prizeArr.length; i++) {
          let item = this.prizeArr[i]
          if (parseInt(item.id) === parseInt(id)) {
            activeIndex = i
            break
          } else {
            activeIndex = i
          }
        }
        this.pointerRotate = `rotate(${3600 * this.drawNumber + 60 * activeIndex}deg)`
      },
      end(){
        this.beginFlag = false
        this.$emit('end')
      },
      goPrizeIfo(item){
        if (item.id === -1) {
          return
        }
        this.$router.push({
          name: 'drawPrizeInfo',
          params: {
            drawId: this.$route.params.drawId,
            prizeId: item.id
          }
        })
      }
    }
  }
</script>
<style lang='scss' rel='stylesheet/scss' scoped>
  .six-draw {
    .box {
      margin: 0 20px;
      position: relative;
      .box-bg {
        width: 100%;
      }
      .prize-wrap {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        z-index: 9;
      }
      .prize-item {
        width: 50px;
        height: 50px;
        position: absolute;
        top: 10%;
        left: 50%;
        margin-left: -25px;
      }
      .prize-item:nth-child(1) {
        transform: rotateZ(0deg);
      }
      .prize-item:nth-child(2) {
        transform: rotateZ(60deg);
      }
      .prize-item:nth-child(3) {
        transform: rotateZ(120deg);
      }
      .prize-item:nth-child(4) {
        transform: rotateZ(180deg);
      }
      .prize-item:nth-child(5) {
        transform: rotateZ(240deg);
      }
      .prize-item:nth-child(6) {
        transform: rotateZ(300deg);
      }
      .pointer {
        position: absolute;
        width: 100%;
        top: 0;
        &.active {
          transition: all 3s ease-out;
        }
        .pointer-bg {
          width: 100%;
        }
      }
      .pointer-text {
        position: absolute;
        top: 50%;
        width: 21%;
        left: 50%;
        margin-top: -6%;
        margin-left: -11%;
        z-index: 10;
      }
    }
  }
</style>
