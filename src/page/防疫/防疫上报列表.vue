<template>
  <div class="warp page1 g-page-grey">
    <v-header :goBackFork="true" headTitle="防疫上报">
    </v-header>
      <!-- <div class="g-bg-top"></div> -->
      <!-- :on-refresh="refresh" :on-infinite="infinite" -->
    <v-scroll class="scroll" :class="isData === 2 ? 'main-box28' : 'main-box29'" ref="my_scroller" :on-refresh="refresh" :on-infinite="infinite" style="margin-top: .2rem;">
      <div class="g-top-blank"></div>
      <div class="g-padinng-20" v-if="isData === 2">
        <ul>
          <li class="g-enter-item" v-for="(item, index) in list" :key="index" @click.stop="$router.push('/epidemicPreventionDetail?erId=' + item.erId)">
            <div class="flex-box g-enter-top">
              <h4>{{item.erTypeName}}</h4>
              <!-- <p :class="{
                'bg-red': item.odStatus === 1,
                'bg-blue': item.odStatus === 2 || item.odStatus === 3,
                'bg-green': item.odStatus === 4,
              }">{{getStatus(item.odStatus)}}</p> -->
            </div>
            <p class="p1 ellipsis2">{{item.erContent}}</p>
            <div class="flex-box g-enter-bottom">
              <div class="flex-box">
                <img class="img1" src="../../assets/enterpriseImg/handle-time.png" alt="">
                <p class="p-times">{{new Date(item.erCreateTime).format('yyyy-MM-dd hh:mm:ss')}} 提交</p>
              </div>
              <!-- <p class="p-pingjia" v-if="!item.isComment && item.odStatus === 4" @click.stop="$router.push('/enterpriseServiceEvaluation?erId=' + item.erId)">评价</p> -->
            </div>
          </li>
        </ul>
      </div>

      <div class="g-emptys-enter" v-if="isData === 3">
        <div class="g-conboxs">
          <img class="img" src="../../assets/enterpriseImg/emptys.png" alt="">
          <p class="p-explain">暂无防疫上报数据，点击下方按钮快速上报</p>
          <div class="g-enterprise-footer g-bots">
            <p @click.stop="$router.push('/epidemicPreventionReport')">提交防疫上报</p>
          </div>
        </div>
      </div>
      <div class="g-emptys-enter" v-if="isData === 5">
        <div class="g-conboxs">
          <img class="img" src="../../assets/images/no-limited.png" alt="">
          <p class="p-explain">{{message}}</p>
        </div>
      </div>
    </v-scroll>
    <div class="g-enterprise-footer" v-if="isData === 2">
      <p @click.stop="$router.push('/epidemicPreventionReport')">提交防疫上报</p>
    </div>
  </div>
</template>

<script>
  import * as getData from '../../service/getData'
  import * as mobile from '../../config/mUtils'
  export default {
    data () {
      return {
        pageIndex: 1,
        pageSize: 10,
        totalPage: 1,
        list: [],
        isData: 1,
        message: ''
      }
    },
    mounted () {

    },
    components: {},

    computed: {},
    methods: {
      refresh (done) {
        this.isData = 1
        getData.getEpidemicReportList(1, this.pageSize).then(res => {
          if (res.data.code == 1) {
            this.isData = 2
            this.list = res.data.data.list
            if (this.list.length === 0) {
              this.isData = 3
            }
            this.totalPage = res.data.data.pages
            this.pageIndex = 2
            done()
            
          }else if(res.data.code == 3){
            this.isData = 5
            this.message = res.data.message;
            done('error')
            return
          }else{
            this.isData = 3
            done('error')
            return
          }
          
        })
      },
      infinite (done) {
        if (this.pageIndex > this.totalPage) {
          done('end')
          return
        }
        getData.getEpidemicReportList(this.pageIndex, this.pageSize).then(res => {
          if (res.data.code == 1) {
            this.isData = 2
            this.list = this.list.concat(res.data.data.list)
            if (this.list.length === 0) {
              this.isData = 3
            }
            this.totalPage = res.data.data.pages;
            this.pageIndex++
            if (this.pageIndex > this.totalPage) {
              done('end')
            } else {
              done()
            }
            
          }else if(res.data.code == 3){
            this.isData = 5
            this.message = res.data.message;
            done('error')
            return
          }else{
            this.isData = 3
            done('error')
            return
          }
        }).catch(error => {
          done('error')
        })
      },
      getStatus (odStatus) {
        switch (odStatus) {
          case 1:
            return '待处理'
          case 2:
            return '处理中'
          case 3:
            return '处理中'
          case 4:
            return '已完成'
          default:
            return odStatus
        }
      }
    },
    filters: {

    }
  }
</script>

<style scoped lang="scss">
  @import '../../assets/css/mixin';
  .g-enter-item{
    width: 100%;
    background:rgba(255,255,255,1);
    box-shadow:0px .06rem .2rem 0px rgba(0,14,26,0.08);
    border-radius:.16rem;
    margin-bottom: .33rem;
    padding: 0 .4rem;
    &:last-child{
      margin-bottom: 0;
    }
    .p1{
      font-size:.26rem;
      font-family:PingFang SC;
      font-weight:400;
      color:rgba(119,119,119,1);
      line-height:.41rem;
      padding-top: .2rem;
      margin-bottom: .3rem;
    }
    .g-enter-top{
      /* justify-content: space-between; */
      padding-top: .3rem;
      h4{
        font-size:.3rem;
        font-family:PingFang SC;
        font-weight:500;
        color:rgba(51,51,51,1);
        line-height: .48rem;
      }
      p{
        font-size:.22rem;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(255,255,255,1);
        line-height: .36rem;
        width:.92rem;
        height:.36rem;
        border-radius:.18rem;
        text-align: center;
      }
      .bg-red{
        background:#FF6363;
      }
      .bg-blue{
        background:#5AA8FF;
      }
      .bg-green{
        background:#17C930
      }
    }
    .g-enter-bottom{
      border-top: 1px solid #DDDDDD;
      height: .84rem;
      justify-content: space-between;
      .p-pingjia{
        width:1.1rem;
        height:.5rem;
        border:1px solid rgba(102,102,102,1);
        border-radius: .25rem;
        font-size:.26rem;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(119,119,119,1);
        line-height:.5rem;
        text-align: center;
      }
      .img1{
        width: .26rem;
        height: .26rem;
        margin-right: .15rem;
      }
      .p-times{
        font-size:.24rem;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(204,204,204,1);
      }
    }
  }
  .g-emptys{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 0 .2rem .2rem;
    .g-conboxs{
      position: relative;
      background:rgba(255,255,255,1);
      box-shadow:0px .06rem .2rem 0px rgba(0,14,26,0.08);
      border-radius:.16rem;
      padding-top: 1.92rem;
      height: 100%;
      .img{
        display: block;
        margin: 0 auto;
        width: 2.16rem;
        height: 2.01rem;
      }
      .p-explain{
        font-size:.28rem;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(102,102,102,1);
        line-height: .48rem;
        margin-top: .4rem;
        text-align: center;
      }
      .g-bots{
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        padding: .4rem .4rem .5rem;
      }
    }
  }
</style>
