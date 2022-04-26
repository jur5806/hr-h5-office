<template>
  <div class="warp page1 g-page-grey">
    <v-header :goBack="true" headTitle="职位中心">
    </v-header>
    <!-- <v-header :goBack="true" headTitle="企业服务中心" :serviceGet="true"></v-header> -->
    <!-- <div class="g-enterprise-bg" style="flex:1"> -->
      <!-- <div class="g-bg-top"></div> -->
      <v-scroll class="scroll" :class="isData === 2 ? 'main-box28' : 'main-box29'" ref="my_scroller" style="flex:1">
        <div class="g-top-blank"></div>
        <div class="g-padinng-20" v-if="isData === 2">
          <ul style="margin-top: .2rem;">
            <li class="g-enter-item" v-for="(item, index) in list" :key="index" @click.stop="$router.push('/postionDetail?checkType=' + item.recruitId+'&hrId='+item.hrId+'&userId='+userId),$store.state.isShare = true">
              <div class="flex-box g-enter-top">
                <h4>{{item.stationTitle}}</h4>
                <p class="bg-green">{{item.workPlace}}</p>
              </div>
              <p class="p1 ellipsis2">{{item.rcDescribe}}</p>
              <div class="flex-box g-enter-bottom">
                <div class="flex-box">
                  <img class="img1" src="../assets/enterpriseImg/handle-time.png" alt="">
                  <p class="p-times">{{new Date(item.rcStartTime).format('yyyy-MM-dd')}} 提交</p>
                </div>
                <!-- <p class="p-pingjia" v-if="!item.isComment && item.odStatus === 4" @click.stop="$router.push('/enterpriseServiceEvaluation?odId=' + item.odId)">评价</p> -->
              </div>
            </li>
          </ul>
        </div>

        <div class="g-emptys-enter" v-if="isData === 3">
          <div class="g-conboxs">
            <img class="img" src="../assets/enterpriseImg/emptys.png" alt="">
            <p class="p-explain">暂无服务信息，点击下方按钮快速申请</p>
            <div class="g-enterprise-footer g-bots">
              <p @click.stop="$router.push('/chooseEnterpriseService?type='+$route.query.type)">提交服务申请</p>
            </div>
          </div>
        </div>
      </v-scroll>
      <v-footer></v-footer>
      <!-- <div class="g-enterprise-footer" v-if="isData === 2">
        <p @click.stop="$router.push('/chooseEnterpriseService?type='+$route.query.type)">提交服务申请</p>
      </div> -->
    <!-- </div> -->
  </div>
</template>

<script>
  import * as getData from '../service/getData'
  import * as mobile from '../config/mUtils'
  export default {
    data () {
      return {
        pageIndex: 1,
        pageSize: 10,
        totalPage: 1,
        name: '',
        list: [
          // {
          //   orderTypeName: '服务类型',
          //   odStatus: 1,
          //   odDescription: '企业的门头灯坏掉了，一直闪烁，比较影响经营，希望园区服务人员能派人来修理一下。',
          //   odCreateTime: '2022/2/26 15:29:56'
          // },
          // {
          //   orderTypeName: '服务类型',
          //   odStatus: 2,
          //   odDescription: '企业的门头灯坏掉了，一直闪烁，比较影响经营，希望园区服务人员能派人来修理一下。',
          //   odCreateTime: '2022/2/26 15:29:56'
          // },{
          //   orderTypeName: '服务类型',
          //   odStatus: 4,
          //   odDescription: '企业的门头灯坏掉了，一直闪烁，比较影响经营，希望园区服务人员能派人来修理一下。',
          //   odCreateTime: '2022/2/26 15:29:56'
          // }
        ],
        isData: 1,
        userId:'',
      }
    },
    mounted () {
      this.userId = sessionStorage.getItem('userId')
      this.init();
    },
    components: {},

    computed: {},
    methods: {
      init () {
        getData.recruitList({
          name: this.name,
          id: 0,
        }).then(res => {
          if (res.data.code !== 200) {
            this.isData = 3
            return
          }
          this.isData = 2
          this.list = res.data.data
          if (this.list.length === 0) {
            this.isData = 3
          }
        }).catch(error => {
        })
      },
      getStatus (odStatus) {
        switch (odStatus) {
          case 1:
            return '待处理'
          case 2:
            return '待处理'
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
  @import '../assets/css/mixin';
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
      padding-bottom: .3rem;
    }
    .g-enter-top{
      justify-content: space-between;
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
      .bg-gary{
        background:#999999
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
