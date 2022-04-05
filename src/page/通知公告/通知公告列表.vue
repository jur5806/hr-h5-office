<template>
  <div class="warp page1">
    <v-header :goBack="true" headTitle="通知公告">
    </v-header>
    <v-scroll class="main-box scroll" ref="my_scroller" :on-refresh="refresh" :isAddClass="true" :on-infinite="infinite">
      <ul class="g-notice-list">
        <li class="g-info-box j-addClass" v-for="(item,index) in partList" :key="item.noticeId" @click="$router.push({path:'/noticeDetail',query:{parkNoticeId:item.noticeId}})">
          <div class="g-info-title">
            <span class="label-top" v-if="item.noticeIsTop">置顶</span>
            <div class="g-title-content" style="flex: 1">{{item.noticeTitle}}</div>
          </div>
          <div class="g-info-base">
            <div class="g-info-time">
              <img src="./../../assets/images/clock.svg" alt="">
              {{new Date(item.noticeCreateTime).format('yyyy年MM月dd日')}}
            </div>
            <div class="g-info-look">
              <img src="./../../assets/images/eye.svg" alt="">
              {{item.lookNumber}}
            </div>
          </div>
        </li>
      </ul>
      <div class="g-tishi" v-if="isEmpty"></div>
    </v-scroll>
  </div>
</template>

<script>
  import * as getData from '../../service/getData'
  import * as mobile from '../../config/mUtils'
  export default {
    data () {
      return {
        pageIndex: 1,
        totalPage: 1,
        pageSize: 10,
        partList: [],
        isEmpty: false,
      }
    },
    methods: {
      refresh (done) {
        getData.getparkNoticeList(1,this.pageSize).then(res => {
          if (res.data.code !== 1) {
            mobile.toast(res.data.message);
            return
          }
          this.partList = res.data.data.partList;
          if (this.partList.length === 0) {
            this.isEmpty = true;
          }
          this.totalPage = res.data.data.pages;
          this.pageIndex = 2;
          done()
        })
      },
      infinite (done) {
        getData.getparkNoticeList(this.pageIndex,this.pageSize).then(res => {
          if (res.data.code !== 1) {
            mobile.toast(res.data.message);
            done('error');
            return
          }
          this.partList = this.partList.concat(res.data.data.partList);
          if (this.partList.length === 0) {
            this.isEmpty = true;
          }
          this.totalPage = res.data.data.pages;
          this.pageIndex++;
          if (this.pageIndex > this.totalPage) {
            done('end')
          } else {
            done()
          }
        }).catch(error => {
          console.log(error);
          done('error')
        })
      },
    }
  }
</script>

<style scoped lang="scss">
  @import '../../assets/css/mixin.scss';
  .g-tishi{
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: #fff;
    &::before{
      content: '';
      background: url("http://park.hzqisheng.cn/v3.5/none-notice.png") no-repeat;
      background-size: contain;
      display: block;
      @include wh(3.53rem,2.27rem);
      margin: 3.93rem auto 0;
    }
    &::after{
      content: '暂时还没有通知公告哦~';
      display: block;
      margin: .4rem auto 0;
      text-align: center;
      @include sc(.26rem,#BFBFBF);
    }
  }
  .g-info-box{
    .g-info-title{
      margin-bottom: 0;
      align-items: center;
    }
  }
  .g-info-base{
    display: flex;
    flex-direction: row;
    margin-top: 4px;
    img{
      width: 14px;
      margin: 0;
      margin-right: 4px;
    }
    .g-info-time{
      color: #cdcdcd;
      display: flex;
      width: 155px;
    }
    .g-info-look{
      display: flex;
      color: #cdcdcd;
    }
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
