<template>
  <div class="warp page1">
    <v-header :goBack="true" headTitle="公告详情">
    </v-header>
    <div class="alpay" @click="showShare = false" v-if="showShare"><img src="http://park.hzqisheng.cn/v3.5/share.png"/></div>
    <v-scroll class="main-box scroll" ref="my_scroller" style="background: #EEEEEE;padding: 10px">
      <div style="background: #fff;border-radius: 5px;">
        <div class="g-notice-title"><span class="label-top" v-if="notice.noticeIsTop">置顶</span>{{notice.noticeTitle}}</div>
        <div class="g-notice-author">
          <i style="font-size: 10px;color:#cdcdcd" class="iconfont icon-ren1"></i>
          <span>{{notice.noticeAdminName}}</span>
          <img style="width: 14px; color:#cdcdcd;position: relative; top: 2px" src="./../../assets/images/clock.svg" alt="">
          <span>{{new Date(notice.noticeCreateTime).format('yyyy年MM月dd日')}}</span>
          <img style="width: 14px; color:#cdcdcd;position: relative; top: 2px" src="./../../assets/images/eye.svg" alt="">
          <span>{{notice.lookNumber}}</span>
        </div>
        <div class="g-notice-content g-html-img" v-html="notice.noticeContent" @click="previewImage"></div>
      </div>
      <div style="background: #fff;border-radius: 5px;margin: .2rem 0" v-if="notice.nfAddressList&&notice.nfAddressList.length!==0">
        <div class="look-orders-title">附件信息：</div>
        <div class="look-file" v-for="(item,index) in notice.nfAddressList" :key="index" @click="downLoad(item.nfAddress)">{{item.nfName}}</div>
      </div>
      <div style="background: #fff;border-radius: 5px;margin: .2rem 0">
        <div class="look-orders-title">浏览记录 <span class="color-grey">已有<span class="color-blue">{{notice.lookNumber}}</span>人浏览了该通知</span></div>
        <div class="look-box">
          <div class="look-people" v-for="(item,index) in lookList" :key="index">{{item.npUserName}}</div>
        </div>
        <div class="look-more" v-if="!noMore" @click="getLookPeople()">查看更多</div>
        <div class="look-more-no" v-else>没有更多了</div>
      </div>
    </v-scroll>
  </div>
</template>

<script>
  import * as getData from '../../service/getData'
  import * as mobile from '../../config/mUtils'
  import wx from 'weixin-js-sdk'
  export default {
    data () {
      return {
        notice: {},
        showShare: false,
        lookList: [],
        noMore: false,
        filters: {
          pageSize: 10,
          pageIndex: 0,
          id: ''
        }
      }
    },
    mounted () {
      this.filters.id = this.$route.query.parkNoticeId
      let phone = ''
      if (this.$route.query.phone) {
        phone = this.$route.query.phone
      }
      getData.getParkNoticeDetail(this.$route.query.parkNoticeId, phone).then(res => {
        if (res.data.code !== 1) {
          mobile.toast(res.data.message);
          return
        }
        this.notice = res.data.data;

        if (this.$store.state.platform === 'iOS' || this.$store.state.platform === 'Android') {  //移动端分享功能
          let title = this.notice.noticeTitle
          let content = this.notice.noticeContent
          let imageUrl = ""
          let url = window.location.href
          if (this.$store.state.platform === 'iOS') {
            window.webkit.messageHandlers.ShareCode.postMessage({title: title, content: content, imageUrl: imageUrl, url: url});
          } else {
            window.test.ShareCode(title, content, imageUrl, url);
          }
        }
      })
      this.getLookPeople()
    },
    methods: {
      getLookPeople() {
        this.filters.pageIndex++
        getData.getNoticeLook(this.filters).then(res => {
          if(res.data.code === 1){
            res.data.data.list.forEach(item=>{
              this.lookList.push(item)
            })
            if(res.data.data.pages<=this.filters.pageIndex){
              this.noMore = true
            }
          }else{
             mobile.toast(res.data.message);
          }
        })
      },
      share (type) {/*分享*/
        // if (type === 2) {
        //   this.showShare = true;
        // }
        this.showShare = true
        let tilte = this.notice.noticeTitle
        let content = this.notice.noticeContent
        let shareCont = {
          title: tilte,
          shareContent: content,
          url: window.location.href.indexOf('shareNum') === -1 ? window.location.href + '&shareNum=1' : window.location.href,
        };
        mobile.wxshare(wx, shareCont)
      },
      downLoad(url, name) {
        if (
          mobile.fileUrl(url) === "excel" ||
          mobile.fileUrl(url) === "word"  ||
          mobile.fileUrl(url) === "ppt"
        ) {
          if(this.$store.state.platform){
            window.location.href = url
          }else{
            window.open("https://wps-view.zhihuipk.com/?src=" + url);
          }
        } else {
          window.location.href = url
        }
      },
    }
  }
</script>

<style scoped lang="scss">
  @import '../../assets/css/mixin.scss';
  .g-notice-title{
    margin: .32rem auto;
    margin-top: 0;
    padding-top: 0.32rem;
    width: 5rem;
    @include sc(.34rem,#333333);
    line-height: .57rem;
    text-align: center;
    font-weight: 700;
  }
  .g-notice-author{
    text-align: center;
    span{
      display: inline-block;
      @include sc(.2rem,#6C6C6C);
      margin-right: 10px;
    }
  }
  .g-notice-content{
    padding: .3rem;
    margin-bottom: 0;
  }
  .look-orders-title{
    padding: 0.3rem;
    font-size: 16px;
    font-weight: bold;
    color: #333333;
    line-height: 22px;
    .color-grey{
      font-size: 12px;
      font-weight: 500;
      color: #999999;
      line-height: 22px;
    }
    .color-blue{
      font-size: 12px;
      font-weight: 500;
      color: #3F7DEF;
      line-height: 22px;
    }
  }
  .look-box{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    padding: 0 0.2rem;
    .look-people{
      padding: .1rem .26rem;
      border-radius: 18px;
      background: #EEF5FF;
      color: #3F7DEF;
      margin: 0 .1rem;
      margin-bottom: .16rem;
    }
  }
  .look-more{
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
    padding: .1rem 0;
    color: #3F7DEF;
  }
  .look-more-no{
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
    padding: .1rem 0;
    color: #696969;
  }
  .look-file{
    line-height: 28px;
    text-decoration: underline;
    color: rgb(16, 88, 221);
    cursor: pointer;
    padding-left: .3rem;
  }
  .label-top{
    padding: 0px 10px;
    line-height: 19px;
    height: 20px;
    border: 1px solid #33a7ee;
    color: #33a7ee;
    margin-left: 4px;
    margin-right: 2px;
  }
</style>
