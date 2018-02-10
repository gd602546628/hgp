<template>
  <div class="wrap" ref="box">
    <div class="back" v-if="show">{{prize}}
    </div>
    <canvas class="front" ref="wrap"
            @touchstart="down"
            @touchmove="move"
            @touchend="up"
            v-if="show"
    ></canvas>
    <div class="begin" v-show="!show">
      <!-- <img src="../../assets/img/scratchCard/kagj.png">-->
      <div class="begin-wrap">
        <div class="tittle">好奖刮出来</div>
        <button class="btn" @click="btnClick">开始刮奖</button>
      </div>
    </div>
  </div>
</template>
<script>
  export default{
    props: ['prizeName', 'btnClick', 'noWinText'],
    computed: {
      prize(){
        if (this.prizeName) {
          return `恭喜您中了${this.prizeName}`
        } else {
          return this.noWinText
        }
      }
    },
    data(){
      return {
        isMouseDown: false,
        show: false
      }
    },
    methods: {
      init(){
        let ctx = this.$refs.wrap.getContext('2d')
        ctx.globalCompositeOperation = 'source-over'
        ctx.fillStyle = 'gray'
        ctx.fillRect(0, 0, 300, 160)
        ctx.fill()
        ctx.font = 'Bold 30px Arial'
        ctx.textAlign = 'center'
        ctx.fillStyle = 'white'
        ctx.fillText('刮奖区', 140, 80)
        ctx.globalCompositeOperation = 'destination-out'
      },
      down(e){
        e.preventDefault()
        this.isMouseDown = true
      },
      up(e){
        e.preventDefault()
        let c1 = this.$refs.wrap
        let ctx = c1.getContext('2d')
        let a = ctx.getImageData(0, 0, c1.width, c1.height)
        let j = 0
        for (var i = 3; i < a.data.length; i += 4) {
          if (a.data[i] === 0) j++
        }
        if (j >= a.data.length / 16) {
          this.$emit('done')
          this.show = false
        }
        this.isMouseDown = false
      },
      move(e){
        e.preventDefault()
        let box = this.$refs.box
        let c1 = this.$refs.wrap
        let ctx = c1.getContext('2d')
        if (this.isMouseDown) {
          if (e.changedTouches) {
            e = e.changedTouches[e.changedTouches.length - 1]
          }
          // let main = this.$router.app.$el.querySelector('._main')
          // let offsetTop = main ? (box.offsetTop - main.scrollTop + main.offsetTop) : c1.offsetTop
          let main = this.$router.app.$el.querySelector('._main')
          let scroll = this.$router.app.$el.querySelector('._scroll')
          // offsetTop 为cavans距离屏幕上方距离
          let offsetTop = main ? (box.offsetTop - scroll.scrollTop + main.offsetTop) : c1.offsetTop
          let offsetLeft = box.offsetLeft
          let x = e.clientX - offsetLeft
          let y = e.clientY - offsetTop
          ctx.beginPath()
          /* 圆心坐标是以Cavans左上角为基准的  这里的y则为  手指Y坐标-cavans距离屏幕上方距离 */
          ctx.arc(x, y, 10, 0, Math.PI * 2, true)
          /*  c1.style.display = 'none'
           c1.offsetHeight
           c1.style.display = 'inherit' */
          ctx.fill()
        }
      },
      begin(){
        this.show = true
        this.$nextTick(() => {
          this.init()
        })
      }
    }
  }
</script>
<style lang='scss' rel='stylesheet/scss' scoped>
  .wrap {
    width: 300px;
    height: 160px;
    position: relative;
    margin: 0 auto;

  .back {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ff6804;
    font-size: 16px;
    background: url("../../assets/img/scratchCard/h_bg.png") no-repeat center;
  }

  .front, .begin {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
  }

  .begin {
    background: url("../../assets/img/scratchCard/h_bg.png") no-repeat center;
    background-size: cover;
    display: flex;
    align-items: center;
    justify-content: center;

  .begin-wrap {

  .tittle {
    color: #fff;
    text-shadow: 0px 1.5px 0px #f31434;
    font-size: 20px;
    line-height: 24px;
    margin-top: 30px;
    margin-bottom: 10px;
    font-weight: bold;
    letter-spacing: 3px;
    text-align: center;
    text-indent: 10px;
  }

  .btn {
    letter-spacing: 3px;
    border: none;
    outline: none;
    width: 130px;
    height: 40px;
    box-shadow: 0px 7px 5px #ff6804;
    border-radius: 6px;
    background: #fff;
    color: #ff6804;
    font-size: 16px;
    margin-top: 10px;
    cursor: pointer;
    font-weight: bold;
  }

  }
  }
  }
</style>
