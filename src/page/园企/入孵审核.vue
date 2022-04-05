<template>
  <div class="warp page1">
    <v-header :goBack="true" headTitle="入孵审核"></v-header>
    <div class="g-conts">
      <ul class="g-navsbox flex-box">
        <li :class="type === 1 ? 'active' : ''" @click="changeType(1)">待我审批</li>
        <li :class="type === 2 ? 'active' : ''" @click="changeType(2)">我已审批</li>
      </ul>
      <v-scroll class="scroll main-body" ref="my_scroller" :on-refresh="refresh" :on-infinite="infinite">
        <ul class="g-record-list" v-if="type === 1">
          <li class="g-record-list-item" v-for="(item, index) in tableList" :key="index" @click="$router.push('/incubateApply?applicationId=' + item.applicationId+'&approvalProcessId='+item.approvalProcessId+'&audit='+item.audit+'&processCurrStep='+item.processCurrStep)">
            <div class="g-item">
              <div class="g-item-img">
                <img src="../../assets/images/defaut.png" alt="">
              </div>
              <div class="g-item-content">
                <div class="flex-box g-topheader">
                  <h4>{{item.companyName}}</h4>
                  <p class="g-blue">{{item.hatchType == 1? '新注册' : '迁址'}}</p>
                </div>
                <ul class="g-list">
                  <li class="g-list-item"><p class="item-label">发起人：</p><span>{{item.createName}}</span></li>
                  <li class="g-list-item"><p class="item-label">发起时间：</p><span v-if="item.startTime">{{new Date(item.startTime).format('yyyy-MM-dd')}}</span><span v-else>-</span></li>
                </ul>
              </div>
            </div>
          </li>
        </ul>
        <ul class="g-record-list g-work-list" v-else>
          <li class="g-record-list-item" v-for="(item, index) in tableList" :key="index" @click="$router.push('/incubateApply?applicationId=' + item.applicationId)">
            <div class="g-item">
              <div class="g-item-img">
                <img src="../../assets/images/defaut.png" alt="">
              </div>
              <div class="g-item-content">
                <div class="flex-box g-topheader">
                  <h4>{{item.companyName}}</h4>
                  <p class="g-blue">{{item.hatchType == 1? '新注册' : '迁址'}}</p>
                </div>
                <ul class="g-list">
                  <li class="g-list-item"><p class="item-label">发起人：</p><span>{{item.createName}}</span></li>
                  <li class="g-list-item"><p class="item-label">发起时间：</p><span v-if="item.startTime">{{new Date(item.startTime).format('yyyy-MM-dd')}}</span><span v-else>-</span></li>
                </ul>
              </div>
            </div>
          </li>
        </ul>
        <div class="g-nodatabox" v-if="tableList.length == 0">
          <div class="g-nodatabox-cont">
            <img src="../../assets/images/quesheng.png" alt="">
            <p>哎呀，这里什么都没有</p>
          </div>
        </div>
      </v-scroll>
    </div>
  </div>
</template>
<script>
  import * as getData from '../../service/getData'
  import * as mobile from '../../config/mUtils'
  import * as options from '../../config/options'
  import {mapState, mapMutations, mapActions} from 'vuex'

  export default {
    data () {
      return {
        tableList:[],
        checkId:'',
        type:1,
        pageIndex: 1,
        pageSize: 10,
        totalPage: 1,
      }
    },
    mounted() {
    },
    created() {
    },
    activated() {
    },
    components: {},
    computed: {},
    methods: {
      refresh (done) {
        getData.allList({type:this.type,pageIndex:1,pageSize:this.pageSize}).then(res => {
          if (res.data.code !== 1) {
            done('error')
            return
          }
          this.tableList = res.data.data.list
          this.totalPage = res.data.data.Pages
          this.pageIndex = 2
          done()
        }).catch(error => {
          done('error')
        })
      },
      infinite (done) {
        if (this.pageIndex > this.totalPage) {
          done('end')
          return
        }
        getData.allList({type:this.type,pageIndex:this.pageIndex,pageSize:this.pageSize}).then(res => {
          if (res.data.code !== 1) {
            done('error')
            return
          }
          this.tableList = this.tableList.concat(res.data.data.list)
          this.totalPage = res.data.data.Pages
          this.pageIndex++
          if (this.pageIndex > this.totalPage) {
            done('end')
          } else {
            done()
          }
        }).catch(error => {
          done('error')
        })
      },
      //时间转换
      timeFormat(time) {
        return mobile.toDateTime(time)
      },
      changeType (type) {
        this.type = type;
        this.pageIndex = 1;
        this.totalPage = 1;
        this.refresh(this.$refs.my_scroller.reload);
      },
    },
    watch: {}
  }
</script>
<style lang="scss">
</style>
<style scoped lang="scss">
  @import '../../assets/css/mixin';
  .page1{
    width: 100%;
    height: 100%;
    background: #EEF0F4;
    display: flex;
    flex-direction: column;
  }
  .g-conts{
    display: flex;
    flex-direction: column;
    flex:1;
    overflow: hidden;
    .g-navsbox{
      width: 100%;
      height: 1rem;
      justify-content: center;
      padding:0 0.3rem;
      background: #fff;
      li{
        width:2.66rem;
        text-align:center;
        font-size:.28rem;
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color: #1088FF;
        line-height: 0.6rem;
        border-radius: 0.08rem 0rem 0rem 0.08rem;
        border: 0.02rem solid #1088FF;
      }
      li:last-child{
        border-left: 0;
        border-radius: 0rem 0.08rem 0.08rem 0rem;
      }
      .active{
        font-family:PingFangSC-Medium,PingFang SC;
        font-weight:500;
        color:#fff;
        background: #1088FF;
      }
    }
  }
  .main-body{
    flex: 1;
    padding-top: 0.24rem;
    margin-bottom:0.2rem;
    display: flex;
    overflow: auto;
  }

  .g-record-list{
    padding: 0 .3rem;
    .g-record-list-item{
       width:100%;
       background:rgba(255,255,255,1);
       border-radius:.16rem;
       margin-bottom: .24rem;
       padding: .2rem;
     }
    .g-topheader{
      line-height: .44rem;
      h4{
        position: relative;
        font-size:0.32rem;
        font-weight:600;
        color:#292C2F;
        line-height:0.44rem;
        display: flex;
        margin-right: .2rem;
        span{
          font-size:0.32rem;
          font-weight:500;
          color:rgba(41,44,47,1);
        }
      }
      p{
        border-radius:0.03rem;
        padding:0 0.12rem;
        font-size:0.24rem;
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        line-height:0.34rem;
        min-width: 1rem;
      }
      .g-red{
        background:rgba(255,233,233,1);
        color:rgba(235,60,60,1);
      }
      .g-blue{
        background:rgba(214,239,255,1);
        color:rgba(31,141,247,1);
      }
      .g-orange{
        background:rgba(255,230,214,1);
        color:rgba(247,81,31,1);
      }
      .g-green{
        background:rgba(218,246,221,1);
        color:rgba(0,159,48,1);
      }
    }
    img{
      height: 3rem;
      width: 4.8rem;
    }
  }

  .g-item{
    display: flex;
    .g-item-img{
      height:1.52rem;
      width:1.52rem;
      margin-right:.24rem;
      img{
        width:100%;
        height:100%;
        object-fit: cover;
      }
    }
    .g-item-content{
      flex:1;
    }
  }

  .g-list{
    .g-list-item{
      margin-top:0.13rem;
      display: flex;
      .item-label{
        font-size: 0.28rem;
        flex-shrink: 0;
        color: #666;
        font-family: PingFangSC-Regular, PingFang SC;
      }
      span{
        font-size: 0.28rem;
        font-family: PingFangSC-Regular, PingFang SC;
      }
    }
  }
  .g-nodatabox{
    position: relative;
    z-index: 1;
    padding: 0 .2rem;
    .g-nodatabox-cont{
      width: 100%;
      height: 6rem;
      border-radius:.1rem;
      padding-top: 2.73rem;
      img{
        display: block;
        width: 4.4rem;
        height: 2.74rem;
        margin: 0 auto;
      }
      p{
        font-size:.26rem;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:#A1AEBE;
        // margin-top: .47rem;
        text-align: center;
      }
    }
  }

</style>


