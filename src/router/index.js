import Vue from 'vue'
import Router from 'vue-router'

const login = r => require.ensure([], () => r(require('../page/login')), 'login')/* 登录 */
// 首页
const index = r => require.ensure([], () => r(require('../page/index')), 'index')
const mine = r => require.ensure([], () => r(require('../page/mine')), 'mine') //我的
const setUp = r => require.ensure([], () => r(require('../page/设置')), 'setUp')/* 设置 */
const myEnroll = r => require.ensure([], () => r(require('../page/我的推荐')), 'myEnroll')/* 设置 */
const postionDetail = r => require.ensure([], () => r(require('../page/职位详情')), 'postionDetail')/* 职位详情*/
const inputInfo = r => require.ensure([], () => r(require('../page/简历填写')), 'inputInfo')/* 简历填写*/
const myNews = r => require.ensure([], () => r(require('../page/我的信息')), 'inputInfo')/* 我的信息*/




const perfectIdentity = r => require.ensure([], () => r(require('../page/信息完善')), 'perfectIdentity')/* 信息完善 */

const incubateList = r => require.ensure([], () => r(require('../page/园企/入孵审核.vue')), 'incubateList') // 入孵审核
const incubateApply = r => require.ensure([], () => r(require('../page/园企/入孵申请详情.vue')), 'incubateApply') // 入孵申请详情

// 企业服务中心
const enterpriseServiceEvaluation = r => require.ensure([], () => r(require('../page/企业服务/企业服务评价')), 'enterpriseServiceEvaluation')// 企业服务评价
const enterpriseServiceDetails = r => require.ensure([], () => r(require('../page/企业服务/企业服务详情')), 'enterpriseServiceDetails') // 企业服务详情
const enterpriseServiceCenter = r => require.ensure([], () => r(require('../page/企业服务/企业服务中心')), 'enterpriseServiceCenter') // 企业服务中心
const wxEnterpriseServiceCente = r => require.ensure([], () => r(require('../page/企业服务/维修服务中心')), 'wxEnterpriseServiceCente') // 维修服务中心
const chooseEnterpriseService = r => require.ensure([], () => r(require('../page/企业服务/选择服务类型')), 'chooseEnterpriseService') // 选择服务类型
const addEnterpriseService = r => require.ensure([], () => r(require('../page/企业服务/新增企业服务')), 'addEnterpriseService') // 新增企业服务

// 防疫上报
const epidemicPreventionList = r => require.ensure([], () => r(require('../page/防疫/防疫上报列表')), 'epidemicPreventionList') // 防疫上报列表
const epidemicPreventionReport = r => require.ensure([], () => r(require('../page/防疫/防疫上报')), 'epidemicPreventionReport') // 防疫上报
const epidemicPreventionDetail = r => require.ensure([], () => r(require('../page/防疫/防疫上报详情')), 'epidemicPreventionDetail') // 防疫上报

// 通知公告
const noticeList = r => require.ensure([], () => r(require('../page/通知公告/通知公告列表')), 'noticeList') // 通知公告列表
const noticeDetail = r => require.ensure([], () => r(require('../page/通知公告/通知公告详情')), 'noticeDetail') // 通知公告详情

// 联系园区
const contactList = r => require.ensure([], () => r(require('../page/联系园区/联系园区列表')), 'contactList') // 联系园区列表
const contactDetail = r => require.ensure([], () => r(require('../page/联系园区/联系园区详情')), 'contactDetail') // 联系园区详情

// 企业通讯录
const addressBookList = r => require.ensure([], () => r(require('../page/企业通讯录/企业通讯录列表')), 'addressBookList') // 企业通讯录列表



// 企业内部管理
const userManageList = r => require.ensure([], () => r(require('../page/企业内部管理/管理列表')), 'userManageList') // 企业内部管理列表
const userManage = r => require.ensure([], () => r(require('../page/企业内部管理/用户详情')), 'userManage') // 用户申请管理

// 场地预约
const roomReservation = r => require.ensure([], () => r(require('../page/场地预约/场地预约')), 'roomReservation')/* 场地预约 */
const myReservation = r => require.ensure([], () => r(require('../page/场地预约/我的预约')), 'myReservation')/* 我的预约 */
const appointmentExamine = r => require.ensure([], () => r(require('../page/场地预约/预约审批')), 'appointmentExamine')
const roomDetail = r => require.ensure([], () => r(require('../page/场地预约/场地详情')), 'roomDetail')/* 场地详情 */
const appointmentRecord = r => require.ensure([], () => r(require('../page/场地预约/预约记录详情')), 'appointmentRecord')
const makeAppointment = r => require.ensure([], () => r(require('../page/场地预约/我要预约')), 'makeAppointment')/* 我要预约 */
const appointmentConfirm = r => require.ensure([], () => r(require('../page/场地预约/确认预约')), 'appointmentConfirm')/* 确认预约 */
const faceInfo = r => require.ensure([], () => r(require('../page/场地预约/人脸信息')), 'faceInfo')/* 人脸信息 */
const addFaceInfo = r => require.ensure([], () => r(require('../page/场地预约/新增人脸信息')), 'addFaceInfo')/* 新增人脸信息 */
const appointmentFace = r => require.ensure([], () => r(require('../page/场地预约/预约的人脸')), 'appointmentFace')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '',
      redirect: '/login'
    },
    {
      path: '/index',
      name: '求职中心',
      meta: {nokeepAlive: true, keepLogin: false},
      component: index
    },
    {
      path: '/mine',
      name: '我的',
      meta: {nokeepAlive: true, keepLogin: false},
      component: mine
    },
    {
      path: '/login',
      name: '登录',
      meta: {nokeepAlive: true, keepLogin: false},
      component: login
    },
    {
      path: '/setUp',
      name: '设置',
      meta: {nokeepAlive: true, keepLogin: true},
      component: setUp
    },
    {
      path: '/myEnroll',
      name: '我的推荐',
      meta: {nokeepAlive: true, keepLogin: true},
      component: myEnroll
    },
    {
      path: '/postionDetail',
      name: '职位详情',
      meta: {nokeepAlive: true, keepLogin: true},
      component: postionDetail
    },
    {
      path: '/inputInfo',
      name: '投递简历',
      meta: {nokeepAlive: true, keepLogin: true},
      component: inputInfo
    },
    {
      path: '/myNews',
      name: '我的信息',
      meta: {nokeepAlive: true, keepLogin: true},
      component: myNews
    },





    {
      path: '/perfectIdentity',
      name: '信息完善',
      meta: {nokeepAlive: true, keepLogin: true},
      component: perfectIdentity
    },
    {
      path: '/incubateList',
      name: '入孵审核',
      meta: { nokeepAlive: true, keepLogin: true },
      component: incubateList
    },
    {
      path: '/incubateApply',
      name: '入孵申请详情',
      meta: { nokeepAlive: true, keepLogin: true },
      component: incubateApply
    },
    {
      path: '/enterpriseServiceEvaluation',
      name: '企业服务评价',
      meta: {nokeepAlive: true, keepLogin: true},
      component: enterpriseServiceEvaluation
    },
    {
      path: '/enterpriseServiceDetails',
      name: '企业服务详情',
      meta: {nokeepAlive: true, keepLogin: true},
      component: enterpriseServiceDetails
    },
    {
      path: '/enterpriseServiceCenter',
      name: '企业服务中心',
      meta: {nokeepAlive: true, keepLogin: true},
      component: enterpriseServiceCenter
    },
    {
      path: '/wxEnterpriseServiceCente',
      name: '维修服务中心',
      meta: { nokeepAlive: true, keepLogin: true },
      component: wxEnterpriseServiceCente
    },
    {
      path: '/chooseEnterpriseService',
      name: '选择服务类型',
      meta: {nokeepAlive: true, keepLogin: true},
      component: chooseEnterpriseService
    },
    {
      path: '/addEnterpriseService',
      name: '新增企业服务',
      meta: {nokeepAlive: true, keepLogin: true},
      component: addEnterpriseService
    },
    {
      path: '/epidemicPreventionList',
      name: '防疫上报列表',
      meta: {nokeepAlive: true, keepLogin: true},
      component: epidemicPreventionList
    },
    {
      path: '/epidemicPreventionReport',
      name: '防疫上报',
      meta: {nokeepAlive: true, keepLogin: true},
      component: epidemicPreventionReport
    },
    {
      path: '/epidemicPreventionDetail',
      name: '防疫上报详情',
      meta: {nokeepAlive: true, keepLogin: true},
      component: epidemicPreventionDetail
    },
    {
      path: '/noticeList',
      name: '通知公告列表',
      meta: {nokeepAlive: true, keepLogin: true},
      component: noticeList
    },
    {
      path: '/noticeDetail',
      name: '通知公告详情',
      meta: {nokeepAlive: true, keepLogin: true},
      component: noticeDetail
    },
    {
      path: '/contactList',
      name: '联系园区列表',
      meta: {nokeepAlive: true, keepLogin: true},
      component: contactList
    },
    {
      path: '/contactDetail',
      name: '联系园区详情',
      meta: { nokeepAlive: true, keepLogin: true },
      component: contactDetail
    },
    {
      path: '/addressBookList',
      name: '企业通讯录',
      meta: { nokeepAlive: true, keepLogin: true },
      component: addressBookList
    },
    {
      path: '/userManageList',
      name: '企业内部管理列表',
      meta: { nokeepAlive: true, keepLogin: true },
      component: userManageList
    },
    {
      path: '/userManage',
      name: '用户申请管理',
      meta: { nokeepAlive: true, keepLogin: true },
      component: userManage
    },
    {
      path: '/roomReservation',
      name: '场地预约',
      meta: { nokeepAlive: true, keepLogin: true },
      component: roomReservation
    },
    {
      path: '/myReservation',
      name: '我的预约',
      meta: { nokeepAlive: true, keepLogin: true },
      component: myReservation
    },
    {
      path: '/appointmentExamine',
      name: '预约审批',
      meta: { nokeepAlive: true, keepLogin: true },
      component: appointmentExamine
    },
    {
      path: '/roomDetail',
      name: '场地详情',
      meta: { nokeepAlive: true, keepLogin: true },
      component: roomDetail
    },
    {
      path: '/appointmentRecord',
      name: '预约记录详情',
      meta: { nokeepAlive: true, keepLogin: true },
      component: appointmentRecord
    },
    {
      path: '/makeAppointment',
      name: '我要预约',
      meta: { nokeepAlive: true, keepLogin: true },
      component: makeAppointment
    },
    {
      path: '/appointmentConfirm',
      name: '确认预约',
      meta: { nokeepAlive: true, keepLogin: true },
      component: appointmentConfirm
    },
    {
      path: '/faceInfo',
      name: '人脸信息',
      meta: { nokeepAlive: true, keepLogin: true },
      component: faceInfo
    },
    {
      path: '/addFaceInfo',
      name: '新增人脸信息',
      meta: { nokeepAlive: true, keepLogin: true },
      component: addFaceInfo
    },
    {
      path: '/appointmentFace',
      name: '预约的人脸信息',
      meta: { nokeepAlive: true, keepLogin: true },
      component: appointmentFace
    }
  ]
})

