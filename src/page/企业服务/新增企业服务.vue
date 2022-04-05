<template>
  <div class="warp page1 g-page-grey">
    <v-header :goBack="true" headTitle="提交服务申请">
    </v-header>
    <!-- <div class="g-enterprise-bg"> -->
      <!-- <div class="g-bg-top"></div> -->
      <v-scroll class="scroll" ref="my_scroller" :class="navIndex === 1 ? 'main-box28' : 'main-box29'" style="padding-top: .2rem;">
        <!--main-box29-->
        <div class="g-top-blank"></div>
        <div class="g-padinng-20" v-if="navIndex === 1">
          <div class="g-enter-shadow g-answer" style="padding-bottom: .15rem">
            <h4 class="g-shadow-tit" style="margin-bottom: .28rem">服务填报信息</h4>
            <div class="g-forms-enter">
              <!-- <div class="g-form-item">
                <p class="g-form-label g-required">处理人</p>
                <div class="g-form-cont">
                  <div style="border: 1px solid #cccccc;border-radius: 0.06rem;padding: 0.12rem 0.22rem;">
                    <v-popupSelect ref="dealUserAdminId" @confirm="getCompanyName(info.dealUserAdminId)" v-model="info.dealUserAdminId" :options="clientList" labelKey="adminName" valueKey="adminId" placeholder="请选择处理人"></v-popupSelect>
                    <p @click="$refs.dealUserAdminId.open()" :style="{ color: info.dealUserAdminId ? '' : '#b2b2b2'}" v-if="clientList.length">{{info.dealUserAdminId?clientList.filter(item=>{return info.dealUserAdminId==item.adminId})[0].adminName:'请选择处理人'}}</p>
                    <p @click="$refs.dealUserAdminId.open()" v-else style="color:#b2b2b2">请选择处理人</p>
                  </div>
                </div>
              </div> -->
              <div v-for="(item, index) in orderJson" :key="index">
                <div class="g-form-item" v-if="item.type === 'text'">
                  <p class="g-form-label" :class="item.required ? 'g-required' : ''">{{item.label}}</p>
                  <div class="g-form-cont">
                    <input type="text" class="g-inputs" :placeholder="'请输入' + item.label" v-model.trim="item.value" :maxlength="item.maxLength">
                  </div>
                </div>
                <div class="g-form-item" v-else-if="item.type === 'textarea'">
                  <p class="g-form-label" :class="item.required ? 'g-required' : ''">{{item.label}}</p>
                  <div class="g-form-cont">
                    <textarea class="g-textareas" :placeholder="'请输入' + item.label" v-model.trim="item.value" :maxlength="item.maxLength"></textarea>
                  </div>
                </div>
                <div class="g-form-item" v-else-if="item.type === 'radio'">
                  <p class="g-form-label" :class="item.required ? 'g-required' : ''">{{item.label}}</p>
                  <div class="g-form-cont">
                    <ul class="g-form-radio">
                      <li class="flex-box" v-for="(optionItem, optionIndex) in item.options" :key="optionIndex" @click.stop="item.value = optionItem.key">
                        <i class="i-radio" :class="item.value === optionItem.key ? 'i-radio-active' : ''"></i>
                        <p class="p-radio">{{optionItem.value}}</p>
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="g-form-item" v-else-if="item.type === 'file'">
                  <p class="g-form-label" :class="item.required ? 'g-required' : ''">{{item.label}}</p>
                  <div class="g-img-up">
                    <div class="g-imgshow" v-for="(imgItem, imgIndex) in item.value" :key="imgIndex">
                      <img class="img" :src="imgItem.imgUrl" alt="">
                      <img class="g-delimg" src="../../assets/workorderimg/del.png" alt="" @click.stop="delImg(item.value, imgIndex)">
                    </div>
                    <div class="g-up-default">
                      <input type="file" accept="image/*" @change="e => getImageFile(e, item)" :capture="$store.state.isIOS?false:'camera'">
                    </div>
                  </div>
                </div>
              </div>
              <!-- <div class="g-form-item">
                <div class="g-ups">
                  <div class="g-add-item" v-for="(imgItem, imgIndex) in odImgUrl" :key="imgIndex">
                    <img class="img" :src="imgItem" alt="">
                    <img class="g-del-up" src="../../assets/workorderimg/del.png" alt="" @click.stop="delImg(odImgUrl, imgIndex)">
                  </div>
                  <div class="g-add-item" v-show="odImgUrl.length < 3">
                    <img class="g-img-item" src="../../assets/epidemicImg/icon-up.png" alt="">
                    <input type="file" @change="onFileChangeOne($event)" accept="image/jpeg,image/png">
                  </div>
                </div>
              </div> -->
            </div>
          </div>

          <!-- <div class="g-enter-shadow g-infopeop">
            <div class="flex-box g-contrct-top">
              <h4 class="g-shadow-tit">联系人信息</h4>
              <div class="flex-box" @click="isEdit = true">
                <img class="imgs" src="../../assets/enterpriseImg/icon-edit.png" alt="">
                <p class="p-edit">编辑</p>
              </div>
            </div>
            <ul class="g-infoofbacis">
              <li class="flex-box">
                <img src="../../assets/enterpriseImg/icon-building.png" alt="">
                <p class="p1">{{info.odCompanyName}}</p>
              </li>
              <li class="flex-box">
                <img src="../../assets/enterpriseImg/icon-person.png" alt="">
                <p class="p1" v-if="!isEdit">{{info.odUserName}}</p>
                <input type="text" v-else v-model.trim="nameManual">
              </li>
              <li class="flex-box">
                <img src="../../assets/enterpriseImg/icon-phone.png" alt="">
                <p class="p1" v-if="!isEdit">{{info.odUserPhone}}</p>
                <input type="text" v-else v-model.trim="phoneManual">
              </li>
            </ul>
          </div> -->
        </div >

        <div class="g-emptys-enter" v-if="navIndex === 2">
          <div class="g-conboxs">
            <img class="img" src="../../assets/enterpriseImg/submit-success.png" alt="">
            <p class="p-explain">服务申请已提交，请耐心等待园区反馈</p>
            <div class="g-enterprise-footer g-bots">
              <p v-if="Number($route.query.type)!=3" @click.stop="$router.push('/enterpriseServiceCenter?type='+$route.query.type)">查看我的服务进度</p>
              <p v-else @click.stop="$router.push('/wxEnterpriseServiceCente')">查看我的服务进度</p>
            </div>
          </div>
        </div>
      </v-scroll>
      <div class="g-enterprise-footer" v-if="navIndex === 1">
        <p @click.stop="submits">保存</p>
      </div>
    <!-- </div> -->
  </div>
</template>

<script>
  import * as getData from '../../service/getData'
  import * as mobile from '../../config/mUtils'
  export default {
    data () {
      return {
        isEdit: false,
        navIndex: 1,
        fileList: [],
        info: {
          odCompanyId: '',
          odCompanyName: '',
          odUserPhone: '',
          odUserName: '',
          odUserId: '',
          dealUserAdminId: '',
          dealUserName:'',
          dealUserAdminDeptId:'',
          dealUserAdminDeptName:'',
        },
        nameManual: '',
        phoneManual: '',
        orderJson:[],
        clientList: [],
        odImgUrl:[],
      }
    },
    mounted () {
      // console.log(this.$route.query.orderTypeId,55666);
      // getData.getDepartmentEmployeeByTypeId(this.$route.query.orderTypeId).then(res => {
      //   if (res.data.code === 1) {
      //     this.clientList = res.data.data.list;
      //     console.log(this.clientList,555565);
      //   }
      // })
      // getData.companyUserDetail().then(res => {
      //   if (res.data.code === 1) {
      //     let info = res.data.data
      //     this.info.odCompanyId = info.osCompanyId
      //     this.info.odCompanyName = info.userCompanyName
      //     this.info.odUserPhone = info.userMobile
      //     this.info.odUserName = info.osUserName
      //     this.info.odUserId = info.odUserId
      //     this.nameManual = info.osUserName
      //     this.phoneManual = info.userMobile
      //   }
      // })
      this.orderJson = JSON.parse(this.$store.state.orderTypeInfo.orderJson)
      // getData.getOrderTypeDetail(this.$route.query.orderTypeId).then(res => {
      //   if (res.data.code === 1) {
      //     this.orderJson = JSON.parse(res.data.data.orderJson)
      //   }
      // })
    },
    components: {},

    computed: {},
    methods: {
      submits () {
        // odTypeId	是	int	类型id
        // odUserPhone	否	string	电话
        // odUserName	是	string	联系人名称
        // odUserId	是	int	联系人id
        // odCompanyId	是	long	联系人公司id
        // odCompanyName	是	string	联系人公司名称
        // odDescription	是	long	服务类型id
        // odJson	是	string	自定义json字符串
        let isOk = []
        let odDescription = ''
        this.orderJson.forEach(item => {
          if (item.keyCode === 1) {
            odDescription = item.value
          }
          if (item.required && item.type !== 'file' && !item.value) {
            isOk.push(1)
          } else if (item.required && item.type === 'file' && item.value.length === 0 ) {
            isOk.push(1)
          }
        })
        if (isOk.length > 0) {
          mobile.toast('请完善信息填写!')
          return
        }
        this.$dialog.loading.open('正在努力提交中...')
        let odUserPhone = this.isEdit ? this.phoneManual : this.info.odUserPhone
        let odUserName = this.isEdit ? this.nameManual : this.info.odUserName
        let odImgUrl = this.odImgUrl.length ? this.odImgUrl.join(',') : ''
        getData.submitOrderService(this.$route.query.orderTypeId, this.$store.state.orderTypeInfo.orderDepartmentId, odDescription, this.$store.state.orderTypeInfo.orderTypeType, JSON.stringify(this.orderJson),odImgUrl).then(res => {
          this.$dialog.loading.close();
          if (res.data.code === 1) {
            this.navIndex = 2
          } else {
            mobile.toast(res.data.message)
          }
        }).catch(err=> {
          this.$dialog.loading.close();
        })
      },
      onFileChangeOne(e) {
        if (this.odImgUrl.length === 3) {
          mobile.toast("最多选择3张图片！");
          return;
        }
        let files = e.target.files || e.dataTransfer.files;
        if (!files.length) return;
        console.log(files);
        mobile.selectImgFile(e).then(respense => {
          if (respense.res) {
            this.$dialog.loading.open("正在努力上传中...");
            mobile.selectImgFile(e).then(res => {
              mobile.uploadOss(e, getData.getSystemOssByUrl).then(res => {
                this.odImgUrl.push(res.imgUrl)
                this.$dialog.loading.close();
              }) 
            }).catch(err => {
                this.$dialog.loading.close();
              });
            // mobile
            //   .uploadOss(e, getData.getSystemOssByUrl)
            //   .then(res => {
            //     this.odImgUrl.push(res.imgUrl)
            //     this.$dialog.loading.close();
            //   })
            //   .catch(err => {
            //     this.$dialog.loading.close();
            //   });
          }
        });
      },
      getImageFile (e, item) {
        let files = e.target.files || e.dataTransfer.files;
        let fileName = files[0].name
        if (item.value.length >= 5) {
          mobile.toast('最多上传五张图片')
          return
        }
        if (!files.length) return
        mobile.selectImgFile(e).then(res => {
          mobile.uploadOss(e, getData.getSystemOssByUrl).then(res => {
            item.value.push(res)
          }) 
        })
      },
      getCompanyName(type){
        if(type){
          this.clientList.forEach(ele =>{
            if(ele.adminId == type){
              this.info.dealUserName = ele.adminName;
              this.info.dealUserAdminDeptId = ele.departmentId;
              this.info.dealUserAdminDeptName = ele.departmentName;
            }
          })
        }else{
          this.info.dealUserName = '';
          this.info.dealUserAdminDeptId = '';
          this.info.dealUserAdminDeptName = '';
        }
      },
      delImg (arr, index) {
        arr.splice(index, 1)
      },
    },
    filters: {

    }
  }
</script>

<style scoped lang="scss">
  @import '../../assets/css/mixin';
  .g-answer{
    padding: .4rem;
    margin-bottom: .24rem;
  }
  .g-img-up{
    display: flex;
    .g-up-default, .g-imgshow{
      margin-bottom: .25rem;
      margin-right: .2rem;

    }
    .g-up-default{
      position: relative;
      width: .68rem;
      height: .68rem;
      background: url("../../assets/enterpriseImg/uplaods.png") no-repeat;
      background-size: 100% 100%;
      input{
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        opacity: 0;

      }
    }
    .g-imgshow{
      position: relative;
      width: 1.2rem;
      height: 1.2rem;
      .img{
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .g-delimg{
        position: absolute;
        width: .4rem;
        height: .4rem;
        top: -.1rem;
        right: -.1rem;
      }
    }
  }
  .g-infopeop{
    padding: .4rem;
    .g-contrct-top{
      justify-content: space-between;
      margin-bottom: .28rem;
      .p-edit{
        font-size:.28rem;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(46,115,255,1);
      }
      .imgs{
        @include wh(.3rem, .3rem);
        margin-right: .08rem;
      }
    }
    .g-infoofbacis{
      padding-bottom: .14rem;
      li{
        margin-bottom: .16rem;
        &:last-child{
          margin-bottom: 0;
        }
        img{
          @include wh(.3rem, .3rem);
          margin-right: .11rem;
        }
        .p1{
          font-size:.28rem;
          font-family:PingFang SC;
          font-weight:400;
          color:rgba(102,102,102,1);
          line-height: .58rem;
        }
        input{
          flex: 1;
          height:.58rem;
          background:rgba(250,250,250,1);
          border:1px solid rgba(204,204,204,1);
          border-radius:.06rem;
          font-size:.28rem;
          font-family:PingFang SC;
          font-weight:400;
          color:rgba(102,102,102,1);
          line-height: .58rem;
          padding: 0 .2rem;
          &::placeholder{
            font-size:.28rem;
            font-family:PingFang SC;
            font-weight:400;
            color:rgba(102,102,102,1);
            line-height: .58rem;
          }
        }
      }
    }
  }
  .g-form-item{
    margin-bottom: 0;
  }
  .g-forms-enter{
    .g-forms-enter-items{
      margin-bottom: .32rem;
      &:last-child{
        margin-bottom: 0;
      }
    }
  }
  .g-ups {
    flex-wrap: wrap;
    display: flex;
    padding: 0.2rem 0;
    .g-add-item {
      position: relative;
      width: 1.5rem;
      height: 1.5rem;
      margin-bottom: 0.2rem;
      margin-right: 0.3rem;
      input {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 99;
        opacity: 0;
      }
      .g-img-item,.img {
        width: 100%;
        height: 100%;
      }
      .g-del-up {
        position: absolute;
        width: 0.4rem;
        height: 0.4rem;
        right: -0.2rem;
        top: -0.2rem;
      }
    }
  }
</style>
