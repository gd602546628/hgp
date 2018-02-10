<template lang="html">
  <zyt-page :on-refresh="onRefresh"
            :on-infinite="loadMore"
            :enableInfinite="!dataFinish"
            :enableRefresh="true">
    <div slot="main">
      <div class="comment-list-box" v-for="item in commentListData">
        <div class="comment-list-top-box">
          <p>{{item.userName}}</p>
          <zyt-star :bgSize="16" :star="parseInt(item.star)" :isStar="false" style="color: #ffa902;"></zyt-star>
        </div>
        <div class="comment-list-conent">{{item.content}}</div>
        <div class="upload-picture-box fb-legacy-flexbox" v-if="item.commentImg">
          <div class="upload-picture" v-if="item.commentImg" v-for="(it,index) in JSON.parse(item.commentImg)" @click.stop="openFile(JSON.parse(item.commentImg),index)">
             <img-component :img-src="Prefix + it" class="upload-picture-already"></img-component>
             <photoSwipe-component ref="photoSwiper" :aImg="it"  :index="index" ></photoSwipe-component>
          </div>
        </div>

        <div class="addpend-comment-list" v-if="item.appendContent">
          <span>追加评价</span>
          <span class="addpend-comment-content">{{item.appendContent}}</span>
          <div class="upload-picture-box" v-if="item.appendCommentImg">
          <div class="upload-picture" v-if="item.appendCommentImg" v-for="(it,index) in JSON.parse(item.appendCommentImg)" @click.stop="openFile(it,index)">
             <img-component :img-src="Prefix + it" class="upload-picture-already"></img-component>
             <photoSwipe-component ref="photoSwiper" :aImg="it"  :index="index" ></photoSwipe-component>
          </div>
        </div>
        </div>
        <div class="comment-more-list-norm">
          <span class="comment-more-time">{{commentTime(item.createTime)}}</span>
          <div v-if="item.fpName && item.fpValue">
            <span>{{item.fpName}}</span>:
            <span>{{item.fpValue}}</span>
          </div>
          <div v-if="item.spName && item.spValue">
            <span>{{item.spName}}</span>:
            <span>{{item.spValue}}</span>
          </div>
        </div>
        <div class="comment-content-list-box" v-for="it in item.replyList" :key="it" v-if="item.replyList">
          <div class="comment-content-box">{{it}}</div>
        </div>
        <div class="comment-content-reply" @click="replay(item)"><i class="icon-zyt-messages"></i>回复</div>
      </div>
      </div>
  </zyt-page>
</template>
<script>
  import star from '@/components/score/star.component'
  import PhotoSwipeComponent from '@/components/photoSwipe/photoSwipe.component'
  import ImgComponent from '@/components/common/img/img.component'
  import PhotoSwiperService from '@/service/photo-swiper/photo-swiper.service.js'
  import {Config} from '@/config/config'
  import getCommentList from '@/api/comment/commentList.api.js'
  export default{
    name: 'commentList',
    data() {
      return {
        ListParams: {
          pageNum: 1,
          pageSize: 10
        },
        params: {
          doorId: this.$route.params.doorId,
          prdId: this.$route.params.prdId
        },
        dataFinish: false,
        pageFlag: false,
        commentListData: [],
        commentImg: [],
        Prefix: Config.commentImgUrl // 图片前缀
      }
    },
    components: {
      'zyt-star': star,
      'img-component': ImgComponent,
      'photoSwipe-component': PhotoSwipeComponent
    },
    methods: {
      getCommentList () {
        let params = {
          doorId: this.$route.params.doorId,
          prdId: this.$route.params.prdId
        }
        getCommentList.getCommentList(params).then(data => {
          console.log(data)
          if (data.list) {
            this.commentListData = data.list
          }
          if (data.page.pageNum < data.page.totalPage) {
            this.dataFinish = false
            this.pageFlag = false
          } else {
            this.dataFinish = true
            this.pageFlag = true
          }
        })
      },
      commentTime(time){
        let comment = new Date(time.replace(/-/g, '/')).getTime()
        let commentTime = `${new Date(comment).getFullYear()}-${new Date(comment).getMonth() + 1}-${new Date(comment).getDate()}`
        return commentTime
      },
      openFile(imgs, index){
        let imgUrl = []
        imgs.forEach(item => {
          imgUrl.push(this.Prefix + item)
        })
        PhotoSwiperService.show(imgUrl, index)
      },
      replay(item){ /* 跳转回复评论页 */
        this.$router.push({
          name: 'replayComment',
          params: {
            doorId: this.$route.params.doorId,
            commentId: item.commentId
          }
        })
      },
      onRefresh(done){ // 下拉刷新
        done()
        this.getCommentList()
      },
      async loadMore (done) { // 上拉加载
        if (this.dataFinish) {
          done && done(true)
          return
        }
        this.ListParams.pageNum++
        await this.getCommentList(false)
        done && done()
      },
      async init(){
        this.ListParams.pageNum = 1
        this.pageFlag = false
        this.getCommentList()
      }
    },
    watch: {
      prdId: 'getCommentList'
    },
    created () {
      this.init()
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  @import '../../assets/css/variables-primary.scss';

  .comment-list-box {
    display: -webkit-flex;
    -webkit-flex-direction: column;
    display: flex;
    flex-direction: column;
    padding: 10px;
    border-bottom: 1px solid #f4f4f4;
    width: 100%;
    .comment-list-top-box {
      display: -webkit-flex;
      -webkit-justify-content: space-between;
      -webkit-align-items: center;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      p {
        font-size: 13px;
        margin-right: 5px;
      }
    }
    .comment-list-conent {
      margin-bottom: 10px;
      font-size: 14px;
    }
    .upload-picture-box{
    -webkit-justify-content: flex-start;
    -webkit-flex-wrap: wrap ;
    -webkit-align-items:flex-start;
    justify-content: flex-start;
    align-items: flex-start;
    flex-wrap: wrap;
    display: flex;
    display: -webkit-flex;
    margin-bottom: 10px;
    width: 100%;
    height: auto;
      .upload-picture {
        margin: 5px;
        height: 100%;
        width: 30%;
        border-radius: 3px;
        -webkit-flex-wrap: wrap;
        /*display: -webkit-flex;
        -webkit-justify-content: center;
        -webkit-align-items: center;
        display: flex;
        justify-content: center;
        align-items: center;*/
        color: #9e9e9e;
        .upload-picture-already {
          height: 100%;
          width: 100%;
        }
      }
  }
    .addpend-comment-list {
      display: -webkit-flex;
      -webkit-flex-direction: column;
      -webkit-justify-content: flex-start;
      -webkit-align-items: flex-start;
      align-items: flex-start;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      span:first-child {
        font-size: 14px;
        padding-bottom: 5px;
        color: map_get($ComColors, scarlet);
        display: block;
      }
      .addpend-comment-content{
        margin-top: 5px;
      }
    }
    .comment-more-list-norm {
      display: -webkit-flex;
      -webkit-justify-content: flex-start;
      justify-content: flex-start;
      -webkit-align-items: center;
      align-items: center;
      font-size: 12px;
      color: #9e9e9e;
      .comment-more-time {
        margin-right: 5px;
      }
    }
    .comment-content-list-box {
      margin: 5px 0;
      .comment-content-box {
        padding: 5px;
        background-color: #f0f2f5;
        box-shadow: 0 1px 3px rgba(0, 0, 0, .3);
        /*margin: 5px 0px;*/
      }
    }
    .comment-content-reply {
      padding: 5px 5px;
      border: 1px solid #066cc2;
      width: 80px;
      border-radius: 5px;
      color: #066cc2;
      display: -webkit-flex;
      -webkit-justify-content: center;
      -webkit-align-items: center;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 10px;
      margin-top: 10px;
      i {
        font-size: 20px;
        margin-right: 5px;
      }
    }
  }
</style>
