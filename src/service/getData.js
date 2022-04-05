import axios from 'axios'
import store from '../story/'
import router from './../router'
import { ossUrl } from '../config/env'

import * as mobile from './../config/mUtils'
// import Mock from 'mockjs'

let searchParams = (prop) => {
  let param = new FormData()
  for (let key in prop) {
    param.append(key, prop[key])
  }
  return param
}

axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  config.params = Object.assign({ time: new Date().getTime() }, config.params)
  // config.headers['token'] = store.state.parkToken || mobile.getCookie('parkToken')/* store.state.parkToken || mobile.getStore('parkToken') */
  config.headers['token'] = mobile.getCookie('parkToken') || ''
  config.headers['phone'] =  mobile.getCookie('userPhone') || ''/* store.state.userPhone || mobile.getStore('userPhone') */
  config.headers['channelId'] = store.state.channelId
  // config.headers['userId'] = 39 //用户id
  // config.headers['companyId'] = 1486 //公司id
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

const pageSize = 10

let domain = mobile.getSession('domain')

// 添加一个响应拦截器
axios.interceptors.response.use(function (res) {
  if (res.data.code == 2) {
    localStorage.setItem('fullPath', router.history.current.fullPath)
    router.replace({ path: '/login' })
    mobile.removeStore('parkToken')
    mobile.removeCookie('parkToken')
    store.state.parkToken = ''
    mobile.removeCookie('userToken', domain)
    mobile.removeCookie('userMobile', domain)
    store.state.userPhone = ''

    return res
  } else if(res.data.code == 4){
    router.replace('/perfectIdentity?isOver=1')
    return res
  }
  if (res.headers && (res.headers['content-type'] === 'application/x-msdownload' || res.headers['content-type'] === 'application/vnd.ms-excel')) {
    downloadUrl(res.request.responseURL)
    return { data: { code: 1 } }
  }
  return res
}, function (err) {
  // Do something with response error
  return Promise.reject(err)
})

/**
 * 字符串拼接
 * @param info 要拼接的对象
 * @param type 是否是需要？拼接
 */
const stringJoin = (info, type) => {
  let headerString = ''
  if (!info) {
    return ''
  }
  Object.keys(info).map((data, index) => {
    if (index === 0 && type === 2) {
      headerString += data + '=' + info[data]
    } else if (index === 0 && type) {
      headerString += '?' + data + '=' + info[data]
    } else {
      headerString += '&' + data + '=' + info[data]
    }
  })
  return headerString
}

/**
 * 获取企业移动端url
 * 参数名  必选  类型  说明
 * url  是  string  域名
 */
var getChannelByUrl = (url) => axios.get('/api/user/getChannelByUrl?url=' + url)
/**
 * 获取oss token
 *
 */
var getSystemOssByUrl = () => axios.get('/api/systemOss/systemOssByUrl?url=' + ossUrl)
/**
 *
 * 登录接口
 * phone  是  string  手机号
 * phoneCode  是  string  验证码
 */
var login = (phone, phoneCode) => axios.post('/api/user/login', `phone=${phone}&phoneCode=${phoneCode}`)
/**
 * 登录验证码
 * phone  是  string  手机号
 * channelId  long  渠道id
 */
var sendCode = (phone, channelId) => axios.post('/api/user/sendCode', `phone=${phone}&channelId=${channelId}`)

/**
 * 用户完善信息
 * companyId  是  Long  公司Id
 * name  是  string  用户名
 */
var completeInfo = (companyId, name) => axios.get('/api/user/completeInfoSendMessage?companyId=' + companyId + '&name=' + name)

/**
 * 完善用户信息获取公司列表
 * str  否  string  搜索字段
 */
var getCompanyIdAndName = (str) => axios.get('/api/user/getCompany?str=' + str)
/**
 * 获取企业移动端url
 * 参数名  必选  类型  说明
 * url  是  string  域名
 */
var getChannelById = (id) => axios.get('/api/user/getChannelById?channelId=' + id)

/**
 * 分享创业政策接口
 * url  是  string  分享url
 */
var share = (url) => axios.get('/api/weiXin/weixinConfig?type=4&url=' + url)

/**
 * 待我审批列表
 *
 */
let allList = (data) => axios.get('incubationApi/approvalProcess/allList', { params: data })

/**
 * 审批详情
 *
 */
let getDetail = (applicationId) => axios.get('incubationApi/approvalProcess/getDetail?applicationId=' + applicationId)

/**
 * 审批
 */
let approval = (data) => axios.post(`incubationApi/approvalProcess/approval`, JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } })




// 企业服务
/**
 * 企业服务列表
 * pageIndex  是  int  页码
 pageSize  是  int  每页显示数
 */
const getCompanyServiceList = (params) => axios.get(store.state.companyApiUrl + 'mhapi/propertyApi/getCompanyServiceList', {params: params})

/**
 * 企业服务类型列表接口
 */
const getOrderTypeList = (params) => axios.get(store.state.companyApiUrl + 'mhapi/propertyApi/getOrderTypeList', {params: params})

/**
 * 企业服务类型详情接口
 */
const getOrderTypeDetail = (odId) => axios.get(store.state.companyApiUrl + 'mhapi/propertyApi/getOrderDetail?odId=' + odId)

/**
 * 添加企业服务
 * 参数名  必选  类型  说明
 odTypeId  是  int  类型id
 odUserPhone  否  string  电话
 odUserName  是  string  联系人名称
 odUserId  是  int  联系人id
 odCompanyId  是  long  联系人公司id
 odCompanyName  是  string  联系人公司名称
 odDescription  是  long  服务类型id
 odJson  是  string  自定义json字符串
 */
const submitOrderService = (odTypeId, odDepartmentId, odDescription, odTypeType, odJson, odImgUrl) => axios.post(store.state.companyApiUrl + 'mhapi/propertyApi/submitOrderService', `odTypeId=${odTypeId}&odDepartmentId=${odDepartmentId}&odDescription=${odDescription}&odTypeType=${odTypeType}&odJson=${odJson}&odImgUrl=${odImgUrl}`)

/**
 * 新增工单服务时人员详情
 */
const companyUserDetail = () => axios.get(store.state.companyApiUrl + 'mhapi/propertyApi/userDetail')

/**
 * 获取反馈类型
 */
const getFeedbackTypes = () => axios.get(store.state.companyApiUrl + 'mhapi/feedback/getFeedbackTypes')

/**
 * 评价服务工单接口
 * 参数名  必选  类型  说明
 commentTotalScore  是  int  总评分
 commentAttitudeScore  是  int  服务态度评分
 commentEffectivenessScore  是  int  服务效率评分
 commentQualityScore  是  int  服务质量评分
 commentRemarks  否  String  备注
 commentImgUrl  否  string  评价图片(如果有多张图片则用逗号分隔)
 commentDepartmentOrderId  是  long  服务工单id
 */
const companyAddComment = (commentTotalScore, commentAttitudeScore, commentEffectivenessScore, commentQualityScore, commentRemarks, commentImgUrl, commentDepartmentOrderId) => axios.post(store.state.companyApiUrl + 'mhapi/propertyApi/addComment', `commentTotalScore=${commentTotalScore}&commentAttitudeScore=${commentAttitudeScore}&commentEffectivenessScore=${commentEffectivenessScore}&commentQualityScore=${commentQualityScore}&commentRemarks=${commentRemarks}&commentImgUrl=${commentImgUrl}&commentDepartmentOrderId=${commentDepartmentOrderId}`)

/**
 * 企业服务详情接口
 * 参数名  必选  类型  说明
 odId  是  long  企业服务主键id
 */
const getOrderDetail = (odId) => axios.get(store.state.companyApiUrl + 'mhapi/propertyApi/getOrderDetail?odId=' + odId)


/**
 * 上报类型下拉列表
 */
const getEpidemicReportTypeList = () => axios.get(store.state.companyApiUrl + 'mhapi/epidemicReport/getEpidemicReportTypeList')

/**
 * 新增/编辑防疫上报
 * 参数名  必选  类型  说明
erTypeId	是	string	防疫上报类型id
erContent	是	string	报备内容
erJson	是	string	模板内容json
erFileUrl	是	string	文件上传地址
erId
 */
const editEpidemicReport = (data) => axios.post(store.state.companyApiUrl + '/mhapi/epidemicReport/editEpidemicReport', stringJoin(data, 2))

/**
 * 防疫申报列表
 */
// const getEpidemicReportList = () => axios.get(store.state.companyApiUrl + 'mhapi/epidemicReport/getEpidemicReportList')
const getEpidemicReportList = (pageIndex, pageSize) => axios.get(store.state.companyApiUrl + 'mhapi/epidemicReport/getEpidemicReportList?pageIndex=' + pageIndex + '&pageSize=' + pageSize)

/**
 * 查看防疫上报详情
 * 参数名  必选  类型  说明
 */
const getEpidemicReportDetail = (erId) => axios.get(store.state.companyApiUrl + 'mhapi/epidemicReport/getEpidemicReportDetail?erId=' + erId)

/**
 * 园区公告列表
 * pageIndex  否  Integer  页码
 * pageSize  否  Integer  每页大小
 */
var getparkNoticeList = (pageIndex, pageSize) => axios.get('/api/parkNotice/getParkNoticeList?pageIndex=' + pageIndex + '&pageSize=' + pageSize)

/**
 * 园区公告详情接口
 * id  是  Long  园区公告Id
 */
var getParkNoticeDetail = (id, phone) => axios.get('/api/parkNotice/getEnterpriseDetail?id=' + id + '&phone=' + phone)

/**
 *  公告浏览人
 */
var getNoticeLook = (params) => axios.get('/api/parkNotice/getNoticePeopleList', { params: params })

/**
 * 联系园区列表
 */
var getParkContractList = (params) => axios.get('api/addressBook/addressBookAdminList', { params: params })

/**
 * 园区联系人详情
 */
var parkContractDetail = (params) => axios.get('api/addressBook/adminDetail', { params: params })

/**
 * 企业通讯录
 */
var companyContractList = (params) => axios.get('api/addressBook/addressBookUserList', { params: params })
/**
 * 取消服务接口
 */
var cancelOrderService = (odId) => axios.post(store.state.companyApiUrl + 'mhapi/propertyApi/cancelOrderService', `odId=${odId}`)

/**
 * 预约智慧型场地权限验证
 * @returns {AxiosPromise}
 */
let checkUserConfirmState = () => axios.get(store.state.channelMortarApiUrl + 'api/field/checkUserConfirmState')

/**
 * 会议室列表接口
 * pageIndex 楼宇物业编号
 * name
 */
var meetingRoomList = (pageIndex, pageSize, name) => axios.get(store.state.channelMortarApiUrl + 'api/field/fieldList?pageIndex=' + pageIndex + '&pageSize=' + pageSize + '&name=' + name)

/**
 * app-场地-详情加预约接口
 * 参数名  必选  类型  说明
 * fieldId  是  long  场地id
 * date  是  date  时间 2018-05-23 13:00:00
 */
var fieldDetailWithTimeApp = (fieldId, date) => axios.get(store.state.channelMortarApiUrl + 'api/field/fieldDetailWithTimeApp?fieldId=' + fieldId + '&date=' + date)

/**
 * 我的主页详情接口
 */
var getUserDetail = () => axios.get('/api/myData/getUserDetail')

/**
 * 我的预约记录
 * pageIndex 当前页
 * checkState 审核状态
 *
 */
var appointmentList = (pageIndex, checkState) => axios.get(store.state.channelMortarApiUrl + 'api/appointment/appointmentList?pageIndex=' + pageIndex + '&checkState=' + checkState)

/**
 * 预约记录列表接口
 * pageIndex 当前页
 * state 状态【0-待审批 1-已审批】
 *
 */
var fieldAppointmentList = (pageIndex, state) => axios.get(store.state.channelMortarApiUrl + 'api/field/appointmentList?pageIndex=' + pageIndex + '&state=' + state)

/**
 * app-场地-详情加图片接口
 * 参数名  必选  类型  说明
 * fieldId  是  long  场地id
 */
var fieldDetail = (fieldId) => axios.get(store.state.channelMortarApiUrl + 'api/field/fieldDetail?fieldId=' + fieldId)

/**
 * 预约记录详情接口
 * appId 	预约记录编号
 *
 */
var appointmentDetail = (appId) => axios.get(store.state.channelMortarApiUrl + 'api/field/appointmentDetail?appId=' + appId)

/**
 * 新增预约(普通型)
 * @author quantangkun
 * @param session session
 * @param appMrId  meetRoomId
 * @param startTime 开始时间
 * @param endTime 结束时间
 * @return java.util.Map<java.lang.String,java.lang.Object>
 * 2018/8/16 11:17
 * */
var addAppointmentOfPT = (data) => axios.post(store.state.channelMortarApiUrl + 'api/appointment/addAppointmentOfPT', JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } })

/**
 * 新增预约(智慧型)
 * @author quantangkun
 * @param session session
 * @param appMrId  meetRoomId
 * @param startTime 开始时间
 * @param endTime 结束时间
 * @return java.util.Map<java.lang.String,java.lang.Object>
 * 2018/8/16 11:17
 * */
let addAppointmentOfZH = (data) => axios.post(store.state.channelMortarApiUrl + 'api/appointment/addAppointmentOfZH', JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } })

/**
 * app-场地-详情加图片接口
 * 参数名  必选  类型  说明
 * fieldId  是  long  场地id
 */
let fieldDetailConfirm = (data) => axios.post(store.state.channelMortarApiUrl + 'api/field/fieldDetailConfirm', JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } })

/**
 * 场地人脸照片
 *  userId  是  int  用户id
 *  photo  是  string  照片
 */
var fieldFaceList = () => axios.get(store.state.channelMortarApiUrl + 'api/fieldFace/fieldFaceList')

/**
 *  h5新增场地人脸照片
 *  userId  是  int  用户id
 *  photo  是  string  照片
 */
var addFieldFace = (fieldFaceName, fieldFacePhoto, fieldFaceIsDefault) => axios.post(store.state.channelMortarApiUrl + 'api/fieldFace/addFieldFace', `fieldFaceName=${fieldFaceName}&fieldFacePhoto=${fieldFacePhoto}&fieldFaceIsDefault=${fieldFaceIsDefault}`)

/**
 *  h5编辑场地人脸
 *  userId  是  int  用户id
 *  photo  是  string  照片
 */
var updateFieldFace = (fieldFaceId, fieldFaceIsDefault) => axios.post(store.state.channelMortarApiUrl + 'api/fieldFace/updateFieldFace', `fieldFaceId=${fieldFaceId}&fieldFaceIsDefault=${fieldFaceIsDefault}`)

/**
 * 删除场地人脸
 * @returns {AxiosPromise}
 */
var delFieldFace = (fieldFaceId) => axios.post(store.state.channelMortarApiUrl + 'api/fieldFace/delFieldFace?fieldFaceId=' + fieldFaceId)


/**
 * 场地预约
 * @returns {AxiosPromise}
 */
let wxAppointmentPayment = (data) => axios.post(store.state.channelMortarApiUrl + 'api/appointment/wxPayment', JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } })

/**
 * 免费智慧场地预约
 * @returns {AxiosPromise}
 */
let addNoPaymentAppointmentOfZH = (data) => axios.post(store.state.channelMortarApiUrl + 'api/appointment/addNoPaymentAppointmentOfZH', JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } })

/**
 * 取消预约/结束使用
 * @returns {AxiosPromise}
 */
let endAppointment = (appId, type) => axios.post(store.state.channelMortarApiUrl + 'api/field/endAppointment', `appId=${appId}&type=${type}`)

/**
 * 查询会议室人脸下发进度
 */
let getFieldPhotoIssuedState = (params) => axios.get(store.state.channelMortarApiUrl + 'api/appointment/getFieldPhotoIssuedState', { params: params })

/**
 * 会议室修改人脸重新上传
 * code  是  string  微信上换取的code
 */
let editFieldPhoto = (appId, photoUrl) => axios.post(store.state.channelMortarApiUrl + 'api/appointment/editFieldPhoto', `appId=${appId}&photoUrl=${photoUrl}`)

/**
 * 新增预约(智慧型)
 参数名	必选	类型	说明
  appId	是	Long	预约记录编号
  appMrId	是	Long	会议室编号
  appState【1待审批2审核通过3已驳回4预约成功5已取消6支付中7已使用】	是	Integer	审核状态
  appReason	是	string	审批意见
  appointmentRecordList（json格式）	是	List	预约记录List
 * */
let updateAppointment = (data) => axios.post(store.state.channelMortarApiUrl + 'api/field/updateAppointment', JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } })

/**
 * 获取wx支付url
 *
 */
var getAppointmentWXCode = (data) => axios.post(store.state.channelMortarApiUrl + 'api/appointment/getWXCode', JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } })

/**
 * 获取openId
 */
let resultAppointmentOpenId = (code) => axios.get(store.state.channelMortarApiUrl + '/api/appointment/resultOpenId?code=' + code)

/**
 * 企业内部管理列表
 */
let companyManageList = (params) => axios.get(store.state.companyApiUrl + 'mhapi/appCompanyManage/userExamineList', {params: params})

/**
 * 用户审批
 */
let userAudit = (data) => axios.post(store.state.companyApiUrl + 'mhapi/appCompanyManage/userAudit', searchParams(data))

/**
 * 获取维修服务类型
 */
let getWxOderType = () => axios.get(store.state.companyApiUrl + 'mhapi/propertyApi/getWxOderType')



/**
* 登录请求
* 参数：
* 参数名 必选 类型 说明
*/
let checkLogin = (data) => axios.post(`/march/login`, JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } })

/**
 * 
 * 首页职位区 
 */
  let recruitList = (params) => axios.get('/march/recruitList',{params: params});

export {
  getChannelByUrl,
  getSystemOssByUrl, getUserDetail,
  // 防疫管理
  share, getChannelById,

  // 孵化
  allList, getDetail, approval,

  // 企业服务
  getCompanyServiceList, getOrderTypeList, submitOrderService, companyUserDetail, companyAddComment,
  getOrderDetail, getOrderTypeDetail, getFeedbackTypes, cancelOrderService, getWxOderType,

  // 防疫
  getEpidemicReportTypeList, editEpidemicReport, getEpidemicReportList, getEpidemicReportDetail,

  // 登录
  login, sendCode, completeInfo, getCompanyIdAndName,

  // 园区公告
  getparkNoticeList, getParkNoticeDetail, getNoticeLook,

  // 联系园区
  getParkContractList, parkContractDetail,

  // 企业通信录
  companyContractList,

  // 场地预约
  checkUserConfirmState, meetingRoomList, fieldDetailWithTimeApp, appointmentList, fieldAppointmentList, fieldDetail,
  appointmentDetail, addAppointmentOfPT, addAppointmentOfZH, fieldDetailConfirm, fieldFaceList, addFieldFace, updateFieldFace,
  delFieldFace, wxAppointmentPayment, addNoPaymentAppointmentOfZH, endAppointment, getFieldPhotoIssuedState, editFieldPhoto,
  updateAppointment, getAppointmentWXCode, resultAppointmentOpenId,

  // 企业内部管理
  companyManageList, userAudit,

  //手机端登录
  checkLogin, recruitList,

}
