<template>
  <div class="warp page1">
    <v-header :goBack="true" headTitle="场地预约" :serviceGet="true">
    </v-header>
    <v-scroll class="service-main-box scroll" ref="my_scroller">
      <div class="g-nodata g-nodata1" v-if="isLoading">
        <div class="noarticle g-adaptimg g-loading-icon"><img class="i-magnifier"
                                                              src="http://park.hzqisheng.cn/v3.5/i-loading-magnifier.png"
                                                              alt=""></div>
        <p class="nodatatext g-loading">正在加载</p>
      </div>
      <div v-else>
        <div class="g-banner">
          <swiper :options="swiper1Option" ref="mySwiper1" class="swiper-container swiper-box swpicont">
            <swiper-slide v-for="(item,index) in field.fieldImageList" :key="index" style="height: 100%"
                          class="flex-box swipereve-box">
              <img class="f-adapt-img" :src="item" alt="">
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
          </swiper>
        </div>
        <div class="g-field-info clearfix" style="min-height: 2.2rem;height: auto;">
          <div class="g-info">
            <div class="g-info-title">
              <span>{{field.fieldTypeName}}</span>
              {{field.fieldName}}
              <div class="g-money"><i class="iconfont1 iconfont icon-gold"></i>
                <template v-if="field.fieldFeeType==1">
                  {{field.fieldFee}}{{field.fieldFeeUnit| fieldFeeUnit}}
                </template>
                <template v-if="field.fieldFeeType==2">
                  <template>{{field.fieldFee}}元/次 起</template>
                </template>
                <template v-if="field.fieldFeeType==3">
                  <template v-if="field.fieldFeeConfigInfo.halfDay">{{field.fieldFeeConfigInfo.halfDayPrice}}元/半天<template v-if="field.fieldFeeConfigInfo.allDay">、</template></template><template v-if="field.fieldFeeConfigInfo.allDay">{{field.fieldFeeConfigInfo.allDayPrice}}元/全天</template>
                </template>
              </div>
            </div>
            <div class="g-info-content">场地位置：{{field.fieldAddress}}</div>
            <div class="g-info-content">场地容量：可容纳{{field.fieldCapacity}}人</div>
          </div>
        </div>
        <div class="g-field-info g-field-intro clearfix">
          <div class="g-info">
            <div class="g-info-title">
              场地介绍
            </div>
            <div class="g-info-intro g-html-img" v-html="field.fieldDetail" @click="previewImage"></div>
          </div>
        </div>
        <div class="g-field-info g-field-intro clearfix">
          <div class="g-info">
            <div class="g-info-title">
              附件信息
            </div>
            <div class="g-info-intro g-html-img" v-if="field.fieldFileUrl.length==0">
              暂无附件信息
            </div>
            <div class="g-info-intro g-html-img" v-else>
              <div class="load-link" v-for="(item,index) in field.fieldFileUrl"><a :src="item.fileUrl" :download="item.fileName" @click="lookFile(item.fileUrl)">{{item.fileName}}</a></div>
            </div>
          </div>
        </div>
      </div>

    </v-scroll>
    <div v-show="!isLoading" class="g-confirmbtn"
         @click="$router.push({path:'/makeAppointment',query:{fieldId:$route.query.fieldId}})">立即预约
    </div>
    <!--<div class="g-frame" v-if="false">
      <div class="g-confirmbtn g-opacity"></div>
    </div>-->
  </div>
</template>
<script>
  import * as getData from '../../service/getData'
  import * as mobile from '../../config/mUtils'
  import {mapState, mapMutations, mapActions} from 'vuex'

  export default {
    data() {
      return {
        swiper1Option: {//幻灯片
          pagination: '.swiper-pagination',
          bulletClass: 'my-bullet',
          bulletActiveClass: 'my-bullet-active',
          paginationClickable: true,
          direction: 'horizontal',
          loop: true,
          autoplay: 4000,
          autoplayDisableOnInteraction: false,
          onClick: i => {
            /*if (this.appBannerList[i.realIndex].bannerLinkUrl!='') {
              window.location.href = this.appBannerList[i.realIndex].bannerLinkUrl;
            }*/
          },
        },
        field: {},
        byFieldId: [],
        isLoading: true,
      }
    },
    mounted() {
      this.init()
    },
    activated() {
    },
    components: {},

    computed: {},
    methods: {
      init() {
        getData.fieldDetail(this.$route.query.fieldId).then(res => {
          if (res.data.code === 1) {
            this.isLoading = false;
            this.field = res.data.data
            this.field.fieldFeeConfigInfo = JSON.parse(this.field.fieldFeeConfigInfo)
            this.field.fieldFileUrl = this.field.fieldFileUrl?this.field.fieldFileUrl:[]
          } else {
            mobile.toast(res.data.message)
          }
        })
      },
      lookFile(url) {
        let type = mobile.fileUrl(url);
        if (type == "word" || type == "excel"|| type == "txt") {
          window.open(
            `https://wps-view.zhihuipk.com/?src=${url}`
          );
        }else if (type == "pdf" || type == "image" ) {
          window.open(`${url}`);
        }else{
           mobile.message("该格式不可在线预览，请下载后查看");
        }
      }
    },
    watch: {}

  }

</script>
<style scoped lang="scss">
  @import '../../assets/css/mixin';

  .g-banner {
    @include wh(100%, 3.9rem);

    .swiper-container {
      @include wh(100%, 100%);
    }
  }

  .g-frame {
    .g-confirmbtn {
      background: $gray;
    }
  }

  .scroll {
    background: #FBFBFB;
  }

  .g-field-intro {
    padding: 0 .24rem .49rem;
    height: auto;
  }
  .load-link{
    line-height: 30px;
    color: rgb(28, 153, 226);
    text-decoration: underline;
  }
</style>


