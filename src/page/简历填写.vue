<template>
  <div class="warp page1">
    <v-zhajiheader headTitle="简历填写" v-if="!addSuccessShow">
    </v-zhajiheader>
    <!-- <div class="g-visitbg-top"><img src="../assets/visitImg/bg.png" alt=""></div> -->
    <v-scroll class="main-box1 scroll" ref="my_scroller" v-if="!addSuccessShow">
      <div style="position: relative;z-index:2">
        <div class="basic-info">
          <div class="g-basic-item">
            <div class="g-basic-label">
              <div class="g-basic-icon">
                <img src="../../static/img/reg-001.png" alt="">
              </div>
              <div class="g-basic-title">
                姓名<span class="g-font-danger">*</span>
              </div>
            </div>
            <div class="g-basic-input">
              <input class="basic-input" @blur="bridges.scrollToTop()" v-model.trim="basic.recommendedName" placeholder="请输入姓名" maxlength="20" />
            </div>
          </div>
          <div class="g-basic-item">
            <div class="g-basic-label">
              <div class="g-basic-icon">
                <img src="../../static/img/reg-002.png" alt="">
              </div>
              <div class="g-basic-title">
                手机号<span class="g-font-danger">*</span>
              </div>
            </div>
            <div class="g-basic-input">
              <input class="basic-input" v-model.trim="basic.recommendedTelephone" placeholder="请输入手机号" maxlength="11" @blur="checkPhone;bridges.scrollToTop()"/>
            </div>
          </div>
          <div class="g-basic-item">
            <div class="g-basic-label">
              <div class="g-basic-icon">
                <img src="../../static/img/reg-003.png" alt="">
              </div>
              <div class="g-basic-title">
                身份证号<span class="g-font-danger">*</span>
              </div>
            </div>
            <div class="g-basic-input">
              <input class="basic-input" v-model.trim="basic.recommendedIdcard"  placeholder="请输入身份证号" @blur="checkIdCard;bridges.scrollToTop()"/>
            </div>
          </div>
          <div class="g-basic-item" @click.stop="show=true">
            <div class="g-basic-label">
              <div class="g-basic-icon">
                <img src="../../static/img/reg-004.png" alt="">
              </div>
              <div class="g-basic-title">
                性别
              </div>
            </div>
            <div class="g-basic-input flex-box" style="justify-content: flex-end">
              <p class="p1">{{visitorsNumberOption[basic.sex].label}}</p>
              <i class="iconfont icon-jinru-copy icon"></i>
            </div>
          </div>
          <div class="g-basic-item" @click.stop="show1=true">
            <div class="g-basic-label">
              <div class="g-basic-icon">
                <img src="../../static/img/reg-006.png" alt="">
              </div>
              <div class="g-basic-title">
                学历
              </div>
            </div>
            <div class="g-basic-input flex-box" style="justify-content: flex-end">
              <p class="p1" v-if="basic.recommendedEducation">{{recommendedEducationList[basic.recommendedEducation-1].label}}</p>
              <p v-else style="color: gainsboro;font-size:.3rem">请选择学历</p>
              <i class="iconfont icon-jinru-copy icon"></i>
            </div>
          </div>
        </div>
        <div class="visitor-warp">
          <!-- <h3 class="visitor-title">基本信息</h3> -->
          <!-- <ul class="objective-select">
            <li class="objective-select-item flex-box" :class="{active:basic.visitPurpose==item.id}"
                v-for="(item,index) in objectiveList"
                :key="index" @click.stop="selectObjective(item,index)">
              <h3 class="title">{{item.title}}</h3>
            </li>
          </ul> -->
          <van-popup v-model="showTimeSelect" position="bottom" :style="{ height: '50%' }">
              <van-datetime-picker
              v-model="currentDate"
              type="date"
              title="选择年月日"
              @confirm="onConfirmselectTime"
              :min-date="minDate"
              :max-date="maxDate"
            />
          </van-popup>
          
          <!-- <van-calendar v-model="showTimeSelect" @confirm="onConfirmselectTime" :min-date="new Date('1970/01/01')" :max-date="new Date()"/> -->
           <!-- <van-calendar v-model="showTimeSelect" color="#1989fa" type="range" :show-confirm="false"  @confirm="onConfirmselectTime" allow-same-day/> -->
          <div class="basic-info" style="border:none">
            <div class="g-basic-item" @click="showTimeSelect = true">
              <div class="g-basic-label">
                <div class="g-basic-icon g-basic-icon-mini">
                  <img src="../../static/img/reg-010.png" alt="">
                </div>
                <div class="g-basic-title g-basic-title-mini">
                  <p>出生日期<span class="g-font-danger">*</span></p>
                </div>
              </div>
              <div class="g-basic-input flex-box" style="justify-content: flex-end">
                <p v-if="basic.recommendedBirth" class="p1">{{new Date(basic.recommendedBirth.replace('-','/')).format('yyyy-MM-dd')}}</p>
                <span v-else class="tip-info">请选择出生日期</span>
                <!-- <i class="iconfont icon-jinru-copy icon"></i> -->
              </div>
            </div>
            <div class="g-basic-item">
              <div class="g-basic-label">
                <div class="g-basic-icon g-basic-icon-mini">
                  <img src="../../static/img/reg-007.png" alt="">
                </div>
                <div class="g-basic-title g-basic-title-mini">
                  <p>民族<span class="g-font-danger">*</span></p>
                </div>
              </div>
              <div class="g-basic-input flex-box" style="justify-content: flex-end">
                <input class="basic-input" @blur="bridges.scrollToTop()" v-model.trim="basic.recommendednation" placeholder="请输入民族" maxlength="20" />
              </div>
            </div>
            <div class="g-basic-item">
              <div class="g-basic-label">
                <div class="g-basic-icon g-basic-icon-mini">
                  <img src="../../static/img/reg-007.png" alt="">
                </div>
                <div class="g-basic-title g-basic-title-mini">
                  <p>年龄<span class="g-font-danger">*</span></p>
                </div>
              </div>
              <div class="g-basic-input flex-box" style="justify-content: flex-end">
                <input class="basic-input" @blur="bridges.scrollToTop()" v-model.trim="basic.recommendedAge" placeholder="请输入年龄" maxlength="20" />
              </div>
            </div>
            <div class="g-basic-item">
              <div class="g-basic-label">
                <div class="g-basic-icon g-basic-icon-mini">
                  <img src="../../static/img/reg-007.png" alt="">
                </div>
                <div class="g-basic-title g-basic-title-mini">
                  <p>电子邮箱<span class="g-font-danger">*</span></p>
                </div>
              </div>
              <div class="g-basic-input flex-box" style="justify-content: flex-end">
                <input class="basic-input" @blur="bridges.scrollToTop()" v-model.trim="basic.recommendedEmail" placeholder="请输入电子邮箱" maxlength="20" />
              </div>
            </div>
            <div class="g-basic-item">
              <div class="g-basic-label">
                <div class="g-basic-icon g-basic-icon-mini">
                  <img src="../../static/img/reg-007.png" alt="">
                </div>
                <div class="g-basic-title g-basic-title-mini">
                  <p>家庭地址<span class="g-font-danger">*</span></p>
                </div>
              </div>
              <div class="g-basic-input flex-box" style="justify-content: flex-end">
                <input class="basic-input" @blur="bridges.scrollToTop()" v-model.trim="basic.address" placeholder="请输入家庭地址" maxlength="20" />
              </div>
            </div>
            <div class="g-basic-item">
              <div class="g-basic-label">
                <div class="g-basic-icon g-basic-icon-mini">
                  <img src="../../static/img/reg-007.png" alt="">
                </div>
                <div class="g-basic-title g-basic-title-mini">
                  <p>籍贯<span class="g-font-danger">*</span></p>
                </div>
              </div>
              <div class="g-basic-input flex-box" style="justify-content: flex-end">
                <input class="basic-input" @blur="bridges.scrollToTop()" v-model.trim="basic.recommendedProvince" placeholder="请输入籍贯" maxlength="20" />
              </div>
            </div>
            <div class="g-basic-item" @click="show2 = true">
              <div class="g-basic-label">
                <div class="g-basic-icon g-basic-icon-mini">
                  <img src="../../static/img/reg-007.png" alt="">
                </div>
                <div class="g-basic-title g-basic-title-mini">
                  <p>政治面貌<span class="g-font-danger">*</span></p>
                </div>
              </div>
              <div class="g-basic-input flex-box" style="justify-content: flex-end">
                <p class="p1" v-if="basic.recommendedPolitical">{{basic.recommendedPolitical}}</p>
                <p v-else style="color: gainsboro;font-size:.3rem">请选择政治面貌</p>
                <i class="iconfont icon-jinru-copy icon"></i>
              </div>
            </div>
            <div class="g-basic-item" @click="show3 = true">
              <div class="g-basic-label">
                <div class="g-basic-icon g-basic-icon-mini">
                  <img src="../../static/img/reg-007.png" alt="">
                </div>
                <div class="g-basic-title g-basic-title-mini">
                  <p>婚姻状况<span class="g-font-danger">*</span></p>
                </div>
              </div>
              <div class="g-basic-input flex-box" style="justify-content: flex-end">
                <p class="p1" v-if="basic.recommendedMarital">{{basic.recommendedMarital}}</p>
                <p v-else style="color: gainsboro;font-size:.3rem">请选择婚姻状况</p>
                <i class="iconfont icon-jinru-copy icon"></i>
              </div>
            </div>
            <div class="g-basic-item">
              <div class="g-basic-label">
                <div class="g-basic-icon g-basic-icon-mini">
                  <img src="../../static/img/reg-007.png" alt="">
                </div>
                <div class="g-basic-title g-basic-title-mini">
                  <p>所修专业<span class="g-font-danger">*</span></p>
                </div>
              </div>
              <div class="g-basic-input flex-box" style="justify-content: flex-end">
                <input class="basic-input" @blur="bridges.scrollToTop()" v-model.trim="basic.recommendedMajor" placeholder="请输入所修专业" maxlength="20" />
              </div>
            </div>
            
          </div>
          <h3 class="visitor-content flex-box">
              <div class="g-basic-content">
                <img src="../../static/img/reg-009.png" alt="">
              </div>
              <p>荣誉证书</p>
            </h3>
            <div class="visitor-textarea">
              <textarea v-model.trim="basic.recommendedGainCertificate" placeholder="请填写1-3个荣誉证书" @blur="bridges.scrollToTop()" ></textarea>
            </div>
            <h3 class="visitor-content flex-box">
              <div class="g-basic-content">
                <img src="../../static/img/reg-009.png" alt="">
              </div>
              <p>专业技能</p>
            </h3>
            <div class="visitor-textarea">
              <textarea v-model.trim="basic.recommendedProfessionalInfo" placeholder="专业技能" @blur="bridges.scrollToTop()" ></textarea>
            </div>
            <h3 class="visitor-content flex-box">
              <div class="g-basic-content">
                <img src="../../static/img/reg-009.png" alt="">
              </div>
              <p>工作经历</p>
            </h3>
            <div class="visitor-textarea">
              <textarea v-model.trim="basic.recommendedWorkInfo" placeholder="工作经历" @blur="bridges.scrollToTop()" ></textarea>
            </div>
            <h3 class="visitor-content flex-box">
              <div class="g-basic-content">
                <img src="../../static/img/reg-009.png" alt="">
              </div>
              <p>项目经验</p>
            </h3>
            <div class="visitor-textarea">
              <textarea v-model.trim="basic.recommendedProgramInfo" placeholder="" @blur="bridges.scrollToTop()" ></textarea>
            </div>
          <h3 class="visitor-content flex-box">
            <div class="g-basic-content">
              <img src="../../static/img/reg-009.png" alt="">
            </div>
            <p>自我评价</p>
          </h3>
          <div class="visitor-textarea">
            <textarea v-model.trim="basic.recommendedSelfEvaluation"  @blur="bridges.scrollToTop()"></textarea>
          </div>
          <h3 class="visitor-content flex-box">
            <div class="g-basic-content">
              <img src="../../static/img/reg-011.png" alt="">
            </div>
            <p>简历图片<span v-if="this.$store.state.channelId==274" class="g-font-danger">*</span></p>
          </h3>
          <div class="visitor-img">
            <v-upload-file :number="1" :size="1" :img="true" @onFileChange="onImgChange"></v-upload-file>
          </div>
        </div>
      </div>
    </v-scroll>
    <v-visit-footer-square title="提交简历" @submits="submits"></v-visit-footer-square>
    <yd-popup class="g-confirm g-zhaji-confirm2" v-model="show" position="center" width="6.3rem"
              :close-on-masker="true">
      <div class="g-choose-confirm">
        <div class="g-choose-box" :class="{active:basic.sex===item.value}"
             v-for="(item,index) in visitorsNumberOption" @click="visitorsCheck(item,index)">
          {{item.label}}
        </div>
      </div>
    </yd-popup>
    <yd-popup class="g-confirm g-zhaji-confirm2" v-model="show1" position="center" width="6.3rem"
              :close-on-masker="true">
      <div class="g-choose-confirm">
        <div class="g-choose-box" :class="{active:basic.recommendedEducation===item.value}"
             v-for="(item,index) in recommendedEducationList" @click="setRecommendedEducation(item,index)">
          {{item.label}}
        </div>
      </div>
    </yd-popup>
    <yd-popup class="g-confirm g-zhaji-confirm2" v-model="show2" position="center" width="6.3rem"
              :close-on-masker="true">
      <div class="g-choose-confirm">
        <div class="g-choose-box" :class="{active:basic.recommendedPolitical===item}"
             v-for="(item,index) in recommendedPoliticalList" @click="setRecommendedPolitical(item,index)">
          {{item}}
        </div>
      </div>
    </yd-popup>
    <yd-popup class="g-confirm g-zhaji-confirm2" v-model="show3" position="center" width="6.3rem"
              :close-on-masker="true">
      <div class="g-choose-confirm">
        <div class="g-choose-box" :class="{active:basic.recommendedMarital===item}"
             v-for="(item,index) in recommendedMaritalList" @click="setRecommendedMarital(item,index)">
          {{item}}
        </div>
      </div>
    </yd-popup>
    <yd-popup class="g-confirm g-zhaji-confirm2" v-model="addSuccessShow" position="center" width="5rem"
              :close-on-masker="true">
      <div class="pay-popup-warp" style="height:auto">
        <div class="pay-popup-box" style="height:auto">
          <div class="pay-popup-icon1 tip"></div>
          <div class="pay-popup-info1">{{`简历提交成功，请耐心等待审核结果`}}</div>
        </div>
        <!-- <div class="pay-popup-bottom"  @click.stop="addSuccessShow = false;$router.go(-1)">关闭</div> -->
      </div>
    </yd-popup>

    <yd-popup class="g-example-dialog" v-model="showExample" position="center" width="6.2rem" :close-on-masker="true">
      <div class="g-example">
        <img src="http://public.hzqisheng.cn/FsuzHU-L-GDGCD82h1JGp6DW6f9B" alt="">
        <div class="comfirm-photo" @click="showExample = false;">
          <v-photo :first="1" @feedback="goSure" v-if="!$store.state.visitorPhoto"></v-photo>
          我已知晓，开始录入
        </div>
        <div class="cancel-photo" @click="showExample = false">暂不录入</div>
      </div>
    </yd-popup>
    <div class="g-submit-over flex-box" v-if="addSuccessShow">
        <div class="g-submit-over-box clearfix">
          <div class="g-over-pic">
            <img class="f-adapt-img" src="../assets/images/in-review.png" alt="">
          </div>
          <p class="g-over-content">认证审核中，请耐心等待！</p>
        </div>
      </div>

  </div>
</template>

<script>
  import * as getData from '../service/getData'
  import * as mobile from '../config/mUtils'
  import {upload, getExtranetUrl} from '../plugins/oss-sdk'

  export default {
    data() {
      return {
        addSuccessShow: false,//是否完成信息完善
        objectiveList: [
          {
            title: '业务来访',
            id: 1,
          },
          {
            title: '人员面试',
            id: 2,
          },
          {
            title: '参观访问',
            id: 3,
          },
          {
            title: '其它来访',
            id: 4,
          },
        ],
        basic: {
          recommendedName: '',
          tjId: '',
          recommendedProvince: '',
          recommendednation: '',
          recommendedBirth: '',
          sex: 0,
          recommendedAge:'',
          recommendedPolitical: '',
          recommendedEducation: '',
          recommendedMarital:'',
          recommendedIdcard: '',
          recommendedTelephone: '',
          address:'',
          recommendedMajor:'',
          recommendedEmail:'',
          recommendedAttend:'',
          recommendedSelfEvaluation:'',
          recommendedGainCertificate:'',
          recommendedProgramInfo: '',
          recommendedWorkInfo: '',
          recommendedProfessionalInfo:'',
          recommendedPhoto:'',
          hrId:'',
        },
        minDate: new Date(1985, 0, 1),
        maxDate: new Date(2025, 10, 1),
        faceInfo: {
          facePersonName: '',
        },
        currentDate: '',
        visitorsNumberOption: [
          {label: '男', value: 0}, {label: '女', value: 1}
        ],
        recommendedEducationList: [
          {label: '九年教育', value: 1},
          {label: '大专', value: 2},
          {label: '本科', value: 3},
          {label: '研究生', value: 4},
          {label: '其他', value: 6},
        ],
        recommendedPoliticalList:['群众','共青团员','党员'],
        recommendedMaritalList:['已婚','未婚','离异'],
        show: false,
        show1: false,
        show2: false,
        show3: false,
        isSubmit: false,
        carNumber:"",
        showExample:false,
        showTimeSelect: false,
        timeType: 1 ,//1:固定来访时间；2:自定义来访时间
        // endMax: new Date().add('d', 6),
        visitorReviewFileUrl: []
      }
    },
    mounted() {
      this.basic.recruitId = Number(this.$route.query.checkType);
      this.basic.hrId = Number(this.$route.query.hrId);
      this.basic.tjId = Number(this.$route.query.userId);
    },
    components: {},

    computed: {},
    methods: {
      formatDate(date) {
        let dateymd = date.split(' ')[0]
        let datam = dateymd.split('-')[1];
        let datad = dateymd.split('-')[2];
        return `${datam}/${datad}`;
      },
      onConfirmselectTime(date){
        this.basic.recommendedBirth = new Date(date).format('yyyy-MM-dd hh:mm:ss');
        this.showTimeSelect = false
      },
      selectTime(row, index) {
        this.basic.effectiveTime = row.id;
        this.$store.state.visitorTime = row.id;
        this.$store.state.startTime = row.startTime;
        this.$store.state.endTime = row.endTime;
      },
      selectObjective(row, index) {
        this.basic.visitPurpose = row.id;
        this.$store.state.visitorPurpose = row.id;
      },
      checkPhone() {
        var myReg = /^1[3|4|5|7|8][0-9]\d{4,8}$/
        if (!myReg.test(this.basic.recommendedTelephone)) {
          mobile.toast('手机号格式错误')
          return false
        }else{
          return true
        }
      },
      checkIdCard () {
        console.log(mobile.rule.recommendedIdcard(this.basic.recommendedIdcard))
        return mobile.rule.recommendedIdcard(this.basic.recommendedIdcard)
      },
      visitorsCheck(row, index) {
        this.basic.sex = row.value;
        this.show = false;
      },
      setRecommendedEducation(row, index) {
        this.basic.recommendedEducation = row.value;
        this.show1 = false;
      },
      setRecommendedPolitical(row, index) {
        this.basic.recommendedPolitical = row;
        this.show2 = false;
      },
      setRecommendedMarital(row, index) {
        this.basic.recommendedMarital = row;
        this.show3 = false;
      },
      lookPhoto () {
        if (this.$store.state.visitorPhoto) {
          // this.$router.push('/visitorFace')
          this.$router.push('/visitorFace?visitState=2')
        }else{
          this.showExample = true;
        }
      },
      goSure (data) {
        this.basic.photo = data.url
        this.$store.state.visitorPhoto = data.url
        this.$router.push('/visitorConfirm')
      },
      onImgChange(data) {
        this.visitorReviewFileUrl = data.fileList.map((item)=>{
          return item.exportFile
        })
        console.log(this.visitorReviewFileUrl)
      },
      submits() {
        if (this.isSubmit) {
          mobile.toast('请勿重复提交');
          return
        }
        this.isSubmit = true
        
        if (!this.basic.recommendedName) {
          this.isSubmit = false
          mobile.toast('请输入姓名');
          return
        }
        if (!this.checkPhone()) {
          this.isSubmit = false
          return
        }
        if (!this.basic.recommendedIdcard) {
          this.isSubmit = false
          mobile.toast('请输入身份证号');
          return
        }
        if (!this.checkIdCard()) {
          this.isSubmit = false
            return
          }
        if (!this.basic.recommendedEducation) {
          this.isSubmit = false
          mobile.toast('请选择学历');
          return
        }
         getData.resumetAdd(this.basic)
          .then(resp => {
            if (resp.data.code === 200) {
              this.isSubmit = false
              this.addSuccessShow = true
            } else {
            }
          }).catch(failResponse => {})

      },
      addId(){
        this.carNumber = this.$store.state.carNumber.join(",")
        let visitorReviewPersonId = ""
        let visitorReviewPersonName = ""
        visitorReviewPersonId = this.$store.state.visitorReviewPersonInfo.userId?this.$store.state.visitorReviewPersonInfo.userId:""
        visitorReviewPersonName = this.$store.state.visitorReviewPersonInfo.userName?this.$store.state.visitorReviewPersonInfo.userName:""
        let id = Number(this.$route.query.visitorReviewId)
        getData.submitVisitorReview(id,this.basic.name, this.basic.phone, this.$store.state.visitorCompanyInfo.companyId, this.basic.recommendedIdcard, this.basic.content, this.$store.state.startTime, this.$store.state.endTime, this.userId, this.basic.visitPurpose, this.basic.visitorsNum, this.basic.photoId, this.$store.state.visitorCompanyInfo.companyIsPark, this.carNumber, visitorReviewPersonId, visitorReviewPersonName,this.visitorReviewFileUrl.join(',')).then(res => {
          if (res.data.code === 1) {
            this.isSubmit = false
            // mobile.toast('添加成功');
            this.addSuccessShow = true
            // this.$router.go(-1);
          } else {
            this.isSubmit = false
            mobile.toast(res.data.message)
          }
        })
      },
      addNotId(){
        this.carNumber = this.$store.state.carNumber.join(",")
        let visitorReviewPersonId = ""
        let visitorReviewPersonName = ""
        visitorReviewPersonId = this.$store.state.visitorReviewPersonInfo.userId?this.$store.state.visitorReviewPersonInfo.userId:""
        visitorReviewPersonName = this.$store.state.visitorReviewPersonInfo.userName?this.$store.state.visitorReviewPersonInfo.userName:""

        getData.newAddVisitorReview(this.basic.name, this.basic.phone, this.$store.state.visitorCompanyInfo.companyId, this.basic.recommendedIdcard, this.basic.content, this.$store.state.startTime,this.$store.state.endTime, this.userId, this.basic.visitPurpose, this.basic.visitorsNum, this.basic.photoId, this.$store.state.visitorCompanyInfo.companyIsPark, this.carNumber, visitorReviewPersonId, visitorReviewPersonName,this.visitorReviewFileUrl.join(',')).then(res => {
          if (res.data.code === 1) {
            this.isSubmit = false
            // mobile.toast('添加成功');
            this.addSuccessShow = true
            // this.$router.go(-1);
          } else {
            this.isSubmit = false
            mobile.toast(res.data.message)
          }
        })
      },
      delImg(){
        this.$store.state.visitorPhoto = '';
        this.basic.photo = '';
      },
    }
  }
</script>

<style scoped lang="scss">
  @import '../assets/css/mixin';

  .g-visitbg-top {
    position: relative;

    img {
      position: absolute;
      top: -2.57rem;
      height: 4.25rem;
      width: 100%;
      z-index: 0
    }
  }

  .g-visittype {
    justify-content: space-around;

    p {
      position: relative;
      z-index: 1;
      font-size: .3rem;
      font-family: PingFangSC-Medium;
      color: rgba(255, 255, 255, 1);
      opacity: 0.6;
      line-height: .8rem;
    }

    .g-active {
      opacity: 1;

      &:after {
        position: absolute;
        content: '';
        bottom: 0;
        left: 50%;
        margin-left: -.3rem;
        width: .6rem;
        height: .04rem;
        background: rgba(255, 255, 255, 1);
        border-radius: .02rem;
      }
    }
  }

  .g-visitlist {
    padding: .4rem .2rem 0;
  }

  .basic-info {
    background: #fff;
    // border-radius: .40rem .40rem 0 0;
    position: relative;
    z-index: 100;
    padding: 0 .2rem;
    box-sizing: border-box;
    border-bottom: 0.28rem solid #f2f3fa;
    border-top: .3rem solid #f2f3fa;

    .g-basic-item {
      position: relative;
      width: 100%;
      height: 1.2rem;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #EAEAEA;

      .g-basic-label {
        display: flex;
        align-items: center;
        .g-basic-icon {
          width: .77rem;
          height: .77rem;
          margin-right: .21rem;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .g-basic-icon-mini{
          width: .32rem;
          height: .32rem;
          margin-right: .09rem;
        }

        .g-basic-title {
          font-size: .28rem;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: rgba(67, 67, 67, 1);
          line-height: .28rem;
          > p {
            font-size: .28rem;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            color: rgba(67, 67, 67, 1);
            line-height: .28rem;
          }
          .tips-info {
            font-size: .22rem;
            font-family: PingFang SC;
            font-weight: 400;
            color: #999999;
            padding-top: .1rem;
          }
        }

        .g-basic-title-mini{
          font-size: .26rem;
          > p {
            font-size: .26rem;
          }
        }
      }

      .g-basic-img{
        width: .88rem;
        height: .88rem;
        margin-right: .1rem;
        margin-left: 0.2rem;
        position: relative;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
        .g-delimg{
          position: absolute;
          width: .4rem;
          height: .4rem;
          top: -.1rem;
          right: -.1rem;
        }
      }
      .g-basic-input {
        flex: 1;
        /*height: .30rem;*/
        text-align: right;
        height: 100%;
        .p1{
          font-size: .30rem;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: #434343;
          line-height: .30rem;
          margin-top: -.08rem;
        }
        .basic-input {
          width: 100%;
          height: 100%;
          text-align: right;
          font-size: .30rem;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: #434343;
          line-height: .30rem;
          padding: 0 .17rem;
          box-sizing: border-box;

          &::placeholder {
            font-size: .30rem;
            color: rgba(204, 204, 204, 1);
            line-height: .30rem;
          }
        }

        .icon {
          @include sc(.46rem, #999);
          margin-right: .05rem;
        }
      }
    }

    .tips {
      height: .73rem;

      .tips-icon {
        width: .26rem;
        height: .26rem;
        margin-top: .03rem;
        margin-left: .08rem;
        margin-right: .11rem;
        vertical-align: middle;
      }
    }
  }

  .people {
    height: 1.2rem;
    border-radius: 0;
    border-top: .2rem solid rgba(242, 243, 250, 1);
    border-bottom: none;
  }

  .visitor-warp {
    width: calc(100% - .4rem);
    margin: 0 auto;
    position: relative;
    z-index: 100;
    padding-bottom: .4rem;

    .visitor-invitation {
      margin-top: .45rem;
      position: relative;
      width: 100%;
      height: 2.21rem;
      padding: .53rem .3rem .42rem .23rem;
      box-sizing: border-box;
      background: #fff;
      box-shadow: 0 .07rem .23rem .04rem rgba(203, 216, 234, 0.3);
      border-radius: .10rem;
      z-index: 100;

      .img-box {
        width: 1.44rem;
        height: 1.26rem;
        margin-right: .21rem;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .content {
        flex: 1;
        overflow: auto;

        .title {
          font-size: .30rem;
          font-family: PingFangSC-Medium;
          font-weight: 500;
          color: rgba(67, 67, 67, 1);
          line-height: .30rem;
        }

        > p {
          margin-top: .2rem;
          font-size: .26rem;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: rgba(102, 102, 102, 1);
          line-height: .30rem;
        }
      }
    }

    .visitor-title {
      display: flex;
      align-items: center;
      padding-top: .3rem;
      font-size: .30rem;
      font-family: PingFangSC-Medium;
      font-weight: 500;
      color:#333;
      line-height: .60rem;

      .title-icon {
        width: .44rem;
        height: .44rem;
        margin-right: .23rem;
      }

    }

    .visitor-content {
      padding: .3rem .2rem 0;
      .g-basic-content{
        width: .32rem;
        height: .32rem;
        margin-right: .09rem;
        img{
          width: 100%;
          height: 100%;
        }
      }

      >p{
        font-size: .26rem;
        font-family: PingFang SC;
        font-weight: 400;
        color: #4D4B4B;
        line-height: .26rem;
      }
    }

    .time-select, .objective-select {
      width: 100%;
      display: flex;
      margin-top: .19rem;

      .time-select-item, .objective-select-item {
        width: calc((100% - .4rem) / 3);
        height: 1rem;
        background: rgba(255, 255, 255, 1);
        border: 1px solid rgba(220, 220, 220, 1);
        border-radius: .10rem;
        margin-left: .2rem;
        text-align: center;
        padding-top: .18rem;
        box-sizing: border-box;

        .title, .content {
          font-size: .26rem;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: rgba(102, 102, 102, 1);
          line-height: .30rem;
        }

        .content {
          margin-top: .08rem;
        }
      }

      .time-select-item:first-child, .objective-select-item:first-child {
        margin-left: 0;
      }

      .time-select-item.active, .objective-select-item.active {
        border: 1px solid rgba(44, 122, 238, 1);

        .title, .content {
          font-weight: 500;
          color: rgba(44, 122, 238, 1);
        }
      }
    }

    .objective-select {
      margin-top: .2rem;

      .objective-select-item {
        width: calc((100% - .6rem) / 4);
        height: .6rem;
        padding-top: 0;
        justify-content: center;
      }
    }

    .visitor-textarea {
      margin-top: .20rem;
      width: 100%;
      height: 1.2rem;
      /*border: 1px solid rgba(220, 220, 220, 1);*/
      border-radius: .10rem;
      padding: 0 0.2rem;

      > textarea {
        width: 100%;
        height: 100%;
        padding: .1rem .2rem;
        box-sizing: border-box;
        border: 1px solid rgba(220, 220, 220, 1);
        border-radius: .10rem;
      }
    }
    .visitor-img{
      width: 100%;
      // height: 1.2rem;
      /*border: 1px solid rgba(220, 220, 220, 1);*/
      border-radius: .10rem;
      padding: 0 0.2rem;
    }

    .passage-area {
      margin-top: .18rem;

      .passage-area-item {
        font-size: .26rem;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
        line-height: .36rem;
      }
    }
  }

  .active {
    color: rgba(44, 122, 238, 1);
  }

  .upload-input {
    position: absolute;
    top: 0;
    left: 0;
    @include wh(100%, 100%);
    opacity: 0;
  }

  .tip-info {
    font-size: .26rem;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(153, 153, 153, 1);
    line-height: .30rem;
  }

  .g-font-danger{
    margin-left: .1rem;
  }

  .pay-popup-warp {
      width: 100%;
      height: 3.6rem;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0 .08rem .20rem 0 rgba(215, 215, 215, 0.5);
      border-radius: .20rem;
      padding: 0;
      box-sizing: border-box;

      .pay-popup-box {
        width: 100%;
        height: 2.56rem;
        border-bottom: .02rem solid #EAEAEA;
        padding-top: .62rem;
        box-sizing: border-box;

        .pay-popup-icon {
          width: .92rem;
          height: .92rem;
          margin: 0 auto;
        }

        .pay-popup-icon1 {
          width: 1.52rem;
          height: 1.52rem;
          margin: 0 auto;
        }

        .pay-popup-icon.success {
          background: url('../../static/img/payment-icon/success_icon.png') no-repeat;
          background-size: 100% 100%;
        }

        .pay-popup-icon1.tip {
          background: url('../../static/img/icon_chefeizhifu_success.png') no-repeat;
          background-size: 100% 100%;
        }

        .pay-popup-icon.error {
          background: url('../../static/img/payment-icon/error_iocn.png') no-repeat;
          background-size: 100% 100%;
        }

        .pay-popup-info {
          margin-top: .34rem;
          font-size: .28rem;
          font-family: PingFangSC-Medium, PingFangSC;
          font-weight: 500;
          color: rgba(102, 102, 102, 1);
          line-height: .40rem;
          text-align: center;
        }

        .pay-popup-info1 {
          // margin-top: .34rem;
          font-size: .28rem;
          font-family: PingFangSC-Medium, PingFangSC;
          font-weight: 500;
          padding: 0.1rem 0.6rem 0.3rem;
          color: rgba(102, 102, 102, 1);
          line-height: .40rem;
          text-align: center;
        }
      }

      .pay-popup-bottom {
        width: 100%;
        height: 1rem;
        font-size: .40rem;
        font-family: PingFangSC-Medium, PingFangSC;
        font-weight: 500;
        color: rgba(29, 161, 255, 1);
        line-height: 1rem;
        text-align: center;

        .pay-popup-btn {
          flex: 1;
          font-size: .32rem;
          font-family: PingFangSC-Medium, PingFangSC;
          font-weight: 500;
          color: #333;
          line-height: 1rem;
          text-align: center;
        }

        .pay-popup-btn:nth-child(n+2) {
          border-left: 1px solid #EAEAEA;
        }

        .pay-popup-btn.blue {
          color: rgba(29, 161, 255, 1);
        }
      }
    }

  .g-example-dialog {
    .g-example {
      text-align: center;
      background: #fff;
      border-radius: 0.1rem;
      img {
        @include wh(6.2rem, 9.08rem);
      }
      .comfirm-photo{
        margin:0 auto;
        width: 60%;
        height: 0.7rem;
        background: #3F7DEF;
        border-radius: 1rem;
        font-size: 0.28rem;
        font-weight: 400;
        color: #FFFFFF;
        text-align: center;
        line-height: 0.7rem;
        position: relative;
      }
      .cancel-photo{
        font-size: 0.24rem;
        margin:0 auto;
        padding: 0.3rem 0;
        font-weight: 400;
        color: #999999;
      }

      i {
        display: inline-block;
        @include sc(.56rem, $fc);
        padding: .1rem;
      }
    }
  }
  .g-form-box,.g-submit-over>.g-submit-over-box{
    margin: auto;
    /* padding-top: .46rem;
    width: 6.9rem;
    border-radius: .12rem;
    box-shadow: 0 0 1rem RGBA(214, 214, 214, 0.8); */
    .g-form-title{
      margin-bottom: .22rem;
      @include sc(.32rem,#333);
      line-height: .4rem;
      font-weight: 700;
      text-align: center;
    }
    .g-form-input{
      margin: 0 auto .3rem;
      width: 5.26rem;
      .g-label{
        @include sc(.28rem,#333);
        line-height: .7rem;
      }
      .g-input{
        @include wh(100%,.58rem);
        border: 1px solid #cccccc;
        @include fj();
        align-items: center;
        border-radius: .04rem;
        padding-right: .13rem;
        input{
          @include wh(calc(100% - .44rem),100%);
          padding-left: .25rem;
          @include sc(.26rem,#333);
          &::placeholder{
            color: #CCCCCC;
          }
        }
        .icon-quxiao{
          @include wh(.44rem,.44rem);
          @include sc(.28rem,#777777);
          line-height: .44rem;
          text-align: center;
        }
        .i-sanjiao{
          position: relative;
          @include wh(.44rem,.44rem);
          &:before{
            content: '';
            @include cl;
            top: .15rem;
            @include wh(0,0);
            border-width: .14rem .11rem;
            border-style: solid;
            border-color: #333333 transparent transparent transparent;
          }
        }
      }
    }
    .g-form-btn{
      display: block;
      margin: .5rem auto;
      @include wh(5.26rem,.7rem);
      border-radius: .35rem;
      background: #3f7def;
      @include sc(.28rem,#fff);
    }
  }
  .g-search-main,.g-submit-over{
    position: absolute;
    top: 0;
    left: 0;
    @include wh(100%,100%);
    background: #fff;
    .g-search-input{
      margin: .3rem auto 0;
      @include wh(6.9rem,.6rem);
      padding: 0 .23rem 0 0;
      @include fj();
      align-items: center;
      border: 1px solid #777777;
      border-radius: .3rem;
      .iconfont{
        display: block;
        @include wh(.44rem,.44rem);
        @include sc(.32rem,#dcdee1);
        text-align: center;
        line-height: .44rem;
      }
      input{
        @include wh(calc(100% - .44rem),100%);
        padding-left: .3rem;
        @include sc(.28rem,#777777);
        &::placeholder{
          color: #ccc;
        }
      }
    }
    .g-company-list{
      margin-top: .09rem;
      padding: 0 .3rem;
      .g-list-item{
        @include wh(100%,.89rem);
        border-bottom: 1px solid #D8DFE4;
        @include sc(.28rem,#777777);
        line-height: .89rem;
      }
    }
  }
  .g-submit-over{
    .g-submit-over-box{
      padding-bottom: 0;
      .g-over-pic{
        margin: .24rem auto;
        @include wh(3.46rem,2.54rem);
      }
      .g-over-content{
        /* margin: .36rem auto; */
        text-align: center;
        /* width: 3.3rem; */
        @include sc(.3rem,#333333);
        line-height: .54rem;
      }
      .g-over-btn{
        display: block;
        margin: .57rem auto .7rem;
        @include wh(3.28rem,.68rem);
        border-radius: .34rem;
        border: .02rem solid #3f7def;
        @include sc(.26rem,#3f7def);
      }
    }
  }
</style>
