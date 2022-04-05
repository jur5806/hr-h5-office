<template>
  <div class="photo">
    <input ref="photo" class="upload-input" type="file" accept="image/*" capture="user" @change="checkOss">
  </div>
</template>
<script>
  import * as getData from '../service/getData'
  import * as mobile from '../config/mUtils'
  import { ossUrl } from "../config/env";
  import {upload, getExtranetUrl, deleteFile} from '../plugins/oss-sdk'
  import {mapState, mapMutations,mapActions} from 'vuex'

  export default {
    data () {
      return {
        photo: '',
      }
    },
    props: ['first'],
    activated () {
    },
    created () {
    },
    mounted () {

    },
    components: {
    },
    computed: {
    },
    methods: {
      checkOss (e) {
        let files = e.target.files || e.dataTransfer.files;
        if (!files.length) return
        mobile.selectImgFile(e).then(res => {
          if (res.res) {
            this.getToImg(e)
          }
        })
      },
      getToImg (e) {
        this.$dialog.loading.open('正在努力上传中...')
        mobile.uploadOss(e, getData.getSystemOssByUrl).then(res => {
          this.$dialog.loading.close();
          this.photo = res.imgUrl
          this.$emit('feedback', {url: this.photo, first: this.first})
        }).catch(err => {
          this.$dialog.loading.close();
        })
      },
      // checkOss (e) {
      //   getData.getSystemOssByUrl(ossUrl).then(res => {
      //     if (res.data.code === 1) {
      //       let clientConfig = {
      //         accessKeyId: res.data.data.AccessKeyId,//通过阿里云控制台创建的access key
      //         accessKeySecret: res.data.data.AccessKeySecret,//通过阿里云控制台创建的access secret。
      //         stsToken: res.data.data.SecurityToken,//使用临时授权方式。
      //         bucket: res.data.data.SystemOssBucket,// 通过控制台创建的bucket。
      //         endpoint: res.data.data.SystemOssEndpoint,//OSS域名。
      //         cname: true, //是否支持上传自定义域名，默认false。如果cname为true，endpoint传入自定义域名时，自定义域名需要先同bucket进行绑定。
      //         region: 'oss-cn-hangzhou', //bucket 所在的区域，默认 oss-cn-hangzhou（是根据当前所在区域自动确认的）。
      //       };
      //       this.onFileChange(e, clientConfig)
      //     }
      //   })
      // },
      // onFileChange (e, clientConfig) {
      //   /*this.$emit('feedback', {url: this.photo, first: this.first})
      //   return
      //   console.log(e.target.files[0]);*/
      //   //alert(JSON.stringify(e.target.files[0].name))
      //   // return
      //   const config = {
      //     isNotNeedRequest: true,//默认为false，即需要请求接口获取配置信息，不需要时，请设置为true。
      //     clientRequest: clientConfig,//当isNotNeedRequest为true时必填项，配置项详情请查看OSS上传的配置项文档。https://help.aliyun.com/
      //   }; //配置项
      //   let files = e.target.files || e.dataTransfer.files
      //   if (!files.length) return
      //   let exportFile = files[0]
      //   let fileName = files[0].name
      //   mobile.selectImgFile(e).then(res => {
      //     this.$dialog.loading.open('正在努力上传...');
      //     upload(e, config).then((resolve) => {
      //       const result = resolve.data;
      //       let url = getExtranetUrl(result.name, 2);//获取图片外网访问地址
      //       this.photo = url
      //       this.$emit('feedback', {url: this.photo, first: this.first})
      //       this.$dialog.loading.close();
      //     }).catch(_ => {
      //       this.$dialog.loading.close();
      //       alert(_.err)
      //       console.log(_.err);
      //     })
      //   })
      // },
    },
    watch: {

    }
  }
</script>
<style scoped lang="scss">
  @import '../assets/css/mixin';
  .photo{
    position: absolute;
    @include wh(100%, 100%);
    opacity: 0;
  }
  .upload-input{
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    @include wh(100%, 100%);
    opacity: 0;
  }
</style>

