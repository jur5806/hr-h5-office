<template>
  <div class="warp page1">
    <v-header :goBack="true" headTitle="新增人脸信息" :serviceGet="true">
    </v-header>
    <v-scroll ref="my_scroller" class="service-main-box scroll">
      <div class="g-face-box">
        <div class="g-face-addBox g-mineitem clearfix">
          <div class="g-face-item flex-box">
            <div class="g-word flex-box">
              <label class="g-face-item-label">姓名</label>
              <div class="g-face-item-content">
                <input class="g-face-item-input" placeholder="请输入姓名" v-model="info.faceName" type="text">
              </div>
            </div>
          </div>
          <div class="g-face-item flex-box">
            <div class="g-word flex-box">
              <label class="g-face-item-label">设置为默认人脸</label>
              <div class="g-face-item-content">
                <div class="g-face-item-switch">
                  <yd-switch v-model="info.faceDefault" size="small" color="#3F7DEF"></yd-switch>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="g-add-file">
        <img src="../../../static/img/xinzengrenlianxinxi_tianjiatupian.png" alt="">
        <img v-if="photo" :src="photo+'?x-oss-process=image/resize,w_500/auto-orient,1'" alt="">
        <input ref="upPicAndVideo" type="file" @change="onFileChange" class="upload-input" mutiple="mutiple"
               accept="image/*" :capture="$store.state.isIOS?false:'camera'"/>
      </div>
    </v-scroll>
    <div class="g-confirmbtn" @click="submits">保存</div>
  </div>
</template>
<script>
  import * as getData from '../../service/getData'
  import * as mobile from '../../config/mUtils'
  import { ossUrl } from '../../config/env'
  import {upload, getExtranetUrl} from '../../plugins/oss-sdk'

  export default {
    data() {
      return {
        navstate: 0,
        pageIndex: 1,
        totalPage: 1,
        appointmentRecordList: [],
        checkState: '',
        faceList: [
          {
            myFace: '陈亚杰',
            id: 1
          },
          {
            myFace: '张三丰',
            id: 2
          }
        ],
        faceActive: '',
        fileList: [],
        photo: '',
        info: {
          faceName: '',
          faceDefault: false
        },
        submitsLoading: false,
        query: {}
      }
    },
    created() {
      this.$route.query && (this.query = this.$route.query);
    },
    components: {},
    mounted() {
    },
    computed: {},
    methods: {
      submits() {
        if (this.submitsLoading) {
          mobile.toast('请勿重复提交！')
          return
        }
        if (!this.info.faceName) {
          mobile.toast('请输入姓名！')
          return
        }
        if (!this.photo) {
          mobile.toast('请上传图片！')
          return
        }
        let defaultNum = 0
        if (this.info.faceDefault) {
          defaultNum = 1
        } else {
          defaultNum = 0
        }
        this.submitsLoading = true;
        getData.addFieldFace(this.info.faceName, this.photo, defaultNum).then(res => {
          this.submitsLoading = false;
          if (res.data.code === 1) {
            mobile.toast('添加成功！')
            this.$router.replace({path: "/faceInfo", query: this.query});
          }
        }).catch(_ => {
          this.submitsLoading = false;
        })
      },
      onFileChange (e) {
        let files = e.target.files || e.dataTransfer.files;
        if (!files.length) return
        mobile.selectImgFile(e).then(res => {
          if (res.res) {
            this.getToImg(e)
          }
        })
      },
      getToImg (e) {
        let files = e.target.files || e.dataTransfer.files;
        this.$dialog.loading.open('正在努力上传中...')
        mobile.uploadOss(e, getData.getSystemOssByUrl).then(res => {
          this.$dialog.loading.close();
          this.fileList.push({
            exportFile: res.imgUrl,
            fileName: files[0].name,
            imgUrl: res.imgUrl
          })
          this.photo = res.imgUrl
        }).catch(err => {
          this.$dialog.loading.close();
        })
      },
    },
    watch: {}

  }

</script>
<style scoped lang="scss">
  @import '../../assets/css/mixin';

  .g-face-box {
    width: 100%;
    margin-top: .3rem;

    .g-face-addBox {
      padding-left: .59rem;
    }

    .g-face-item {
      @include wh(100%, 1.1rem);
      border-bottom: 1px solid #EEEEEE;

      .g-face-item-label {
        @include sc(.28rem, #333);
        margin-right: .35rem;
      }

      .g-face-item-content {
        flex: 1;
        height: 100%;
        overflow: hidden;

        .g-face-item-input {
          width: 100%;
          height: 100%;
          @include sc(.26rem, #666);
          line-height: .42rem;

          &::placeholder {
            @include sc(.26rem, #aaa);
          }
        }

        .g-face-item-switch {

        }
      }
    }

    .g-face-item:last-child {
      border-bottom: none;
    }
  }

  .g-add-file {
    width: 1.5rem;
    height: 1.5rem;
    margin-top: .4rem;
    margin-left: .6rem;
    overflow: hidden;
    position: relative;

    img {
      @include wh(100%, 100%);
      object-fit: cover;
      position: absolute;
    }

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
  }
</style>

