<template>
  <div class="warp page1">
    <v-header :goBack="true" headTitle="人脸信息" :serviceGet="true">
    </v-header>
    <v-scroll ref="my_scroller" class="service-main-box scroll">
      <div class="g-minelist">
        <div class="g-mineitem flex-box g-shadow marbot30" v-for="(item,index) in faceList" :key="index"
             @click.stop="select(item,index)" v-leftslidedel:right-btn-box="">
          <div class="flex-box g-mineleft">
            <p class="g-face-name">{{item.fieldFaceName}}</p>
            <!--            <span v-if="userId === item.fieldFaceUserId" class="g-face-type g-face-blur">本人</span>-->
            <span class="g-face-type" v-if="item.fieldFaceIsDefault">默认</span>
          </div>
          <div class="g-mineright flex-box">
            <b class="b-circle" :class="{active:faceActive === item.fieldFaceId}"></b>
          </div>
          <div class="right-btn-box" :ref="`face-info-${index}`">
            <div class="face-btn" @click.stop="setDefault(item,index)">设为默认</div>
            <div class="face-btn danger" @click.stop="del(item,index)">删除</div>
          </div>
        </div>
      </div>
      <div class="g-message">最多同时存在3条人脸信息</div>
    </v-scroll>
    <div class="g-confirmbtn" @click="submits">新增人脸信息</div>
  </div>
</template>
<script>
  import * as getData from '../../service/getData'
  import * as mobile from '../../config/mUtils'
  import {mapState, mapMutations, mapActions} from 'vuex'

  export default {
    data() {
      return {
        navstate: 0,
        pageIndex: 1,
        totalPage: 1,
        appointmentRecordList: [],
        checkState: '',
        faceList: [],
        faceInfo: {
          myFace: '',
          id: 1,
          isDefault: true
        },
        faceActive: '',
        faceDefault: 1,
        first: '',
        userId: '',
        showCameraSelect: false,
        startMove: {
          startObj: '',
          startIndex: '',
          startX: 0,   // 触摸位置
          endX: 0,     // 结束位置
          moveX: 0,   // 滑动时的位置
          disX: 0,    // 移动距离
          deleteSlider: '', // 滑动时的效果,使用v-bind:style="deleteSlider"
          query: {}
        }
      }
    },
    created() {
      this.$route.query && (this.query = this.$route.query);
      let myFace = this.$store.state.myFace
      if (myFace) {
        (myFace.fieldFaceId) && (this.faceActive = myFace.fieldFaceId)
      }
    },
    components: {},
    mounted() {
      let user = mobile.getSession('user')
      if (user) {
        this.userId = JSON.parse(user).userId
      }
      this.init()
    },
    computed: {},
    methods: {
      select(row, index) {
        console.log(row)
        this.faceActive = row.fieldFaceId
        this.$store.state.myFace = row
        this.$router.replace({path: '/appointmentConfirm', query: this.query})
      },
      submits() {
        if (this.faceList.length >= 3) {
          mobile.toast('已添加3条人脸信息，无法继续添加', 1500, 'message-common-toast')
          return
        }
        this.$router.push({path: '/addFaceInfo', query: this.query})
      },
      init() {
        getData.fieldFaceList().then(res => {
          if (res.data.code === 1) {
            this.faceList = res.data.data;
            this.faceList.forEach(item => {
              if(item.fieldFaceIsDefault){
                this.faceActive = item.fieldFaceId;
              }
            });
          } else {
            mobile.toast(res.data.message)
          }
        })
      },
      setDefault(row, index) {
        this.faceDefault = row.fieldFaceIsDefault
        getData.updateFieldFace(row.fieldFaceId, this.faceDefault).then(res => {
          if (res.data.code === 1) {
            mobile.toast('设置成功')
          }
        })
      },
      del(row, index) {
        getData.delFieldFace(row.fieldFaceId).then(res => {
          if (res.data.code == 1) {
            mobile.toast(res.data.message)
            let myFace = this.$store.state.myFace
            if (myFace.fieldFaceId === row.fieldFaceId) {
              this.$store.state.myFace = ''
            }
            this.init()
          } else {
            mobile.toast(res.data.message)
          }
        }).catch(_ => {
          console.log(_)
        })
      },
      reentry() {
        this.showCameraSelect = true
      },
      goSure(data) {
        this.photo = data.url
      }

    },
    watch: {}

  }

</script>
<style scoped lang="scss">
  @import '../../assets/css/mixin';

  .g-minelist {
    margin-top: .3rem;
    padding: 0;
  }

  .g-face-name {
    @include sc(.26rem, #727171);
    margin-right: .13rem;
  }

  .g-face-type {
    padding: 0 .18rem;
    @include sc(.24rem, #666);
    line-height: .42rem;
    background: rgba(238, 238, 238, 1);
    border-radius: .21rem;
    margin-right: .13rem;
  }

  .g-face-type.g-face-blur {
    color: #3C78E5;
    background: rgba(219, 234, 251, 1);
  }

  .g-money-number {
    @include sc(.24rem, #3C78E5);
  }

  .g-confirmbtn {
    height: 1rem;
    background: #3F7DEF;
    position: relative;

    .upload-input {
      position: absolute;
      top: 0;
      left: 0;
      @include wh(100%, 100%);
      opacity: 0;
    }
  }

  .g-mineitem {
    margin-bottom: .28rem;
    box-shadow: 0 0 .50rem 0 rgba(214, 214, 214, 0.5);
    transition: all .3s ease-in-out;
  }

  .b-circle {
    width: .26rem;
    height: .26rem;
    border-radius: 50%;
    border: .02rem solid #cbcbcb;
    padding: 1px;
    box-sizing: border-box;
  }

  .b-circle.active {
    background-color: #3f7def;
    background-clip: content-box;
  }

  .g-message {
    margin-top: .4rem;
    @include sc(.26rem, #AAA);
    text-align: center;
  }

  .right-btn-box {
    position: absolute;
    right: -2.6rem;
    top: 0;
    width: 2.6rem;
    height: 100%;
    display: flex;

    .face-btn {
      flex: 1;
      height: 100%;
      background: rgba(238, 238, 238, 1);
      @include sc(.26rem, #333);
      line-height: 1.1rem;
      text-align: center;
    }

    .face-btn.danger {
      background: rgba(255, 47, 47, 1);
      @include sc(.26rem, #fff);
    }
  }

  .camera-select-box {
    width: 100%;
    height: 100%;
    flex-direction: column;
    background: #ccc;

    .camera-select-item {
      flex: 1;
      width: 100%;
      background: rgba(247, 247, 248, 1);
      @include sc(.32rem, #333333);
      line-height: 1rem;
      text-align: center;
      border-bottom: .02rem solid #ccc;
      box-sizing: border-box;
      overflow: hidden;
      position: relative;

      .upload-input {
        position: absolute;
        top: 0;
        left: 0;
        @include wh(100%, 100%);
        opacity: 0;
      }
    }
  }
</style>

