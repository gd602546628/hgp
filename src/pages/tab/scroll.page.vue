<template>
  <zyt-page :hasHeader="true" :hasFooter="true">
    <div slot="header">2</div>
    <div slot="main">
      <scroll :on-refresh="onRefresh" :on-infinite="onInfinite" :enableInfinite="hasMore">
        <div @click="gotoTest()" v-for="item,i of arr">
          <p>{{i}} test</p>
        </div>
      </scroll>
    </div>
    <div slot="footer">1</div>
  </zyt-page>
</template>
<script>
  import scroll from '@/components/scroll'
  export default {
    components: {
      scroll
    },
    data () {
      return {
        time: new Date(),
        arr: new Array(50),
        hasMore: true
      }
    },
    methods: {
      gotoTest(){
        this.$router.push({
          name: 'test1'
        })
      },

      onRefresh (done) {
        let self = this
        setTimeout(() => {
          self.time = new Date()
          this.arr = new Array(50)
          this.hasMore = true
          done()  // call done
        }, 2000)
      },
      onInfinite (done) {
        console.log('123123123123')
        setTimeout(() => {
          this.arr.push(...new Array(10))
          if (this.arr.length > 60) {
            this.hasMore = false
          }
          done()  // call done()
        }, 2000)
      }
    },
    created(){
    }
  }
</script>

<style lang='scss' rel='stylesheet/scss' scoped>
  .demo {
    margin-top: 20px;
  }
</style>
