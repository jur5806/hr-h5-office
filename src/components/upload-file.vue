<template>
  <div id="file-box" class="flex-box" style="flex-wrap: wrap;">
    <div v-for="(item,index) in fileList" :key="index" class="text-center contract-upload-file">
      <div v-if="!img">
        <div class=" position-relative">
          <img v-if="item.imgUrl" :src="item.imgUrl" alt="图片不见了" class="file-img" style="cursor: pointer;"
               @click="lookBigImg(item)"/>
          <img v-else-if="!item.imgUrl&&item.type==='video'" @click="lookFile(item)" src="../assets/img/timg.jpg"
               alt="图片不见了" class="file-img" style="cursor: pointer;"/>
          <img v-if="!item.imgUrl&&item.type!=='video'" src="../assets/img/u3362.png" alt="图片不见了" class="file-img"/>
          <img class="position redx" src="./../assets/img/redx.svg" alt="" style="right:6px;top:-6px;cursor: pointer;" @click="del(fileList,index,1)">
        </div>
        <p class="ellipsis" :title="item.fileName">{{item.fileName}}</p>
      </div>
      <div v-else class=" position-relative">
        <img v-if="item.imgUrl" :src="item.imgUrl" alt="图片不见了" class="img-type" @click="lookimgs(index)"/>
        <img v-if="!item.imgUrl" src="../assets/img/u13103.png" alt="图片不见了" class="img-type"/>
        <img class="position redx" src="./../assets/img/redx.svg" alt="" style="right:6px;top:-6px;cursor: pointer;" @click="del(fileList,index,1)">
      </div>
    </div>
    <div class="el-upload-file">
      <img src="./../assets/img/add.svg" alt="">
      添加图片
      <input type="file" @change="checkOss" ref="file" :accept="accept"/>
    </div>
    <!-- <el-dialog title="查看大图" class="file-big-img append-body" :visible.sync="lookBigImgDialog" top="5%"
               :append-to-body="true" center width="900px">
      <div class="dialog-warp text-center">
        <img :src="imgUrl" alt="图片不见了" class="big-img">
      </div>
    </el-dialog> -->
    <v-lookimg :activeimg="activeimg" :indeximg="indeximg" v-if="lookbool" @closeimg="close"></v-lookimg>
  </div>
</template>

<script>
  import * as global from '../config/mUtils'
  import * as getData from '../service/getData'
  import * as mobile from '../config/mUtils'
  import {ossActionUrl} from '../config/env'
  import {upload, getExtranetUrl, deleteFile} from '../plugins/oss-sdk'
  export default {
    data() {
      return {
        fileList: [],
        imgUrl: '',
        lookBigImgDialog: false,
        accept: '',
        checkNumber: 0,
        activeimg: [],
        indeximg: 0,
        lookbool: false
      }
    },
    // props: ['number', 'type', 'size', 'list'],
    props: {
      number: {
        type: Number,//文件数量
      },
      type: {
        type: String,//文件限制类型
      },
      size: {
        type: Number//文件大小限制
      },
      img: {
        default: false,//是否是图片
        type: Boolean,
      },
      isempty: {
        default: false,//是否是图片
        type: Boolean,
      },
      video: {
        default: false,//是否是视频文件
        type: Boolean,
      },
      list: {
        type: Array//文件列表
      },
      videoNumber: {
        type: Number//视频文件数量
      }
    },
    created() {
    },
    mounted() {
      if (this.list) {
        // console.log(this.list);
        if (this.img) {
          this.handleImg(this.list);
        } else {
          this.handleFile(this.list);
        }
      }
      if (this.type) {
        this.accept = this.type;
        // console.log(this.type)
      } else if (this.img) {
        this.accept = 'image/png,image/jpeg,image/jpg,image/gif'
      } else if (this.video) {
        this.accept = 'video/mp4,video/rmvb,video/avi,video/ts'
      }
    },
    computed: {},
    methods: {
      lookimgs (indeximg) {
        this.lookbool = true;
        this.indeximg = indeximg;
        this.activeimg = this.fileList.map(item=>{
          return item.imgUrl
        })
      },
      close () {
        this.lookbool = false
      },
      emptyone(){
        this.del(this.fileList,0,1)
      },
      del(arr, index, type) {
        arr.splice(index, 1);
        let obj = {
          file: '',
          fileList: arr,
          index: index
        };
        this.$emit('onFileChange', obj);
        if (type) {
          this.removeFile();
        }
      },
      lookFile(item) {
        if (item.address) {
          window.open(item.address);
        }
        // window.location.href = this.costEdit.address;
      },
      removeFile() {
        let fileObj = this.$refs['file'];
        if (fileObj) {
          fileObj.value = '';
        }
      },
      checkOss(e){
        let pat = /[`~!@#$%^&*()_+<>?:"{},\/;'[\]]/im
        let files = e.target.files || e.dataTransfer.files;
        // pat.test(files[0].name)
        if (files[0].name.indexOf(',') !== -1 || files[0].name.indexOf('，') !== -1) {
          this.removeFile();
          mobile.toast('请选择没有特殊字符的图片名的图片')
          return
        }
        getData.getSystemOssByUrl().then(res => {
          if (res.data.code === 1) {
            let clientConfig = {
              accessKeyId: res.data.data.AccessKeyId,//通过阿里云控制台创建的access key
              accessKeySecret: res.data.data.AccessKeySecret,//通过阿里云控制台创建的access secret。
              stsToken: res.data.data.SecurityToken,//使用临时授权方式。
              bucket: res.data.data.SystemOssBucket,// 通过控制台创建的bucket。
              endpoint: res.data.data.SystemOssEndpoint,//OSS域名。
              SystemOssChannelName: res.data.data.SystemOssChannelName, // OSS文件名
              cname: true, //是否支持上传自定义域名，默认false。如果cname为true，endpoint传入自定义域名时，自定义域名需要先同bucket进行绑定。
              region: 'oss-cn-hangzhou', //bucket 所在的区域，默认 oss-cn-hangzhou（是根据当前所在区域自动确认的）。
            };
            sessionStorage.setItem('clientConfig', JSON.stringify(clientConfig))
            sessionStorage.setItem('expiration', res.data.data.Expiration)
            this.onFileChange(e)
          }
        })
      },
      onFileChange(e) {
        let file = global.selectOtherFile1(e, mobile.toast,this.size);
        const imgArr = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
        const videoArr = ['video/mp4', 'video/rmvb', 'video/avi', 'video/ts'];
        let arr = [];
        let typeOk = [];
        if (this.type) {
          arr = this.type.split(',');
          if (this.img && arr.length === 0) {
            arr = imgArr;
          }
          arr.forEach((item) => {
            typeOk.push(file[0].type === item ? 1 : 0);
          });
          if (typeOk.indexOf(1) === -1) {
            // this.$emit('typeError');
            mobile.toast('选择文件格式错误！')
            this.removeFile();
            return
          }
          if (this.video) {
            if (videoArr.indexOf(file[0].type) !== -1) {
              let checkNumber = 0;
              this.fileList.forEach((item) => {
                if (item.type == 'video') {
                  checkNumber++;
                }
              });
              if (checkNumber >= this.videoNumber) {
                mobile.toast(`上传的视频文件最多${this.videoNumber}个！`)
                this.removeFile();
                return
              }
            }
          }
        } else if (this.img) {
          arr = imgArr;
          arr.forEach((item) => {
            typeOk.push(file[0].type === item ? 1 : 0);
          });
          if (typeOk.indexOf(1) == -1) {
            // this.$emit('typeError');
            mobile.toast('选择图片格式错误！')
            this.removeFile();
            return
          }
        }
        if (this.size) {
          if (file[0].size > this.size * 1024 * 1024) {
            mobile.toast(`选择文件最大为${this.size}M`)
            return
          }
        }
        let isOk = true;
        if (this.number && this.number > 1) {
          if (this.fileList.length < this.number) {
            // this.fileList.forEach((item, index) => {
            //   if (item.fileName == file[0].name) {
            //     isOk = false;
            //   }
            // });
            if (isOk) {
              if (this.img || (this.video && imgArr.indexOf(file[0].type) !== -1)) {
                let exportFile = file[0];
                let fileName = file[0].name;
                const config = {
                  //action: ossActionUrl, //获取取配置信息接口请求地址，当isNotNeedRequest为false时必传。
                  isNotNeedRequest: true,//默认为false，即需要请求接口获取配置信息，不需要时，请设置为true。
                  clientRequest: global.strParse(sessionStorage.getItem('clientConfig')),//当isNotNeedRequest为true时必填项，配置项详情请查看OSS上传的配置项文档。https://help.aliyun.com/
                }; //配置项
                upload(e, config).then((resolve) => {
                  const result = resolve.data;
                  let url = getExtranetUrl(result.name, 2);//获取图片外网访问地址
                  //url = url.slice(0, url.indexOf('?'));
                  this.fileList.push({
                    exportFile: url,
                    fileName: fileName,
                    imgUrl: url,
                  });
                  let obj = {
                    file: url,
                    fileList: this.fileList
                  };
                  this.$emit('onFileChange', obj);
                  this.removeFile();//移除选择文件的选中状态，可以继续选择文件
                }).catch(_ => {
                  console.log(_.err);
                  this.removeFile();
                })
                // global.selectImgFile(e, this.$message).then(res => {
                //   this.fileList.push({
                //     exportFile: exportFile,
                //     fileName: fileName,
                //     imgUrl: res,
                //   });
                //   let obj = {
                //     file: file,
                //     fileList: this.fileList
                //   };
                //   this.$emit('onFileChange', obj);
                //   this.removeFile();
                // })
              } else {
                const config = {
                  //action: ossActionUrl, //获取取配置信息接口请求地址，当isNotNeedRequest为false时必传。
                  isNotNeedRequest: true,//默认为false，即需要请求接口获取配置信息，不需要时，请设置为true。
                  clientRequest: global.strParse(sessionStorage.getItem('clientConfig')),//当isNotNeedRequest为true时必填项，配置项详情请查看OSS上传的配置项文档。https://help.aliyun.com/
                }; //配置项
                upload(e, config).then((resolve) => {
                  const result = resolve.data;
                  let url = getExtranetUrl(result.name, 2);//获取图片外网访问地址
                  //url = url.slice(0, url.indexOf('?'));

                  let fileName = file[0].name;
                  if (videoArr.indexOf(file[0].type) !== -1) {
                    this.fileList.push({
                      exportFile: url,
                      fileName: fileName,
                      type: 'video'
                    });
                  } else {
                    this.fileList.push({
                      exportFile: url,
                      fileName: fileName
                    });
                  }
                  let obj = {
                    file: url,
                    fileList: this.fileList
                  };
                  this.$emit('onFileChange', obj);
                  this.removeFile();//移除选择文件的选中状态，可以继续选择文件
                }).catch(_ => {
                  console.log(_.err);
                  this.removeFile();
                })
                // if (videoArr.indexOf(file[0].type) !== -1) {
                //   this.fileList.push({
                //     exportFile: file[0],
                //     fileName: file[0].name,
                //     type: 'video'
                //   });
                // } else {
                //   this.fileList.push({
                //     exportFile: file[0],
                //     fileName: file[0].name
                //   });
                // }
                // let obj = {
                //   file: file,
                //   fileList: this.fileList
                // };
                // this.$emit('onFileChange', obj);
                // this.removeFile();
              }
            } else {
              mobile.toast('已经存在该文件！')
            }
          } else {
            mobile.toast(`最多只能上传${this.number}个文件！`)
          }
        } else {
          if (this.img) {
            let exportFile = file[0];
            let fileName = file[0].name;
            const config = {
              //action: ossActionUrl, //获取取配置信息接口请求地址，当isNotNeedRequest为false时必传。
              isNotNeedRequest: true,//默认为false，即需要请求接口获取配置信息，不需要时，请设置为true。
              clientRequest: global.strParse(sessionStorage.getItem('clientConfig')),//当isNotNeedRequest为true时必填项，配置项详情请查看OSS上传的配置项文档。https://help.aliyun.com/
            }; //配置项
            upload(e, config).then((resolve) => {
              const result = resolve.data;
              let url = getExtranetUrl(result.name, 2);//获取图片外网访问地址
              // url = url.slice(0, url.indexOf('?'));
              this.fileList = [{
                exportFile: url,
                fileName: fileName,
                imgUrl: url,
              }]
              let obj = {
                file: url,
                fileList: this.fileList
              };
              this.$emit('onFileChange', obj);
              this.removeFile();//移除选择文件的选中状态，可以继续选择文件
            }).catch(_ => {
              console.log(_.err);
              this.removeFile();
            })
            // global.selectImgFile(e, this.$message).then(res => {
            //   // console.log(res)
            //   this.fileList = [{
            //     exportFile: exportFile,
            //     fileName: fileName,
            //     imgUrl: res,
            //   }];
            //   let obj = {
            //     file: file,
            //     fileList: this.fileList
            //   };
            //   this.$emit('onFileChange', obj);
            //   this.removeFile();
            // }).catch(err => {
            //   console.log(err)
            // })
          } else {
            const config = {
              //action: ossActionUrl, //获取取配置信息接口请求地址，当isNotNeedRequest为false时必传。
              isNotNeedRequest: true,//默认为false，即需要请求接口获取配置信息，不需要时，请设置为true。
              clientRequest: global.strParse(sessionStorage.getItem('clientConfig')),//当isNotNeedRequest为true时必填项，配置项详情请查看OSS上传的配置项文档。https://help.aliyun.com/
            }; //配置项
            let fileName = file[0].name;
            upload(e, config).then((resolve) => {
              const result = resolve.data;
              let url = getExtranetUrl(result.name, 2);//获取图片外网访问地址
              // url = url.slice(0, url.indexOf('?'));
              this.fileList = [{
                exportFile: url,
                fileName: fileName,
              }]
              let obj = {
                file: url,
                fileList: this.fileList
              };
              this.$emit('onFileChange', obj);
              this.removeFile();//移除选择文件的选中状态，可以继续选择文件
            }).catch(_ => {
              console.log(_.err);
              this.removeFile();
            })
            // this.fileList = [{
            //   exportFile: file[0],
            //   fileName: file[0].name
            // }];
            // let obj = {
            //   file: file,
            //   fileList: this.fileList
            // };
            // this.$emit('onFileChange', obj);
            // this.removeFile();
          }
        }
      },
      lookBigImg(row) {
        this.imgUrl = row.imgUrl;
        this.lookBigImgDialog = true;
      },
      handleFile(val) {
        const imgArr = ['image/png', 'image/jpeg', 'image/gif'];
        const videoArr = ['video/mp4', 'video/rmvb', 'video/avi', 'video/ts'];
        this.fileList = [];
        if (this.img) {
          val.forEach((fileItem) => {
            this.fileList.push({
              exportFile: '',
              fileName: '',
              imgUrl: fileItem,
            });
          })
        } else {
          val.forEach((fileItem) => {
            if (this.video && fileItem.address) {
              this.fileList.push({
                fileName: fileItem.fileName,
                address: fileItem.address,
                type: 'video'
              })
            } else if (fileItem.imgUrl) {
              this.fileList.push({
                fileName: fileItem.fileName,
                imgUrl: fileItem.imgUrl,
                type: 'img'
              })
            } else {
              if (fileItem.exportFile && fileItem.fileName) {
                this.fileList.push({
                  exportFile: fileItem.exportFile,
                  fileName: fileItem.fileName
                })
              } else if (fileItem.fileName) {
                this.fileList.push({
                  exportFile: '',
                  fileName: fileItem.fileName
                })
              } else {
                this.fileList.push({
                  exportFile: '',
                  fileName: fileItem
                })
              }
            }
          })
        }
      },
      uoloadImgOss(e){
        const config = {
          //action: ossActionUrl, //获取取配置信息接口请求地址，当isNotNeedRequest为false时必传。
          isNotNeedRequest: true,//默认为false，即需要请求接口获取配置信息，不需要时，请设置为true。
          clientRequest: global.strParse(sessionStorage.getItem('clientConfig')),//当isNotNeedRequest为true时必填项，配置项详情请查看OSS上传的配置项文档。https://help.aliyun.com/
        }; //配置项
        upload(e, config).then((resolve) => {
          const result = resolve.data;
          let url = getExtranetUrl(result.name, 2);//获取图片外网访问地址
          //url = url.slice(0, url.indexOf('?'));
          if (that.number === 1) {

          }
          this.fileList.push({
            exportFile: url,
            fileName: result.name,
            imgUrl: url,
          });
          let obj = {
            file: url,
            fileList: this.fileList
          };
          this.$emit('onFileChange', obj);
          this.removeFile();//移除选择文件的选中状态，可以继续选择文件
        }).catch(_ => {
          console.log(_.err);
          this.removeFile();
        })
      },
      handleImg(val) {
        this.fileList = [];
        if (this.img) {
          val.forEach((fileItem) => {
            this.fileList.push({
              exportFile: '',
              fileName: '',
              imgUrl: fileItem,
            });
          })
        } else {
          val.forEach((fileItem) => {
            if (fileItem.exportFile && fileItem.fileName) {
              this.fileList.push({
                exportFile: fileItem.exportFile,
                fileName: fileItem.fileName
              })
            } else if (fileItem.fileName) {
              this.fileList.push({
                exportFile: '',
                fileName: fileItem.fileName
              })
            } else {
              this.fileList.push({
                exportFile: '',
                fileName: fileItem
              })
            }
          })
        }
      }
    },
    components: {},
    watch: {
      list(val) {
        if (val) {
          if (this.img) {
            this.handleImg(val);
          } else {
            this.handleFile(val);
          }
        }
      }
    }
  }
</script>
<style scoped lang="scss">
  @import '../assets/css/mixin';

  .el-upload-file {
    display: flex;
    flex-direction: column;
    width: 80px;
    height: 80px;
    border: 1px dashed #c0c4cc;
    position: relative;
    margin-top: 10px;
    margin-right: 20px;
    text-align: center;
    justify-content: center;
    align-items: center;
    color: grey;
    font-size: 12px;
    img {
      width: 40px;
      height: 40px;
      color: #c0c4cc;
    }
    input {
      position: absolute;
      width: 80px;
      height: 80px;
      left: 0;
      top: 0;
      opacity: 0;
    }
  }

  .delete {
    height: 14px;
  }

  .delete:hover {
    cursor: pointer;
    font-size: 18px;
  }

  .position {
    position: absolute;
  }

  .position-relative {
    position: relative;
  }

  .contract-icon-del {
    right: -6px;
    top: -8px;
    color: red;
  }

  .contract-icon-del:hover {
    color: red;
    cursor: pointer;
  }

  .file-img {
    width: 40px;
    height: 40px;
  }

  .img-type {
    width: 80px;
    height: 80px;
    cursor: pointer;
  }

  .contract-upload-file {
    margin: 10px 10px 0 0;
    width: 100px;
    height: 100px;
    //overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
    p {
      width: 100%;
    }
  }

  .text-center {
    text-align: center;
  }

  .text-left {
    text-align: left;
  }

  .text-right {
    text-align: right;
  }

  /*单行文字不换行，多出来的变为省略号*/
  .ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /*两行文字不换行，多出来的变为省略号*/
  .ellipsis2 {
    white-space: normal;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .big-img {
    width: auto;
    height: 100%;
  }

  .dialog-warp {
    padding: 5px;
    max-height: 100%;
  }

  #file-box .file-big-img {
    .el-dialog__body {
      padding: 0;
    }
  }
  .redx{
    width: 12px;
    height: 12px;
  }
</style>
