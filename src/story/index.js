import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './action'
import getters from './getters'

Vue.use(Vuex)
let channel = (() => {
  if ('test-pk-m.hzqisheng.cn'.indexOf(window.location.hostname) >= 0) {
    return 'http://p-api.hzqisheng.com'
  } else {
    return 'http://kjsb-api.zhihuipk.com'
  }
})()
const state = {
  appId: '', // APPID
  selectCompany: '',
  userName: '', // 用户名称
  userPhone: '', // 用户手机号
  platform: '', // 手机系统
  phoneType: '', // 手机型号(1是X)
  parkToken: '', // 用户token
  h5phoneType: 0, // h5页面手机型号(1是X)
  channelId: 1, // 渠道id
  channelName: '天瑞国际', // 渠道名称
  webTitle: '天瑞国际', // 网页名称
  channelMortarApiUrl: '', // 闸机http://192.168.0.182:8080/
  channelIncubationUrl:'',

  position: {}, // 之前页面位置
  arrPageName: 'index', // 当前页面NAME
  channelAppLogoUrl: '', // 登录页面logo
  companyApiUrl: '', // 企业门户域名
  channelApiUrl: '', // 招商楼宇
  channelChannelApiUrl: '', // 内部工作流
  userConfirmState: 1,
  channelChannelApiUrl: '',
  orderTypeInfo: '',//服务类型信息

  floorList: [],
  buildInfo: {},
  clientInfo: {},
  first: 0,
  user: {}, // 用户信息
  companyInfo: {}, // 选择的企业信息

  selectDate: '', // 出入记录选择的时间
  payMoney: '',
  myFace: '',
  selectFace: '',

  addInfo: '',

  visitorPhoto: '', // 访客人脸url
  visitorPhotoId: '', // 访客人脸id
  visitorName: '',
  visitorPhone: '',
  visitorNum: 1,
  visitorTime: 1,
  visitorPurpose: '',
  visitorContent: '',
  visitorIdCard: '',
  isEditVisitor: false,
  visitorCompanyInfo: {},

  stateIndex: '',
  serviceIndex: '',

  channelArchivesApiUrl: '',
  channelMediaFrontUrl: '',
  vehicleInfo: {},
  ticketInfo: '',
  securityList: '',
  securityVideo: {},
  workflowId: '',//工作流id
  workflowApplicationCreateTime: '',//工作流申请日期

  baseName: '',
  baseCompanyId: 0,
  baseCompanyName: '',
  pdCompanyId: 0,
  pdCompanyName: '',

  pointId:'',//点位id
  objectName:'',//点位名称
  isNumber:true,//是不是纯数字
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
