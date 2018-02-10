<template>
  <div class="twelve-draw">
    <div>
      <div class="box">
        <img src="../../assets/img/draw/12_bg.png" class="bg"/>
        <img src="../../assets/img/draw/go_button.png" class="pointer" @click.stop="pointerClick()"/>
        <div class="prize-wrap">
          <div class="prize-container" v-for="(prize,index) in prizeArr">
            <div class="prize-item" v-for="item in prize">
              <div class="prize-item-bg" :class="{active:item.indexFlag==indexFlag}">
                <img :src="imgPrefix(item)" @click.stop="goPrizeIfo(item)"/>
                <!-- <div>{{item.indexFlag}}</div>-->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Util from '@/service/common/utils/util.service'
  import thankImg from '../../assets/img/draw/xxcy.png'
  import {Config} from '@/config/config'
  export default{
    props: {
      prizeList: {
        type: Array,
        required: true
      }
    },
    data(){
      return {
        indexFlag: 1,
        beginFlag: false
      }
    },
    computed: {
      prizeArr(){
        let item = {
          prizeImg: thankImg,
          id: -1
        }
        // 填充数组
        let filledArr = Util.fillArr(this.prizeList, 12, item)
        let result = []
        for (let i = 0; i < filledArr.length; i += 4) {
          result.push(filledArr.slice(i, i + 4))
        }
        let num = 0
        // 给每个元素添加一个indexFlag用以标记
        result.forEach((out) => {
          out.forEach(item => {
            num++
            item.indexFlag = num
          })
        })
        return result
      }
    },
    created(){
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
        let num = 1
        let index = 1
        let indexMap = [1, 2, 3, 4, 6, 8, 12, 11, 10, 9, 7, 5] // 让indexFlag按照此数组排列变化
        let endIndex = 0
        // 查找中奖奖品的indexFlag
        this.prizeArr.forEach(out => {
          out.forEach(item => {
            if (parseInt(item.id) === parseInt(id)) {
              endIndex = indexMap.indexOf(item.indexFlag)
            }
          })
        })
        // 控制旋转圈数，5为5圈
        endIndex = endIndex + (5 * 12)
        let timer = setInterval(() => {
          this.beginFlag = true
          this.indexFlag = indexMap[index]
          index++
          num++
          if (index === 12) {
            index = 0
          }
          if (num === (endIndex + 1)) {
            clearInterval(timer)
            this.beginFlag = false
            this.$emit('end')
          }
        }, 100)
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
  .twelve-draw {
    .box {
      margin: 0 20px;
      position: relative;
      .bg {
        width: 100%;
      }
      .pointer {
        width: 43%;
        height: 40%;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -21.5%;
        margin-top: -21%;
        z-index: 10;
        display: block;
      }
      .prize-wrap {
        width: 86%;
        height: 86%;
        position: absolute;
        top: 6.5%;
        left: 7%;
        display: -webkit-flex;
        -webkit-align-items: center;
        -webkit-justify-content: flex-start;
        -webkit-flex-direction: column;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        flex-direction: column;
        .prize-container {
          flex: 1;
          display: -webkit-flex;
          /*   -webkit-align-items: center;
             -webkit-justify-content: center;*/
          display: flex;
          /*  align-items: center;
            justify-content: center;*/
          width: 100%;
          .prize-item {
            flex: 1;
            height: 100%;
            padding: 2px;
            width: 25%;
            .prize-item-bg {
              overflow: hidden;
              width: 100%;
              height: 100%;
              border-radius: 4px;
              background: orange;
              img {
                transition: all 0.1s ease;
                width: 100%;
                height: 100%;
              }
              &.active {
                background: yellow;
                img {
                  transform: rotateZ(40deg);
                }
              }
            }
          }
          &:nth-child(2) {
            flex: 2;
            position: relative;
            .prize-item {
              position: absolute;
              height: 50%;
              width: 25%;
              &:nth-child(1) {
                top: 0;
                left: 0;
              }
              &:nth-child(2) {
                right: 0;
                top: 0;
              }
              &:nth-child(3) {
                left: 0;
                bottom: 0;
              }
              &:nth-child(4) {
                right: 0;
                bottom: 0;
              }
            }
          }
        }
      }
    }
  }
</style>
