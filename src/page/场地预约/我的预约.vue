<template>
  <div class="warp page1">
    <v-header :goBack="true" headTitle="我的预约" :serviceGet="true">
      <i v-if="$route.query.noHistory" slot="tit-right" class="iconfont icon-home g-backindex-icon" @click.stop="$router.push('/index')"></i>
    </v-header>
    <div class="g-reservationnav flex-box">
      <p v-for="(item,key) in ressernav" :key="key" @click="changstate(key)" :class="{'s-current':navstate == key}">
        {{item}}</p>
    </div>
    <v-scroll ref="my_scroller" class="service-main-box7 scroll" :on-refresh="refresh" :on-infinite="infinite">
      <div class="g-nodata g-nodata1" v-if="isLoading">
        <div class="noarticle g-adaptimg g-loading-icon"><img class="i-magnifier"
                                                              src="http://park.hzqisheng.cn/v3.5/i-loading-magnifier.png"
                                                              alt=""></div>
        <p class="nodatatext g-loading">正在加载</p>
      </div>
      <div v-else>
        <div class="g-reservation" v-for="item in appointmentRecordList" @click="$router.push('/appointmentRecord?appId='+item.id+'&type=0')">
          <div class="g-roomname">
            <i class="iconfont icon-naozhong"></i>
            <span>{{item.fieldName}}</span>
          </div>
          <div class="flex-box g-roomdetails">
            <img class="g-roomimg" :src="getImage(item.fieldImg)" alt="封面">
            <div class="g-roomdesc">
              <div class="flex-box g-yuyuestate">
                <h4 class="ellipsis">{{item.address}}</h4>
                <span v-if="item.appState==2||item.appState==4" class="s-success">预约成功</span>
                <span v-else-if="item.appState==1">审核中...</span>
                <span v-else-if="item.appState==7">已使用</span>
                <span v-else-if="item.appState==8">已结束</span>
                <span v-else-if="item.appState==5" class="s-fail">已取消</span>
                <span v-else-if="item.appState==3" class="s-danger">预约失败</span>
              </div>
              <p class="ellipsis g-capacity">可容纳{{item.capacity}}人</p>
              <div class="g-yuyuetime">
                预约时间：{{new Date(item.currentDate).format('yyyy/MM/dd')}}
                <ul class="option-list">
                  <li v-for="(hour,index) in item.appHourIntervalVOList" :key="'hour'+index">
                    <span>{{hour.appStartTime}} — {{hour.appEndTime}}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <p class="g-heji">合计：<span>￥{{item.appTotalPrice}}</span></p>
        </div>
      </div>
      <div class="g-field-empty" v-if="isEmpty">
        <img src="http://park.hzqisheng.cn/v3.5/i-field-nothing.png" alt="">
        <div class="g-nothing-world">暂无预约</div>
      </div>
    </v-scroll>
    <v-ordertab></v-ordertab>
  </div>
</template>
<script>
  import * as getData from '../../service/getData'
  import * as mobile from '../../config/mUtils'
  import {mapState, mapMutations, mapActions} from 'vuex'

  export default {
    data () {
      return {
        ressernav: ['全部预约', '审核中', '预约成功'],
        navstate: 0,
        pageIndex: 1,
        totalPage: 1,
        appointmentRecordList: [],
        checkState: '',
        isEmpty: false,
        isLoading: true,
        orderTimeList:'',
      }
    },
    created () {
    },
    components: {},
    mounted () {
      if (this.$route.query.noHistory) {
        history.pushState(null, null, document.URL);
        window.addEventListener('popstate', function () {
          history.pushState(null, null, document.URL);
        });
      }
    },
    computed: {},
    methods: {
      changstate (key) {
        this.isEmpty = false
        if (this.navstate == key) {
          return
        }
        this.navstate = key
        if (key == 0) {
          this.checkState = ''
        } else {
          this.checkState = key
        }
        this.appointmentRecordList = []
        this.pageIndex = 1
        this.totalPage = 1
        this.$refs.my_scroller.reload()
      },
      getImage (val) {
        if (val != null && val != '') {
          return val.split(',')[0]
        } else {
          return null
        }
      },
      refresh (done) {
        getData.appointmentList(1, this.checkState).then(res => {
          this.isLoading = false
          if (res.data.code !== 1) {
            done('error')
            return
          }
          this.appointmentRecordList = res.data.data.list
          this.isEmpty = this.appointmentRecordList.length === 0
          this.totalPage = res.data.data.total
          this.pageIndex = 2
          done()
        }).catch(error => {
          this.isLoading = false
          done('error')
        })
      },
      infinite (done) {
        if (this.pageIndex > this.totalPage) {
          done('end')
          return
        }
        getData.appointmentList(this.pageIndex, this.checkState).then(res => {
          this.isLoading = false
          if (res.data.code !== 1) {
            done('error')
            return
          }
          this.appointmentRecordList = this.appointmentRecordList.concat(res.data.data.list)
          this.isEmpty = this.appointmentRecordList.length === 0
          this.totalPage = res.data.data.Pages
          this.pageIndex++
          if (this.pageIndex > this.totalPage) {
            done('end')
          } else {
            done()
          }
        }).catch(error => {
          this.isLoading = false
          done('error')
        })
      }
    },
    watch: {}

  }

</script>
<style scoped lang="scss">
  @import '../../assets/css/mixin';

  .g-reservationnav {
    @include wh(100%, .9rem);
    box-sizing: border-box;
    border-bottom: 1px solid #e9e9e9;
    justify-content: space-around;

    p {
      position: relative;
      padding: 0 .16rem;
      height: .9rem;
      line-height: .78rem;
      @include sc(.3rem, #4d4c4c);
    }

    .s-current {
      color: #4a89dc;

      &:before {
        position: absolute;
        content: '';
        background-color: #4a89dc;
        height: .04rem;
        width: 1.6rem;
        bottom: 0;
        left: 50%;
        margin-left: -.8rem;
      }

    }
  }

  .g-reservation {
    border-width: .27rem 0 0;
    border-color: #F4F4F4;
    border-style: solid;

    &:last-child {
      box-shadow: 0 .2rem 0.5rem RGBA(214, 214, 214, 0.3);
    }

    .g-roomname {
      padding-left: .2rem;
      line-height: .7rem;

      i {
        @include sc(.32rem, #4a89dc);
        margin: 0 .1rem 0 .05rem;
      }

      span {
        @include sc(.28rem, #4d4c4c);
        font-weight: 700;
      }
    }

    .g-roomdetails {
      padding: 0 .22rem .22rem;
      align-items: center;

      .g-roomimg {
        flex: none;
        margin-top: .22rem;
        @include wh(2.17rem, 1.58rem);
        object-fit: cover;
        margin-right: .26rem;
        display: block;
      }

      .g-roomdesc {
        width: 100%;
      }
    }
  }

  .g-yuyuestate {
    margin-bottom: .25rem;

    h4 {
      @include sc(.28rem, #4D4C4C);
      font-weight: 700;
      flex: 1;
      padding-right: .2rem;
    }

    span {
      display: block;
      @include wh(1.3rem, .46rem);
      background-color: #3C78E5;
      @include sc(.24rem, #fff);
      text-align: center;
      line-height: .46rem;
      border-radius: .24rem;
    }

    .s-success {
      background-color: #04AA00;

    }

    .s-danger {
      background-color: #FF4E4E;
    }

    .s-fail {
      background-color: #c6c6c6;
    }
  }

  .g-capacity {
    @include sc(.24rem, #727171);
    line-height: .26rem;
    margin-bottom: .22rem;
  }

  .g-yuyuetime {
    line-height: .26rem;
    @include sc(.24rem, #727171);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .g-heji {
    border-top: .02rem solid #EFEFF4;
    text-align: right;
    line-height: .7rem;
    @include sc(.26rem, #727171);
    padding-right: .22rem;

    span {
      color: #4a89dc;
      font-size: .3rem;

      i {
        color: #4a89dc;
        font-size: .22rem;
      }
    }
  }

  .g-btnnav {
    @include wh(100%, 1rem);
    justify-content: space-between;

    p {
      background-color: #4a89dc;
      text-align: center;
      line-height: 1rem;
      @include sc(.3rem, #fff);
      flex: 1;
    }

    .s-on {
      position: relative;
      background-color: #8ab7f3;

      &:after {
        position: absolute;
        content: '';
        top: 0;
        left: 50%;
        margin-left: -.09rem;
        width: 0;
        height: 0;
        border-left: .17rem solid transparent;
        border-right: .17rem solid transparent;
        border-top: .17rem solid #fff;
      }
    }
  }
</style>

