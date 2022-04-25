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
// axios.interceptors.response.use(function (res) {
//   if (res.data.code == 2) {
//     localStorage.setItem('fullPath', router.history.current.fullPath)
//     router.replace({ path: '/login' })
//     mobile.removeStore('parkToken')
//     mobile.removeCookie('parkToken')
//     store.state.parkToken = ''
//     mobile.removeCookie('userToken', domain)
//     mobile.removeCookie('userMobile', domain)
//     store.state.userPhone = ''

//     return res
//   } else if(res.data.code == 4){
//     router.replace('/perfectIdentity?isOver=1')
//     return res
//   }
//   if (res.headers && (res.headers['content-type'] === 'application/x-msdownload' || res.headers['content-type'] === 'application/vnd.ms-excel')) {
//     downloadUrl(res.request.responseURL)
//     return { data: { code: 1 } }
//   }
//   return res
// }, function (err) {
//   // Do something with response error
//   return Promise.reject(err)
// })

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

  /**
 * 用户信息查询
 * 字段
 */
 let userDetail = (userId) => axios.get('/march/admin/userDetail?userId=' + userId);

   /**
 * 修改账号状态
 * 
 */
 let statusUpdate = (data) => axios.put(`/march/admin/userStatus`,JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });

/**
 * 我的推荐
 */
 let myResumeInfo = (userId) => axios.get('/march/getResumeInfoByUserId?userId='+userId);

/*简历删除
*/
let resumetDel = (resumeInfoId) => axios.get('/march/deleResumeInfo?resumeInfoId='+resumeInfoId);

/*获取职位详情
*/
let getRecruitIdDetail = (recruitId) => axios.get('/march/LookById?recruitId='+recruitId);

/*
简历上传
  */
let resumetAdd = (data) => axios.post(`/march/resumeInfoAdd`,JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });

/**
 * 用户信息修改
 * 字段
 */
 let userInfoEdit = (data) => axios.post(`/march/admin/userUpdate`,JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });


export {
  getChannelByUrl,
  getSystemOssByUrl, 
  // 登录
  login, sendCode, 
  //手机端登录
  checkLogin, recruitList, userDetail, statusUpdate, myResumeInfo, resumetDel, getRecruitIdDetail, resumetAdd, userInfoEdit,

}
